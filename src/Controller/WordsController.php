<?php

namespace App\Controller;

use App\Entity\Words;
use App\Form\WordsForm;
use App\Repository\WordsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\UserWordProgressRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User; // Assuming your User entity is here
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/words')]
final class WordsController extends AbstractController
{
    #[Route(name: 'app_words_index', methods: ['GET'])]
    public function index(WordsRepository $wordsRepository, Request $request, UserWordProgressRepository $userWordProgressRepo): Response
    {
        /** @var User|null $user */ // User can be null if not logged in
        $user = $this->getUser();

        $currentRouteName = $request->attributes->get('_route');
        $currentPath = $request->getPathInfo();

        $allWords = $wordsRepository->findAll();
        $wordProgressData = [];

        foreach ($allWords as $word) {
            $progress = 0; // Default progress
            if ($user) {
                $usp = $userWordProgressRepo->findOneBy(['user' => $user, 'word' => $word]);
                if ($usp) {
                    $progress = $usp->getProgress();
                }
            }

            $wordProgressData[] = [
                'id' => $word->getId(),                
                'peul' => $word->getPeul(),
                'french' => $word->getFrench(),
                'audio' => $word->getAudio(),
                'progress' => $progress,
            ];
        }

        return $this->render('learn/index.html.twig', [
            'words' => $wordProgressData,
            'user' => $user,
            'currentRouteName' => $currentRouteName,
            'currentPath' => $currentPath,
        ]);
    }

    #[Route('/new', name: 'app_words_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $word = new Words();
        $form = $this->createForm(WordsForm::class, $word);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($word);
            $entityManager->flush();

            return $this->redirectToRoute('app_words_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('words/new.html.twig', [
            'word' => $word,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_words_show', methods: ['GET'])]
    public function show(Words $word): Response
    {
        return $this->render('words/show.html.twig', [
            'word' => $word,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_words_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Words $word, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(WordsForm::class, $word);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_words_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('words/edit.html.twig', [
            'word' => $word,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_words_delete', methods: ['POST'])]
    public function delete(Request $request, Words $word, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$word->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($word);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_words_index', [], Response::HTTP_SEE_OTHER);
    }
}
