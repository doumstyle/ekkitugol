<?php

namespace App\Controller;

use App\Entity\Profile;
use App\Form\ProfileForm;
use App\Repository\ProfileRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/profile')]
final class ProfileController extends AbstractController
{
    #[Route(name: 'app_profile_index', methods: ['GET'])]
    public function index(ProfileRepository $profileRepository, Request $request): Response
    {
        $user = $this->getUser();

        $currentRouteName = $request->attributes->get('_route');
        $currentPath = $request->getPathInfo();

        return $this->render('learn/index.html.twig', [
            'profile' => $profileRepository->findByUser($user),
            'user' => $user,
            'currentRouteName' => $currentRouteName,
            'currentPath' => $currentPath,
        ]);
    }

    #[Route('/new', name: 'app_profile_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        $profile = new Profile();
        $form = $this->createForm(ProfileForm::class, $profile);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $user = $this->getUser();
            $profile->setUser($user);

            $picture = $form->get('picture')->getData();
            $ogPicture = pathinfo($picture->getClientOriginalName(), PATHINFO_FILENAME);
            $safePicture = $slugger->slug($ogPicture);

            $newPicture = $safePicture . '-' . uniqid() . '.' . $picture->guessExtension();

            $picture->move($this->getParameter('profileImgDir'), $newPicture);

            $profile->setPicture($newPicture);

            $entityManager->persist($profile);
            $entityManager->flush();

            return $this->redirectToRoute('app_profile_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('profile/new.html.twig', [
            'profile' => $profile,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_profile_show', methods: ['GET'])]
    public function show(Profile $profile): Response
    {
        return $this->render('profile/show.html.twig', [
            'profile' => $profile,
        ]);
    }

    #[Route('/{id}', name: 'app_profile_delete', methods: ['POST'])]
    public function delete(Request $request, Profile $profile, EntityManagerInterface $entityManager): Response
    {
       /** @var \App\Entity\User|null $currentUser */
        $currentUser = $this->getUser();

        // Ensure a user is logged in.
        if (!$currentUser) {
            // This scenario should ideally be prevented by firewall rules for authenticated routes.
            throw $this->createAccessDeniedException('You must be logged in to delete a profile.');
        }

        // Check if the profile being deleted belongs to the currently logged-in user.
        if ($profile->getUser() !== $currentUser) {
            throw $this->createAccessDeniedException('You are not authorized to delete this profile.');
        }

        if ($this->isCsrfTokenValid('delete' . $profile->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($profile);
            $entityManager->flush();
            $this->addFlash('success', 'Profile deleted successfully.');
        } else {
            $this->addFlash('danger', 'Invalid security token. Profile not deleted.');
        }

        return $this->redirectToRoute('app_profile_index', [], Response::HTTP_SEE_OTHER);
    }
}
