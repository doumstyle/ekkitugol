// assets/js/leaderboard.js

/**
 * @file Manages the display and update of the leaderboard.
 * It fetches user data from an API and renders it on the page.
 * It also listens for custom events to refresh the leaderboard when user XP changes.
 */

document.addEventListener('DOMContentLoaded', () => {
    const leaderboardDiv = document.getElementById('leaderboard');
    /**
     * @global
     * @type {{firstPlaceIcon: string, secondPlaceIcon: string, thirdPlaceIcon: string, profilePicturesBase: string}}
     * @description Object containing paths to asset files, expected to be set in the Twig template via window.leaderboardAssetPaths.
     */
    const assetPaths = window.leaderboardAssetPaths;
    /** @global @type {string} @description API endpoint URL to fetch leaderboard data, expected to be set in the Twig template via window.leaderboardApiUrl. */
    const apiUrl = window.leaderboardApiUrl;

    if (!leaderboardDiv || !assetPaths || !apiUrl) {
        console.error('Leaderboard container, asset paths, or API URL not found.');
        return;
    }

    /**
     * Fetches leaderboard data from the API and then calls the render function.
     * Handles errors during fetching or rendering.
     * @async
     */
    async function fetchAndRenderLeaderboard() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const users = await response.json();
            renderLeaderboard(users);
        } catch (error) {
            console.error('Failed to fetch or render leaderboard:', error);
            leaderboardDiv.innerHTML = '<p class="text-danger text-center">Could not load leaderboard data.</p>';
        }
    }

    /**
     * Renders the leaderboard in the DOM based on the provided user data.
     * @param {Array<Object>} users - An array of user objects. Each object should have `firstname`, `lastname`, `xp`, and optionally `picture`.
     * @returns {void}
     */
    function renderLeaderboard(users) {
        leaderboardDiv.innerHTML = ''; // Clear existing leaderboard

        if (users.length === 0) {
            leaderboardDiv.innerHTML = '<p class="text-center">No users on the leaderboard yet.</p>';
            return;
        }

        /**
         * @typedef {Object} User
         * @property {string} firstname - The user's first name.
         * @property {string} lastname - The user's last name.
         * @property {number} xp - The user's experience points.
         * @property {string} [picture] - The user's profile picture filename (optional).
         */
        users.forEach((user, index) => {
            const rank = index + 1;
            const userElement = document.createElement('div');
            userElement.className = 'd-flex justify-content-between align-items-center w-100 mb-2 py-2 border-bottom';

            let rankIndicatorHtml = '';
            if (rank === 1) {
                rankIndicatorHtml = `<img src="${assetPaths.firstPlaceIcon}" alt="First place" width="32" height="32">`;
            } else if (rank === 2) {
                rankIndicatorHtml = `<img src="${assetPaths.secondPlaceIcon}" alt="Second place" width="32" height="32">`;
            } else if (rank === 3) {
                rankIndicatorHtml = `<img src="${assetPaths.thirdPlaceIcon}" alt="Third place" width="32" height="32">`;
            } else {
                rankIndicatorHtml = `<span class="fw-bold">${rank}</span>`;
            }

            const profilePicUrl = assetPaths.profilePicturesBase + (user.picture || 'default.png'); // Handle missing picture

            userElement.innerHTML = `
                <div class="d-flex align-items-center gap-2 gap-sm-3 flex-grow-1 me-2 me-sm-3">
                    <div style="width: 30px; text-align: center;">
                        ${rankIndicatorHtml}
                    </div>
                    <img src="${profilePicUrl}" alt="Profile picture of ${user.firstname} ${user.lastname}" class="rounded-circle" width="40" height="40" onerror="this.src='${assetPaths.profilePicturesBase}default.png'; this.onerror=null;">
                    <span class="fw-bold text-break">${user.firstname} ${user.lastname}</span>
                </div>
                <span class="text-secondary fw-bold">${user.xp} XP</span>
            `;
            leaderboardDiv.appendChild(userElement);
        });
    }

    // Initial load
    fetchAndRenderLeaderboard();

    /**
     * Event listener for 'xpUpdated' custom event.
     * Refreshes the leaderboard when user XP is updated elsewhere.
     */
    document.addEventListener('xpUpdated', () => {
        console.log('XP update detected, refreshing leaderboard...');
        fetchAndRenderLeaderboard();
    });
});
