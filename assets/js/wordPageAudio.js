/**
 * @file Manages audio playback for word elements on a page.
 * Ensures that only one word's audio plays at a time.
 */

document.addEventListener('DOMContentLoaded', function () {
    /**
     * @type {NodeListOf<HTMLElement>} A collection of all elements with the class 'wordAudioContainer'.
     * These containers are expected to hold an <audio> element.
     */
    const wordAudioContainers = document.querySelectorAll('.wordAudioContainer');
    
    /**
     * @type {NodeListOf<HTMLAudioElement>} A collection of all <audio> elements found within '.wordAudioContainer' elements.
     * This list is used to efficiently pause other audios when one starts playing.
     */
    const allWordAudios = document.querySelectorAll('.wordAudioContainer audio');

    if (wordAudioContainers.length === 0) {
        // console.info("No elements with class 'wordAudioContainer' found for audio playback."); // Kept for debugging if needed
        return;
    }

    wordAudioContainers.forEach(container => {
        /**
         * Handles the click event on a word audio container.
         * Prevents the default link behavior, finds the associated audio element,
         * stops any other playing word audios, and then plays the clicked word's audio.
         * @param {MouseEvent} event - The click event object.
         */
        container.addEventListener('click', function (event) {
            event.preventDefault();
            const currentAudioElement = this.querySelector('audio');

            if (!currentAudioElement) {
                console.warn("No audio element found in clicked word container:", this);
                return;
            }

            // Stop and reset all other word audios before playing the current one.
            allWordAudios.forEach(audio => {
                if (audio !== currentAudioElement) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });

            // Prepare and play the current audio.
            currentAudioElement.currentTime = 0; // Reset audio to the beginning.
            const playPromise = currentAudioElement.play();

            // Handle potential errors or interruptions during playback.
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    if (error.name === 'AbortError') {
                        console.info(`Play request for ${currentAudioElement.src} was aborted, likely by a new request.`);
                    } else {
                        console.error(`Error playing audio ${currentAudioElement.src}:`, error);
                    }
                });
            }
        });
    });
});