<?php

namespace App\Controller;

use App\Entity\Profile;
use App\Form\ProfileForm;
use App\Repository\SoundsRepository;
use App\Repository\ProfileRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\UserSoundProgressRepository;
use Symfony\Component\String\Slugger\SluggerInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/** @var \App\Entity\User|null $user */
final class LearnController extends AbstractController
{    
    #[Route('/learn', name: 'app_learn')]
    public function index(Request $request, ProfileRepository $profileRepository): Response
    {
        /** @var \App\Entity\User|null $user */
        $user = $this->getUser();

        $currentRouteName = $request->attributes->get('_route');
        $currentPath = $request->getPathInfo();

        if (!$user) {
            $this->addFlash('warning', 'Vous devez être connecté pour accéder à cette page.');
            return $this->redirectToRoute('app_login');
        }

        return $this->render('learn/index.html.twig', [
            'user' => $user,
            'profile' => $profileRepository->findByUser($user),
            'currentRouteName' => $currentRouteName,
            'currentPath' => $currentPath,
        ]);
    }

    
    #[Route('/{id}/edit', name: 'app_profile_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Profile $profile, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        
        /** @var \App\Entity\User|null $user */
        
        $user = $this->getUser();
        
        if (!$user) {
            $this->addFlash('warning', 'Vous devez être connecté pour éditez un profil');
            return $this->redirectToRoute('app_login');
        }
        
        if ($profile->getUser()->getId() !== $user->getId()) {
            throw $this->createAccessDeniedException("Vous n'êtes pas autorisé à modifier ce profil.");
        }
        
        $form = $this->createForm(ProfileForm::class, $profile);
        $form->handleRequest($request);
        
        $currentRouteName = $request->attributes->get('_route');
        $currentPath = $request->getPathInfo();
        
        if ($form->isSubmitted() && $form->isValid()) {
            $picture = $form->get('picture')->getData();
            $ogPicture = pathinfo($picture->getClientOriginalName(), PATHINFO_FILENAME);
            $safePicture = $slugger->slug($ogPicture);
            
            $newPicture = $safePicture . '-' . uniqid() . '.' . $picture->guessExtension();
            $picture->move($this->getParameter('profileImgDir'), $newPicture);
            
            $profile->setPicture($newPicture);
            $entityManager->flush();
            
            return $this->redirectToRoute('app_profile_index', [], Response::HTTP_SEE_OTHER);
        }
        
        return $this->render('profile/edit.html.twig', [
            'profile' => $profile,
            'form' => $form,
            'user' => $user,
            'currentRouteName' => $currentRouteName,
            'currentPath' => $currentPath,
        ]);
    }

    #[Route('/leaderboard', name: 'app_leaderboard')]
    public function leaderboard(UserRepository $userRepo, Request $request, ProfileRepository $profileRepository): Response
    {
        /** @var \App\Entity\User|null $user */
        $user = $this->getUser();
        
        $currentUserProfile = null;
        if ($user) {
            $currentUserProfile = $profileRepository->findByUser($user);
        }
        
        $currentRouteName = $request->attributes->get('_route');
        $currentPath = $request->getPathInfo();
        
        $allUsersForLeaderboard = $userRepo->findAll();
        $leaderboardData = [];
        foreach ($allUsersForLeaderboard as $leaderboardUser) {
            $profileOfLeaderboardUser = $leaderboardUser->getProfile();
            if ($profileOfLeaderboardUser) {
                $leaderboardData[] = [
                    'picture' => $profileOfLeaderboardUser->getPicture(),
                    'firstname' => $leaderboardUser->getFirstname(),
                    'lastname' => $leaderboardUser->getLastname(),
                    'xp' => $profileOfLeaderboardUser->getXp(),
                ];
            }
        }
        
        // Sort leaderboard by XP in descending order
        usort($leaderboardData, static function ($a, $b) {
            return ($b['xp'] ?? 0) <=> ($a['xp'] ?? 0);
        });

        return $this->render('learn/index.html.twig', [
            'user' => $user,
            'profile' => $currentUserProfile,
            'currentRouteName' => $currentRouteName,
            'currentPath' => $currentPath,
            'leaderboard' => $leaderboardData,
        ]);
    }
    
    
    #[Route('/sounds', name: 'app_sounds')]
    public function sounds(SoundsRepository $soundsRepo, Request $request, UserSoundProgressRepository $userSoundProgressRepo): Response
    {
        /** @var \App\Entity\User|null $user */
        $user = $this->getUser();

        $currentRouteName = $request->attributes->get('_route');
        $currentPath = $request->getPathInfo();

         // Sound logic

        $letters = $soundsRepo->findAll();
        $vowels = array_slice($letters, 0, 10);
        $consonants = array_slice($letters, 10, 26);

        $vowelsData = [];
        foreach ($vowels as $sound) {
            $progress = 0;
            if ($user) {
                $usp = $userSoundProgressRepo->findOneBy(['user' => $user, 'sound' => $sound]);
                if ($usp) {
                    $progress = $usp->getProgress();
                }
            }
            $vowelsData[] = [
                'id' => $sound->getId(),
                'letter' => $sound->getLetter(),
                'example' => $sound->getExample(),
                'audio' => $sound->getAudio(),
                'progress' => $progress,
            ];
        }

        $consonantsData = [];
        foreach ($consonants as $sound) {
            $progress = 0;
            if ($user) {
                $usp = $userSoundProgressRepo->findOneBy(['user' => $user, 'sound' => $sound]);
                if ($usp) {
                    $progress = $usp->getProgress();
                }
            }
            $consonantsData[] = [
                'id' => $sound->getId(),
                'letter' => $sound->getLetter(),
                'example' => $sound->getExample(),
                'audio' => $sound->getAudio(),
                'progress' => $progress,
            ];
        }

        return $this->render('learn/index.html.twig', [
            'user' => $user,
            'sounds' => $soundsRepo->findAll(),
            'currentRouteName' => $currentRouteName,
            'currentPath' => $currentPath,
            'vowels' => $vowelsData,
            'consonants' => $consonantsData,
        ]);
    }

    #[Route('/api/leaderboard', name: 'api_get_leaderboard', methods: ['GET'])]
    public function getApiLeaderboard(UserRepository $userRepository): JsonResponse
    {
        
        $limit = 30;
        $leaderboardUsers = $userRepository->findUsersForLeaderboard($limit);

        $data = [];
        foreach ($leaderboardUsers as $user) {
            $profile = $user->getProfile(); 
            if ($profile) {
                $data[] = [
                    'firstname' => $user->getFirstname(),
                    'lastname' => $user->getLastname(),
                    'picture' => $profile->getPicture(), 
                    'xp' => $profile->getXp(),           
                ];
            }
        }
        return $this->json($data);
    }
}