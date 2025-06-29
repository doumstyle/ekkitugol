document.addEventListener('DOMContentLoaded', function () {
    const vowelContainers = document.querySelectorAll('.vowelContainer');
    const consonnantContainers = document.querySelectorAll('.consonnantContainer'); // Corrected variable name

    // Get all audio elements within vowelContainers and consonnantContainers
    const allVowelAudios = document.querySelectorAll('.vowelContainer audio');
    const allConsonantsAudios = document.querySelectorAll('.consonnantContainer audio');

    vowelContainers.forEach(container => {
        container.addEventListener('click', function (event) { // Changed e to event for clarity
            event.preventDefault();

            // Identify the audios in the current clicked container first
            const audioElements = this.querySelectorAll('audio');
            if (audioElements.length === 0) {
                console.warn("No audio elements found in clicked vowel container:", this);
                return;
            }
            const letterAudio = audioElements[0];
            const exampleAudio = (audioElements.length > 1) ? audioElements[1] : null;

            // Stop and reset all OTHER vowel audios
            allVowelAudios.forEach(audio => {
                // Don't pause/reset the audios we are about to play from this container
                if (audio !== letterAudio && audio !== exampleAudio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });

            // Prepare and play the letterAudio
            // letterAudio.pause(); // This call can interrupt a previous play() promise on rapid clicks.
            letterAudio.currentTime = 0;
            const playPromiseVowel = letterAudio.play();
            letterAudio.play().then(() => {
                if (exampleAudio) {
                    letterAudio.onended = null; // Clear previous handler
                    letterAudio.onended = function () {
                        exampleAudio.pause(); // Ensure example is reset before playing
                        exampleAudio.currentTime = 0;
                        exampleAudio.play().catch(error => console.error("Error playing example audio:", error, exampleAudio.src));
                        letterAudio.onended = null; // Clear the event listener after it has run
                    };
                }
            }).catch(error => {
                if (error.name === 'AbortError') {
                    // This is often expected if a new play request (e.g., from another quick click) interrupted this one.
                    console.info(`Play request for vowel sound ${letterAudio.src} was aborted, likely by a new request.`);
                } else {
                    console.error(`Error playing letter audio for vowel ${letterAudio.src}:`, error);
                }
            });
        });
    });

    // Consonants handling
    consonnantContainers.forEach(container => {
        container.addEventListener('click', function (event) { // Changed e to event for clarity
            event.preventDefault();

            // Identify the audios in the current clicked container first
            const audioElements = this.querySelectorAll('audio');
            if (audioElements.length === 0) {
                console.warn("No audio elements found in clicked consonant container:", this);
                return;
            }
            const letterAudio = audioElements[0];
            const exampleAudio = (audioElements.length > 1) ? audioElements[1] : null;

            // Stop and reset all OTHER consonant audios
            allConsonantsAudios.forEach(audio => {
                // Don't pause/reset the audios we are about to play from this container
                if (audio !== letterAudio && audio !== exampleAudio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });

            // Prepare and play the letterAudio
            // letterAudio.pause(); // This call can interrupt a previous play() promise on rapid clicks.
            letterAudio.currentTime = 0;
            const playPromiseConsonant = letterAudio.play();
            letterAudio.play().then(() => {
                if (exampleAudio) {
                    letterAudio.onended = null; // Clear previous handler
                    letterAudio.onended = function () {
                        exampleAudio.pause(); // Ensure example is reset before playing
                        exampleAudio.currentTime = 0;
                        exampleAudio.play().catch(error => console.error("Error playing example audio:", error, exampleAudio.src));
                        letterAudio.onended = null; // Clear the event listener after it has run
                    };
                }
            }).catch(error => {
                if (error.name === 'AbortError') {
                    // This is often expected if a new play request (e.g., from another quick click) interrupted this one.
                    console.info(`Play request for consonant sound ${letterAudio.src} was aborted, likely by a new request.`);
                } else {
                    console.error(`Error playing letter audio for consonant ${letterAudio.src}:`, error);
                }
            });
        });
    });
});
