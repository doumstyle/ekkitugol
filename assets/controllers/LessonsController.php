<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\UserWordProgress;
use App\Entity\UserSoundProgress;
use App\Repository\WordsRepository;
use App\Repository\SoundsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\UserWordProgressRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Repository\UserSoundProgressRepository;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class LessonsController extends AbstractController
{
    #[Route('/lessons', name: 'app_lessons')]
    public function index(SoundsRepository $soundsRepo): Response
    {
        /** @var User $user */
        $user = $this->getUser();

        $allSoundEntities = $soundsRepo->findAll();
        $lessonsData = [];
        $allSoundWordRepresentations = [];

        if (!empty($allSoundEntities)) {
            foreach ($allSoundEntities as $soundEntity) {
                $wordRepresentation = $soundEntity->getExample();
                if (!in_array($wordRepresentation, $allSoundWordRepresentations)) {
                    $allSoundWordRepresentations[] = $wordRepresentation;
                }
            }

            // Shuffle all sound entities to pick a random subset for the lesson
            $lessonSoundEntities = $allSoundEntities;
            shuffle($lessonSoundEntities);

            $maxLessonItems = 10;
            $currentLessonItemCount = 0;

            foreach ($lessonSoundEntities as $soundEntity) {
                if ($currentLessonItemCount >= $maxLessonItems) {
                    break; // Limit to 10 items per lesson
                }

                $correctAnswer = $soundEntity->getExample();
                $audioFilename = $soundEntity->getAudio();
                $translation = $soundEntity->getTranslation();


                $options = [$correctAnswer];

                // Prepare potential distractors (all other unique words)
                $potentialDistractors = array_filter($allSoundWordRepresentations, static function ($name) use ($correctAnswer) {
                    return $name !== $correctAnswer;
                });
                $potentialDistractors = array_values($potentialDistractors); // Reset array keys

                if (!empty($potentialDistractors)) {
                    $distractor = $potentialDistractors[array_rand($potentialDistractors)];
                    $options[] = $distractor;
                } else {
                    // Fallback if only one unique sound/word exists or no other unique names.
                    $options[] = $correctAnswer . "_alt"; // Or a generic distractor like "autre_mot"
                }
                shuffle($options);

                $lessonsData[] = [
                    'name' => $correctAnswer,
                    'audio_filename' => $audioFilename,
                    'options' => $options,
                    'correctAnswer' => $correctAnswer,
                    'translation' => $translation
                ];
                $currentLessonItemCount++;
            }
        }

        return $this->render('lessons/index.html.twig', [
            'user' => $user,
            'lessons_from_controller' => $lessonsData,
        ]);
    }

    #[Route('lessons/complete-set', name: 'app_lessons_complete_set', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function completeSet(Request $request, SoundsRepository $soundsRepo, EntityManagerInterface $entityManager, UserSoundProgressRepository $userSoundProgressRepo): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Vous devez être connecté pour accéder à cette page.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        $completedSoundNames = $data['sounds'] ?? [];

        if (empty($completedSoundNames)) {
            return $this->json(['message' => 'No sounds provided.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $profile = $user->getProfile();
        if($profile) {
            $profile->setXp($profile->getXp() + 10);
        }

        foreach ($completedSoundNames as $soundName) {
            $soundEntity = $soundsRepo->findOneBy(['example' => $soundName]);
            if ($soundEntity) {
                $progressRecord = $userSoundProgressRepo->findOneBy(['user' => $user, 'sound' => $soundEntity]);
                if (!$progressRecord) {
                    $progressRecord = new UserSoundProgress();
                    $progressRecord->setUser($user);
                    $progressRecord->setSound($soundEntity);
                    $progressRecord->setProgress(10); // Start progress at 10 for the first completion
                    $entityManager->persist($progressRecord);
                } else {
                    // Increment existing progress
                    $currentProgress = $progressRecord->getProgress();
                    $progressRecord->setProgress($currentProgress + 10); // Increment by 10
                }
            }
        }

        try {
            $entityManager->flush();
            return $this->json(['message' => 'Progress updated successfully.']);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Error updating progress'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('lessons/sentences', name: 'app_lessons_sentences')]
    public function phrases(Request $request, WordsRepository $wordsRepo): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        
        $currentRouteName = $request->attributes->get('_route');
        $currentPath = $request->getPathInfo();

        $allWordEntities = $wordsRepo->findAll();

        $sourceWordsForLesson = array_slice($allWordEntities, 33, 100);

        if (empty($sourceWordsForLesson)) {
            return $this->render('lessons/sentences.html.twig', [
                'user' => $user,
                'sentence_lessons' => [],
                'currentRouteName' => $currentRouteName,
                'currentPath' => $currentPath,
                'error_message' => 'Aucune phrase disponible pour cette leçon.'
            ]);
        }

        shuffle($sourceWordsForLesson);

        $maxLessonItems = 10; // Max items per lesson session
        $currentLessonItems = array_slice($sourceWordsForLesson, 0, $maxLessonItems);

        $sentenceLessonsData = [];
        
        // Get all French translations from ALL words to use as potential distractors
        $allFrenchTranslations = array_map(fn($word) => $word->getFrench(), $allWordEntities);
        $allFrenchTranslations = array_values(array_unique(array_filter($allFrenchTranslations))); // Ensure unique, non-empty, and re-indexed

        foreach ($currentLessonItems as $wordEntity) {
            $peulSentence = $wordEntity->getPeul();
            $correctFrenchTranslation = $wordEntity->getFrench();

            if (empty($peulSentence) || empty($correctFrenchTranslation)) {
                continue; // Skip if essential data is missing for a lesson item
            }

            $options = [$correctFrenchTranslation];
            
            $potentialDistractors = array_filter($allFrenchTranslations, static function ($translation) use ($correctFrenchTranslation) {
                return $translation !== $correctFrenchTranslation;
            });
            $potentialDistractors = array_values($potentialDistractors); // Re-index

            $numDistractorsToAdd = 2; // Aim for 3 options total (1 correct + 2 distractors)

            for ($i = 0; $i < $numDistractorsToAdd; $i++) {
                if (!empty($potentialDistractors)) {
                    $distractorKey = array_rand($potentialDistractors);
                    $options[] = $potentialDistractors[$distractorKey];
                    unset($potentialDistractors[$distractorKey]); // Remove used distractor to avoid repetition in the same question
                    $potentialDistractors = array_values($potentialDistractors); // Re-index
                } else {
                    // Fallback if not enough unique distractors
                    $options[] = $correctFrenchTranslation . "_alternative" . ($i + 1); // Generic distractor
                }
            }
            shuffle($options);

            $sentenceLessonsData[] = [
                'peul' => $peulSentence,
                'french' => $correctFrenchTranslation, // Correct answer for checking
                'options' => $options,
                'id_for_progress' => $peulSentence // This is what `phrasesCompleteSet` expects
            ];
        }

        return $this->render('lessons/sentences.html.twig', [
            'user' => $user,
            'sentence_lessons' => $sentenceLessonsData,
            'currentRouteName' => $currentRouteName,
            'currentPath' => $currentPath,
        ]);
    }

    #[Route('lessons/sentences/complete-set', name: 'app_sentences_complete_set', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function phrasesCompleteSet(Request $request, WordsRepository $wordsRepo, EntityManagerInterface $entityManager, UserWordProgressRepository $userWordProgressRepo): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Vous devez être connecté pour accéder à cette page.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        $completedWordNames = $data['words'] ?? [];

        if (empty($completedWordNames)) {
            return $this->json(['message' => 'No words provided.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $profile = $user->getProfile();
        if($profile) {
            $profile->setXp($profile->getXp() + 25);
        }

        foreach ($completedWordNames as $wordName) {
            $wordEntity = $wordsRepo->findOneBy(['peul' => $wordName]);
            if ($wordEntity) {
                $progressRecord = $userWordProgressRepo->findOneBy(['user' => $user, 'word' => $wordEntity]);
                if (!$progressRecord) {
                    $progressRecord = new UserWordProgress();
                    $progressRecord->setUser($user);
                    $progressRecord->setWord($wordEntity);
                    $progressRecord->setProgress(25);

                    $entityManager->persist($progressRecord);
                } else {
                    // Increment existing progress
                    $currentProgress = $progressRecord->getProgress();
                    $progressRecord->setProgress($currentProgress + 25);
                }
            }
        }

        try {
            $entityManager->flush();
            return $this->json(['message' => 'Progress updated successfully.']);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Error updating progress'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
      }
    }
