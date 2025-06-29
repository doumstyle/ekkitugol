/**
 * @fileoverview Utility functions for lesson management in the application.
 * Provides shared functionalities like updating progress bars and sending completion requests.
 */

window.LessonUtils = {
    /**
     * Updates the visual state of a progress bar element.
     *
     * @param {HTMLElement} progressBarElement The progress bar DOM element to update.
     * @param {number} currentItemIndex The current item's index (0-based).
     * @param {number} totalItems The total number of items in the lesson.
     */
    updateProgressBar: function(progressBarElement, currentItemIndex, totalItems) {
        if (!progressBarElement) {
            console.warn("Progress bar element not provided to updateProgressBar.");
            return;
        }

        const progressPercentage = totalItems > 0 ? Math.min(100, (currentItemIndex / totalItems) * 100) : 0;
        progressBarElement.style.width = `${progressPercentage}%`;
        progressBarElement.setAttribute('aria-valuenow', progressPercentage);

        // Ensure the bar is visually full if currentItemIndex indicates completion,
        // as some calling contexts might rely on this before other UI updates.
        if (currentItemIndex >= totalItems && totalItems > 0) {
            progressBarElement.style.width = '100%';
            progressBarElement.setAttribute('aria-valuenow', 100);
        }
    },

    /**
     * Sends a POST request to the specified URL with the given payload.
     * Typically used for sending lesson completion data to the backend.
     *
     * @param {string} url The URL to send the request to.
     * @param {object} payload The data to send in the request body (will be JSON.stringify'd).
     * @returns {Promise<Response>} A Promise that resolves with the Response object from the fetch call.
     */
    sendCompletionRequest: async function(url, payload) {
        if (!url || typeof url !== 'string') {
            console.error("URL is required and must be a string for sendCompletionRequest.");
            // Return a rejected promise or throw an error to signal failure more strongly
            return Promise.reject(new Error("Invalid URL provided for sendCompletionRequest."));
        }
        if (payload === undefined) {
            console.warn("Payload is undefined for sendCompletionRequest. Sending an empty object instead.");
            payload = {}; // Or handle as an error, depending on requirements
        }

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });
    }
};
