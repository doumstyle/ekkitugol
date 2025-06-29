/**
 * Gère la leçon audio de l'application.
 * Charge les leçons, joue l'audio des mots, gère les réponses de l'utilisateur,
 * met à jour la progression, et redirige une fois la leçon terminée.
 * Attend à ce que les données et la configuration de la leçon soit pourvues via l'attribut "data-lessons"
 * de l'élément HTML avec l'id "lessonInterface"
 */
document.addEventListener('DOMContentLoaded', function () {
  // Get the lesson interface element which holds the data
  const lessonInterfaceElement = document.getElementById('lessonInterface');
  if (!lessonInterfaceElement) {
    console.error('Lesson interface element with ID "lessonInterface" not found. Ensure your main lesson container has this ID and the data attributes.');
    // Optionally, display an error to the user in the UI
    const lessonTitle = document.querySelector('h2.fw-bold');
    if (lessonTitle) lessonTitle.textContent = "Erreur: Interface de leçon non trouvée.";
    return;
  }

  const lessonsDataAttribute = lessonInterfaceElement.dataset.lessons;
  const returnPathAttribute = lessonInterfaceElement.dataset.returnPath;
  const completeSetUrlAttribute = lessonInterfaceElement.dataset.completeSetUrl;

  if (!lessonsDataAttribute || !returnPathAttribute || !completeSetUrlAttribute) {
    console.error('Missing data-lessons, data-return-path, or data-complete-set-url attribute on #lessonInterface.');
    const lessonTitle = document.querySelector('h2.fw-bold');
    if (lessonTitle) lessonTitle.textContent = "Erreur de configuration des leçons.";
    // Hide UI elements as they won't function correctly
    const progressContainerToHide = document.getElementById('progressContainer');
    if (progressContainerToHide) progressContainerToHide.style.display = 'none';

    const playBtnToHide = document.getElementById('playBtn');
    if (playBtnToHide) playBtnToHide.style.display = 'none';

    const answerToHide = document.getElementById('answer');
    if (answerToHide) answerToHide.style.display = 'none';

    const skipOrCheckContainerToHide = document.getElementById('skipOrCheckContainer');
    if (skipOrCheckContainerToHide) skipOrCheckContainerToHide.style.display = 'none';

    const lessonAudioToHide = document.getElementById('lessonAudio');
    if (lessonAudioToHide) lessonAudioToHide.style.display = 'none';

    return;
  }

  /**
   * @type {Array<Object>} lessons - Tableau des objets leçon parsés depuis JSON.
   * Chaque objet leçon doit avoir des propriétés comme 'name', 'audioSrc', 'options', 'correctAnswer'.
   */
  let lessons = [];
  try {
    lessons = JSON.parse(lessonsDataAttribute);
    if (!Array.isArray(lessons)) {
      throw new Error("Lessons data is not an array.");
    }
    // Filter out any null, non-object lessons, or lessons missing essential properties
    lessons = lessons.filter((lesson, index) => {
      const isValid = lesson && typeof lesson === 'object' &&
        lesson.hasOwnProperty('name') && typeof lesson.name === 'string' &&
        lesson.hasOwnProperty('audioSrc') && typeof lesson.audioSrc === 'string' &&
        lesson.hasOwnProperty('options') && Array.isArray(lesson.options) && lesson.options.length >= 2 &&
        lesson.options.every(opt => typeof opt === 'string') && // Ensure all options are strings
        lesson.hasOwnProperty('correctAnswer') && typeof lesson.correctAnswer === 'string' &&
        lesson.hasOwnProperty('translation') && (typeof lesson.translation === 'string' || lesson.translation === null); // Translation can be string or null
      if (!isValid) {
        console.warn(`Invalid lesson object at index ${index} filtered out (check properties including 'translation'):`, lesson);
      }
      return isValid;
    });
  } catch (e) {
    console.error('Failed to parse lessons data from data-lessons attribute:', e);
    const lessonTitle = document.querySelector('h2.fw-bold');
    if (lessonTitle) lessonTitle.textContent = "Erreur de chargement des données des leçons.";
    return;
  }
  const returnPath = returnPathAttribute;
  /**
   * @type {number} currentLessonIndex - Index de la leçon affichée.
   */
  let currentLessonIndex = 0;

  /**
   * @type {string|null} selectedAnswerValue - Le contenu textuel de la réponse selectionée
   */
  let selectedAnswerValue = null;

  // UI elements
  const progressBarElement = document.querySelector('.progress-bar');
  const progressContainerElement = document.querySelector('#progressContainer .progress');
  const firstAnswerBtn = document.querySelector('.firstAnswer');
  const secondAnswerBtn = document.querySelector('.secondAnswer');
  const playBtn = document.querySelector('#playBtn');
  const audioElement = document.querySelector('#lessonAudio');
  const skipBtn = document.querySelector('#skipBtn');
  const checkBtn = document.querySelector('#checkBtn');
  const questionTitle = document.querySelector('h2.fw-bold');
  const answerContainer = document.querySelector('#answer');
  const skipOrCheckContainer = document.querySelector('#skipOrCheckContainer');
  const translationBannerElement = document.getElementById('translationBanner');
  const translationTextElement = document.getElementById('translationText');
  const continueFromBannerBtn = document.getElementById('continueFromBannerBtn');

  // Initialize the UI if no lessons are available
  if (lessons.length === 0) {
    if (questionTitle) questionTitle.textContent = "Aucune leçon disponible.";
    if (progressContainerElement)
      progressContainerElement.style.display = 'none';
    if (playBtn)
      playBtn.style.display = 'none';
    if (answerContainer)
      answerContainer.style.display = 'none';
    if (skipOrCheckContainer)
      skipOrCheckContainer.style.display = 'none';
    if (audioElement)
      audioElement.style.display = 'none';
    return;
  }

  /**
   * Réinitialisation des styles des boutons de réponses et du bouton de vérification
   */
  function resetAnswerButtonStyles() {
    firstAnswerBtn.classList.remove('btn-success', 'btn-danger', 'btn-primary', 'text-white', 'active', 'disabled');
    firstAnswerBtn.classList.add('btn-outline-primary');
    secondAnswerBtn.classList.remove('btn-success', 'btn-danger', 'btn-primary', 'text-white', 'active', 'disabled');
    secondAnswerBtn.classList.add('btn-outline-primary');

    // Ensure translation banner is hidden and skip/check container is visible by default during reset
    if (translationBannerElement) translationBannerElement.classList.add('d-none');
    if (skipOrCheckContainer) skipOrCheckContainer.classList.remove('d-none');

    checkBtn.classList.remove('btn-success', 'btn-danger', 'btn-secondary', 'btn-info');
    checkBtn.classList.add('btn-outline-success', 'disabled');
    checkBtn.setAttribute('aria-disabled', 'true');
  }

  /**
   * Chargement de la leçon à l'index spécifié
   * @param {number} index - Index de la leçon à charger
   */
  function loadLesson(index) {
    // Ensure correct UI visibility state at the start of loading any lesson
    // Corrected: The LessonUtils.updateProgressBar also handles aria attributes on the bar itself.
    window.LessonUtils.updateProgressBar(progressBarElement, currentLessonIndex, lessons.length);
    if (translationBannerElement) translationBannerElement.classList.add('d-none');
    if (skipOrCheckContainer) skipOrCheckContainer.classList.remove('d-none');

    if (index >= lessons.length) {
      questionTitle.textContent = "Leçon terminée ! Bravo !";
      if (playBtn)
        playBtn.style.display = 'none';
      if (audioElement)
        audioElement.style.display = 'none';
      // Hide answer options container as lesson is finished
      if (answerContainer) {
        answerContainer.style.display = 'none';
      }
      // Ensure skipOrCheckContainer is visible for the final "Terminer" button
      if (skipOrCheckContainer) skipOrCheckContainer.classList.remove('d-none');
      if (translationBannerElement) translationBannerElement.classList.add('d-none');

      if (skipBtn) skipBtn.style.display = 'none';
      if (checkBtn) {
        checkBtn.textContent = "Terminer et voir les sons";
        checkBtn.classList.remove('btn-outline-success', 'disabled', 'btn-success', 'btn-danger', 'btn-secondary');
        checkBtn.classList.add('btn-primary');
        checkBtn.setAttribute('aria-disabled', 'false');
        checkBtn.classList.remove('disabled');
        checkBtn.href = "#";
      }

      currentLessonIndex = lessons.length;
      // window.LessonUtils.updateProgressBar(progressBarElement, currentLessonIndex, lessons.length); // Already called at the start of loadLesson
      return;
    }

    // For an active lesson, ensure answer container is visible
    if (answerContainer) {
      answerContainer.style.display = 'flex';
    }

    const lesson = lessons[index];
    audioElement.src = lesson.audioSrc;
    audioElement.load();
    audioElement.play().catch(error => console.warn("Audio autoplay on lesson load was prevented: ", error));

    firstAnswerBtn.textContent = lesson.options[0];
    secondAnswerBtn.textContent = lesson.options[1];

    selectedAnswerValue = null;
    resetAnswerButtonStyles();
    // window.LessonUtils.updateProgressBar(progressBarElement, currentLessonIndex, lessons.length); // Already called at the start of loadLesson

    // Enable buttons
    firstAnswerBtn.classList.remove('disabled');
    secondAnswerBtn.classList.remove('disabled');

    if (skipBtn) {
      skipBtn.classList.remove('disabled');
      skipBtn.style.display = 'inline-block';
    }

    if (checkBtn) {
      checkBtn.textContent = "Vérifier";
      checkBtn.href = "#";
    }
  }

  /**
   * Evenement sur le bouton de lecture pour écouter l'audio du mot
   */
  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.preventDefault();
      audioElement.play().catch(error => console.error("Error playing audio on button click:", error));
    });
  }

  /**
   * 
   * @param {Event} event - l'évènement 'click'
   * @param {string} answerValue - le contenu textuel du bouton réponse cliqué
   * @param {HTMLElement} clickedButton - le bouton réponse qui a été cliqué
   * @param {HTMLElement} otherButton - l'autre bouton réponse
   * @returns 
   */
  function handleAnswerClick(event, answerValue, clickedButton, otherButton) {
    event.preventDefault();
    if (clickedButton.classList.contains('disabled'))
      return;

    selectedAnswerValue = answerValue;

    // Style for selected answer: make it distinct (e.g., solid primary)
    clickedButton.classList.remove('btn-outline-primary', 'btn-success', 'btn-danger');
    clickedButton.classList.add('btn-primary', 'text-white');

    // Reset other button to default outline style
    otherButton.classList.remove('btn-primary', 'text-white', 'btn-success', 'btn-danger');
    otherButton.classList.add('btn-outline-primary');

    // Enable and style checkBtn to 'ready to check' (solid success)
    if (checkBtn) {
      checkBtn.classList.remove('disabled', 'btn-secondary', 'btn-danger', 'btn-outline-success');
      checkBtn.classList.add('btn-success');
      checkBtn.setAttribute('aria-disabled', 'false');
    }
  }

  if (firstAnswerBtn)
    firstAnswerBtn.addEventListener('click', (e) => handleAnswerClick(e, firstAnswerBtn.textContent, firstAnswerBtn, secondAnswerBtn));



  if (secondAnswerBtn)
    secondAnswerBtn.addEventListener('click', (e) => handleAnswerClick(e, secondAnswerBtn.textContent, secondAnswerBtn, firstAnswerBtn));


  /**
   * Evènement sur le bouton 'vérifier'.
   * Si toutes les leçons sont terminées, ce bouton va déclencher la fonction 'handleLessonCompletion'.
   * Sinon, il vérifie la réponse selectionnée de la leçon en cours.
   */
  if (checkBtn) {
    checkBtn.addEventListener('click', (e) => {
      if (currentLessonIndex >= lessons.length && checkBtn.getAttribute('href') === "#") {
        e.preventDefault();
        handleLessonCompletion();
        return;
      }
      e.preventDefault();
      if (checkBtn.classList.contains('disabled') || !selectedAnswerValue) {
        return;
      }

      const currentLesson = lessons[currentLessonIndex];
      const selectedButton = (selectedAnswerValue === firstAnswerBtn.textContent) ? firstAnswerBtn : secondAnswerBtn;

      // Temporarily disable buttons during check animation/transition
      firstAnswerBtn.classList.add('disabled');
      secondAnswerBtn.classList.add('disabled');
      if (skipBtn)
        skipBtn.classList.add('disabled');
      checkBtn.classList.add('disabled');

      if (selectedAnswerValue === currentLesson.correctAnswer) {
        selectedButton.classList.remove('btn-primary');
        selectedButton.classList.add('btn-success');

        // Check if translation exists for the current lesson
        if (translationTextElement && translationBannerElement && continueFromBannerBtn &&
          currentLesson.translation && typeof currentLesson.translation === 'string' && currentLesson.translation.trim() !== '') {

          translationTextElement.textContent = `Traduction : ${currentLesson.translation}`;
          if (skipOrCheckContainer) skipOrCheckContainer.classList.add('d-none'); // Hide skip/check
          translationBannerElement.classList.remove('d-none'); // Show translation banner

          // Progression to next lesson will be handled by continueFromBannerBtn
        } else {
          // No translation, or banner elements not found, proceed to next lesson after a short delay
          if (translationBannerElement) translationBannerElement.classList.add('d-none'); // Ensure banner is hidden
          if (skipOrCheckContainer) skipOrCheckContainer.classList.remove('d-none'); // Ensure skip/check is visible

          setTimeout(() => {
            currentLessonIndex++;
            loadLesson(currentLessonIndex);
          }, 1000); // Load next lesson after 1 second
        }
      } else {
        // Incorrect answer
        if (translationBannerElement) translationBannerElement.classList.add('d-none'); // Ensure banner hidden
        if (skipOrCheckContainer) skipOrCheckContainer.classList.remove('d-none'); // Ensure skip/check visible
        selectedButton.classList.remove('btn-primary');
        selectedButton.classList.add('btn-danger');
        checkBtn.classList.remove('btn-success');
        checkBtn.classList.add('btn-danger');

        setTimeout(() => {
          selectedButton.classList.remove('btn-danger');
          // Revert to 'selected' state
          selectedButton.classList.add('btn-primary');
          checkBtn.classList.remove('btn-danger');
          checkBtn.classList.add('btn-success');

          firstAnswerBtn.classList.remove('disabled');
          secondAnswerBtn.classList.remove('disabled');
          if (skipBtn)
            skipBtn.classList.remove('disabled');



          checkBtn.classList.remove('disabled');
        }, 1500);
      }
    });
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (skipBtn.classList.contains('disabled'))
        return;

      currentLessonIndex++;
      loadLesson(currentLessonIndex);
    });
  }

  /**
   * Event listener for the "Continue" button within the translation banner.
   */
  if (continueFromBannerBtn) {
    continueFromBannerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (translationBannerElement) translationBannerElement.classList.add('d-none'); // Hide banner
      if (skipOrCheckContainer) skipOrCheckContainer.classList.remove('d-none'); // Show skip/check container again

      // Proceed to the next lesson
      currentLessonIndex++;
      loadLesson(currentLessonIndex);
    });
  }

  if (audioElement) {
    audioElement.removeAttribute('autoplay');
  }

  if (firstAnswerBtn) {
    firstAnswerBtn.classList.add('btn', 'btn-outline-primary');
  }

  if (secondAnswerBtn) {
    secondAnswerBtn.classList.add('btn', 'btn-outline-primary');
  }

  if (checkBtn) {
    checkBtn.classList.add('disabled');
    checkBtn.setAttribute('aria-disabled', 'true');
  }

  // Load the first lesson
  loadLesson(currentLessonIndex);

  /**
   * Gère la complétion de toutes les leçons.
   * Envoi le noms des sons au backend pour mettre à jour la progression et l'XP.
   * Redirige l'utilisateur ensuite.
   * Cette fonction est déclenchée au clic du bouton 'Terminer et voir les sons'
   */
  async function handleLessonCompletion() {
    if (!completeSetUrlAttribute) {
      console.error('Complete set URL (data-complete-set-url) is not defined. Cannot save progress.');
      alert('Erreur de configuration: Impossible de sauvegarder la progression. Redirection...');
      window.location.href = returnPath; // Fallback redirect
      return;
    }

    // On récupère ensuite les noms des sons étudiés durant la leçon
    const completedSoundNames = lessons.map(lesson => lesson.name).filter(name => name);

    // Validate the URL structure before attempting to fetch
    let validUrlToFetch;
    try {
      // If completeSetUrlAttribute is a full URL, it's used as is.
      // If it's a relative path, it's resolved against the current page's URL.
      validUrlToFetch = new URL(completeSetUrlAttribute, window.location.href).href;
    } catch (e) {
      console.error(`Invalid URL format provided in data-complete-set-url: "${completeSetUrlAttribute}". Resolved against base "${window.location.href}". Error: ${e.message}`);
      alert(`Erreur de configuration: L'URL de sauvegarde des progrès ("${completeSetUrlAttribute}") n'est pas valide. La progression ne peut pas être sauvegardée. Vous allez être redirigé.`);
      window.location.href = returnPath; // Fallback redirect
      return;
    }

    if (checkBtn) {
        checkBtn.textContent = "Sauvegarde...";
    }

    try {
      // Use the utility function to send the completion request
      const response = await window.LessonUtils.sendCompletionRequest(validUrlToFetch, { sounds: completedSoundNames });

      if (!response.ok) {
        // Server returned an error status (4xx or 5xx)
        let serverErrorMessage = `Le serveur a répondu avec le statut ${response.status}.`; // Semicolon added
        try {
          // Try to get more details from the response body
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            serverErrorMessage = (errorData && errorData.message) ? errorData.message : (JSON.stringify(errorData) || serverErrorMessage);
          } else {
            const errorText = await response.text();
            // Avoid showing a huge HTML page in the alert, show a snippet
            serverErrorMessage = errorText.length > 300 ? errorText.substring(0, 300) + "..." : errorText;
            console.warn("Server error response was not JSON. Body:", errorText);
          }
        } catch (e) {
          // Failed to parse the error response body, or another error occurred
          console.warn("Could not parse server error response body, or another error occurred while processing error response:", e);
          // serverErrorMessage remains as the status code message or any previously parsed message
        }
        console.error('Failed to update lesson progress on server. Server message:', serverErrorMessage); // Semicolon added
        alert('Impossible de sauvegarder la progression de la leçon: ' + serverErrorMessage + '. Vous allez être redirigé.'); // Semicolon added
      }
      window.location.href = returnPath; // Semicolon added

    } catch (error) {
      console.error(`Error sending lesson completion data to URL "${validUrlToFetch}":`, error); // Semicolon added
      alert('Une erreur réseau est survenue lors de la sauvegarde de la progression de la leçon. Vous allez être redirigé.'); // Semicolon added
      window.location.href = returnPath; // Semicolon added
    }
  }
});
