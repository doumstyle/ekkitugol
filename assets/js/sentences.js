document.addEventListener('DOMContentLoaded', function () {
    /**
     * @type {HTMLElement|null} Main container for the sentence lesson interface.
     */
    const lessonInterface = document.getElementById('sentenceLessonInterface');

    if (!lessonInterface) {
        console.error('Sentence lesson interface element (#sentenceLessonInterface) not found.');
        // Attempt to display an error message if a fallback container exists or create one
        let errorDisplay = document.getElementById('lesson-container');
        if (!errorDisplay && document.body) {
            errorDisplay = document.createElement('div');
            errorDisplay.className = 'container mt-5 text-center alert alert-danger';
            document.body.prepend(errorDisplay);
        }
        if (errorDisplay) {
            errorDisplay.innerHTML = 'Erreur critique : Impossible de charger l\'interface de la leçon.';
        }
        return;
    }

    // --- DOM Element References ---
    /** @type {HTMLElement|null} The fill element of the progress bar. */
    const progressBarFill = document.getElementById('progressBarFill');
    /** @type {HTMLElement|null} The element displaying the Peul sentence. */
    const peulSentenceDisplay = document.getElementById('peulSentenceDisplay');
    /** @type {HTMLElement|null} The container for multiple-choice option buttons. */
    const optionsContainer = document.getElementById('optionsContainer');
    /** @type {HTMLElement|null} The banner for displaying feedback. */
    const feedbackBanner = document.getElementById('feedbackBanner');
    /** @type {HTMLElement|null} The text part of the feedback banner. */
    const feedbackText = document.getElementById('feedbackText');
    /** @type {HTMLElement|null} Displays the correct answer in the feedback banner. */
    const correctAnswerDisplay = document.getElementById('correctAnswerDisplay');
    /** @type {HTMLButtonElement|null} The button to continue to the next question. */
    const continueBtn = document.getElementById('continueBtn');
    /** @type {HTMLButtonElement|null} The button to check the selected answer. */
    const checkBtn = document.getElementById('checkBtn');
    /** @type {HTMLButtonElement|null} The button to skip the current question. */
    const skipBtn = document.getElementById('skipBtn');
    /** @type {HTMLElement|null} The main question area. */
    const questionArea = document.getElementById('questionArea');
    /** @type {HTMLElement|null} The view shown upon lesson completion. */
    const lessonCompleteView = document.getElementById('lessonCompleteView');
    /** @type {HTMLElement|null} Displays the final score. */
    const finalScoreText = document.getElementById('finalScoreText');
    /** @type {HTMLElement|null} Container for main action buttons (skip/check). */
    const actionButtonsContainer = document.getElementById('actionButtonsContainer');

    // --- Data from HTML ---
    /** @type {string} Error message from the server, if any. */
    const errorMessage = lessonInterface.dataset.errorMessage;
    /** @type {string|undefined} URL to submit lesson completion data. */
    const completeUrl = lessonInterface.dataset.completeSetUrl;
    /** @type {string|undefined} URL for the home page. */
    const homePath = lessonInterface.dataset.homePath;
    // const returnPath = lessonInterface.dataset.returnPath; // For restart, handled by static link for now

    /**
     * @type {Array<Object>} Raw lesson data parsed from JSON.
     */
    let sentenceLessonsRaw = [];
    try {
        sentenceLessonsRaw = JSON.parse(lessonInterface.dataset.lessons || '[]');
    /**
     * @throws {Error} If JSON parsing fails.
     */
    } catch (e) {
        console.error('Error parsing sentence lessons data:', e);
        if (questionArea) questionArea.innerHTML = '<p class="text-center alert alert-danger">Erreur: Format de données de leçon invalide.</p>';
        if (actionButtonsContainer) actionButtonsContainer.style.display = 'none';
        return;
    }

    /**
     * Helper function to escape HTML special characters for security.
     * @param {string} unsafe The string to escape.
     * @returns {string} The escaped string.
     */
    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return '';
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    if (errorMessage) {
        if (questionArea) questionArea.innerHTML = `<p class="text-center alert alert-warning">${escapeHtml(errorMessage)}</p>`;
        if (actionButtonsContainer) actionButtonsContainer.style.display = 'none';
        return;
    }

    if (!sentenceLessonsRaw || sentenceLessonsRaw.length === 0) {
        if (questionArea) questionArea.innerHTML = `<p class="text-center alert alert-info">Aucune phrase disponible pour la leçon pour le moment. <a href="${homePath || '#'}">Retour à l'accueil</a></p>`;
        if (actionButtonsContainer) actionButtonsContainer.style.display = 'none';
        return;
    }

    /**
     * @type {Array<Object>} Filtered lesson data, ensuring each lesson has enough distinct options.
     * Each object contains 'peul', 'french', 'options', 'id_for_progress'.
     */
    const sentenceLessons = sentenceLessonsRaw.filter(lesson => lesson.options && new Set(lesson.options).size >= 2);

    if (sentenceLessons.length === 0) {
        if (questionArea) questionArea.innerHTML = `<p class="text-center alert alert-warning">Les phrases disponibles ne peuvent pas former une leçon valide (pas assez d'options uniques). <a href="${homePath || '#'}">Retour à l'accueil</a></p>`;
        if (actionButtonsContainer) actionButtonsContainer.style.display = 'none';
        return;
    }

    // --- State Variables ---
    /** @type {number} Index of the current question being displayed. */
    let currentQuestionIndex = 0;
    /** @type {number} The user's current score. */
    let score = 0;
    /** @type {Array<string>} Array of item IDs (Peul sentences) for progress tracking. */
    let lessonItemsForProgress = [];
    /** @type {HTMLButtonElement|null} The currently selected option button. */
    let selectedOptionElement = null;
    /** @type {number} Total number of questions in the lesson. */
    const totalQuestions = sentenceLessons.length;

    // --- Essential Element Check ---
    const essentialElements = [progressBarFill, peulSentenceDisplay, optionsContainer, feedbackBanner, feedbackText, correctAnswerDisplay, continueBtn, checkBtn, skipBtn, questionArea, lessonCompleteView, finalScoreText, actionButtonsContainer];
    if (essentialElements.some(el => !el)) {
        console.error('One or more essential HTML elements for the quiz are missing.');
        if (questionArea) questionArea.innerHTML = '<p class="text-center alert alert-danger">Erreur: La structure de la page de leçon est incomplète.</p>';
        if (actionButtonsContainer) actionButtonsContainer.style.display = 'none';
        return;
    }

    // --- Functions ---

    /**
     * Updates the progress bar fill based on the current question.
     */
    function updateProgressBar() {
        const percentage = totalQuestions > 0 ? ((currentQuestionIndex) / totalQuestions) * 100 : 0;
        progressBarFill.style.width = `${percentage}%`;
        progressBarFill.setAttribute('aria-valuenow', percentage.toFixed(0));
    }

    /**
     * Handles the click event on the "Continue" button in the feedback banner.
     * Loads the next question or finishes the lesson.
     */
    function handleContinue() {
        currentQuestionIndex++;
        if (currentQuestionIndex < sentenceLessons.length) {
            loadQuestion();
        } else {
            finishLesson();
        }
    }

    /**
     * Loads and displays the current question and its options.
     * Updates the progress bar.
     */
    function loadQuestion() {
        if (currentQuestionIndex >= totalQuestions) {
            // If all questions are done, finalize the lesson
            finishLesson();
            return;
        }

        const currentLesson = sentenceLessons[currentQuestionIndex];
        peulSentenceDisplay.textContent = currentLesson.peul;
        
        optionsContainer.innerHTML = '';
        selectedOptionElement = null;    // Reset selected option

        // Dynamically create option buttons
        currentLesson.options.forEach(optionText => {
            const optionButton = document.createElement('button');
            optionButton.type = 'button';
            optionButton.classList.add('list-group-item', 'list-group-item-action', 'text-center', 'fs-5', 'py-2');
            optionButton.textContent = optionText;
            /**
             * Handles click on an option button.
             * Sets the clicked button as the selected option and enables the check button.
             */
            optionButton.addEventListener('click', () => {
                // Deselect previously selected option if any
                if (selectedOptionElement) {
                    selectedOptionElement.classList.remove('active');
                }
                selectedOptionElement = optionButton;
                optionButton.classList.add('active');
                checkBtn.disabled = false;
            });
            optionsContainer.appendChild(optionButton);
        });

        // Reset UI for the new question
        feedbackBanner.classList.add('d-none'); // Hide feedback banner
        actionButtonsContainer.classList.remove('d-none'); // Show action buttons
        checkBtn.disabled = true; // Disable check button until an option is selected
        skipBtn.disabled = false; // Enable skip button
        updateProgressBar();
    }

    /**
     * Handles checking the selected answer.
     * Called when the "Vérifier" button is clicked.
     */
    function handleCheckAnswer() {
        if (!selectedOptionElement) return;

        const currentLesson = sentenceLessons[currentQuestionIndex];
        const selectedAnswer = selectedOptionElement.textContent;
        const correctAnswer = currentLesson.french;

        // Disable all option buttons
        const allOptionButtons = optionsContainer.querySelectorAll('button');
        allOptionButtons.forEach(btn => btn.disabled = true);

        // Disable action buttons during feedback display
        checkBtn.disabled = true;
        skipBtn.disabled = true;

        // Prepare and show feedback banner
        feedbackBanner.classList.remove('d-none', 'bg-success-subtle', 'bg-danger-subtle', 'text-success', 'text-danger', 'bg-warning-subtle', 'text-warning-emphasis');
        actionButtonsContainer.classList.add('d-none'); // Hide check/skip buttons

        if (selectedAnswer === correctAnswer) {
            score++;
            feedbackText.textContent = 'Correct !';
            feedbackBanner.classList.add('bg-success-subtle', 'text-success');
            continueBtn.className = 'btn btn-lg btn-success';
            selectedOptionElement.classList.remove('active');
            selectedOptionElement.classList.add('list-group-item-success');
        } else {
            feedbackText.textContent = 'Incorrect.';
            feedbackBanner.classList.add('bg-danger-subtle', 'text-danger');
            continueBtn.className = 'btn btn-lg btn-danger';
            selectedOptionElement.classList.remove('active');
            selectedOptionElement.classList.add('list-group-item-danger');
            // Highlight the correct answer among the options
            allOptionButtons.forEach(btn => {
                if (btn.textContent === correctAnswer) {
                    btn.classList.add('list-group-item-success');
                }
            });
        }
        correctAnswerDisplay.innerHTML = `La bonne réponse était : <strong>${escapeHtml(correctAnswer)}</strong>`;
        lessonItemsForProgress.push(currentLesson.id_for_progress); // Add to progress list
    }

    /**
     * Handles skipping the current question.
     */
    function handleSkipQuestion() {
        const currentLesson = sentenceLessons[currentQuestionIndex];
        const correctAnswer = currentLesson.french;

        // Disable all option buttons
        const allOptionButtons = optionsContainer.querySelectorAll('button');
        allOptionButtons.forEach(btn => btn.disabled = true);

        checkBtn.disabled = true;
        skipBtn.disabled = true;
        actionButtonsContainer.classList.add('d-none'); // Hide check/skip buttons

        feedbackBanner.classList.remove('d-none', 'bg-success-subtle', 'bg-danger-subtle', 'text-success', 'text-danger');
        feedbackBanner.classList.add('bg-warning-subtle', 'text-warning-emphasis'); // Neutral feedback for skip
        actionButtonsContainer.classList.add('d-none');

        feedbackText.textContent = 'Question passée.';
        correctAnswerDisplay.innerHTML = `La bonne réponse était : <strong>${escapeHtml(correctAnswer)}</strong>`;
        continueBtn.className = 'btn btn-lg btn-warning';

        lessonItemsForProgress.push(currentLesson.id_for_progress); // Add to progress list even if skipped
    }


    /**
     * Legacy function, kept for reference or if needed by other parts, but not directly used by the new flow.
     * Provides feedback, updates the score, and enables the next question button.
     * @param {string} selectedOption The text of the option selected by the user.
     * @param {string} correctAnswer The correct French translation.
     * @param {HTMLButtonElement} clickedButton The button element that was clicked.
     */
    function checkAnswer(selectedOption, correctAnswer, clickedButton) {
        const allOptionButtons = optionsContainer.querySelectorAll('button');
        // This function's logic is now integrated into handleCheckAnswer()
        console.warn("Legacy checkAnswer function called. This should be handled by handleCheckAnswer.");
    }

    /**
     * Finalizes the lesson.
     * Displays the completion view with the score and sends progress data to the server.
     */
    async function finishLesson() {
        // Update progress bar to 100%
        progressBarFill.style.width = '100%';
        progressBarFill.setAttribute('aria-valuenow', '100');

        // Hide active lesson elements
        if (questionArea) questionArea.style.display = 'none';
        if (actionButtonsContainer) actionButtonsContainer.style.display = 'none';
        if (feedbackBanner) feedbackBanner.classList.add('d-none');
        // Show completion view
        if (lessonCompleteView) lessonCompleteView.style.display = 'block';

        if (finalScoreText) {
            finalScoreText.textContent = `Votre score : ${score} sur ${totalQuestions}.`;
        }

        // Ensure unique items for progress
        const uniqueLessonItemsForProgress = [...new Set(lessonItemsForProgress)];

        // Send progress data to the server if items were completed and URL is available
        if (uniqueLessonItemsForProgress.length > 0 && completeUrl) {
            try {
                const response = await fetch(completeUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({ words: uniqueLessonItemsForProgress })
                });
                const result = await response.json();
                if (response.ok) {
                    console.log('Progress updated:', result.message);
                } else {
                    console.error('Failed to update progress:', result.message);
                    if (finalScoreText) finalScoreText.textContent += " (Attention: la progression n'a peut-être pas été sauvegardée.)";
                }
            } catch (error) {
                console.error('Error sending completion data:', error);
                if (finalScoreText) finalScoreText.textContent += " (Attention: erreur réseau lors de la sauvegarde de la progression.)";
            }
        } else if (!completeUrl) {
            console.warn('Complete URL not provided, skipping progress update.');
            if (finalScoreText) finalScoreText.textContent += " (Attention: la sauvegarde de la progression est désactivée.)";
        }
    }

    // --- Event Listeners ---
    if (checkBtn) checkBtn.addEventListener('click', handleCheckAnswer);
    if (skipBtn) skipBtn.addEventListener('click', handleSkipQuestion);
    if (continueBtn) continueBtn.addEventListener('click', handleContinue);

    // --- Lesson Initialization ---
    // Load the first question if lessons are available
    if (sentenceLessons.length > 0) {
        loadQuestion(); // Load the first question
    } else {
        // If no valid lessons, error/empty messages are handled by initial checks
        // No further action needed here for initialization
    }
    
});
