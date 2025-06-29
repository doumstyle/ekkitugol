/**
 * @fileoverview Manages theme (dark/light) switching and dynamic logo updates
 * based on the current theme and screen size.
 */

document.addEventListener('DOMContentLoaded', function () {
    const logoSmallElement = document.getElementById('logo-small');
    const logoLargeElement = document.getElementById('logo-large');

    /**
     * Updates the src attribute of logo images based on the current theme and screen size.
     * It checks for 'data-bs-theme' on the <html> element and screen width relative to
     * Bootstrap's 'md' breakpoint (768px).
     */
    const updateLogosForThemeAndSize = () => {
        let currentTheme = document.documentElement.getAttribute('data-bs-theme');

        // Fallback for older Bootstrap or custom setups using data-bs-theme on body
        if (!currentTheme && document.body.hasAttribute('data-bs-theme')) {
            currentTheme = document.body.getAttribute('data-bs-theme');
        }

        // Handle 'auto' theme by respecting user's OS/browser preference
        if (currentTheme === 'auto') {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                currentTheme = 'dark';
            } else {
                currentTheme = 'light'; // Default to light if preference is not dark or not detectable
            }
        }

        const isLargeScreen = window.matchMedia('(min-width: 768px)').matches;

        if (isLargeScreen) {
            if (logoLargeElement) {
                if (currentTheme === 'dark') {
                    logoLargeElement.setAttribute('src', logoLargeElement.dataset.darkSrc);
                } else { // Default to light theme
                    logoLargeElement.setAttribute('src', logoLargeElement.dataset.lightSrc);
                }
            }
        } else {
            if (logoSmallElement) {
                if (currentTheme === 'dark') {
                    logoSmallElement.setAttribute('src', logoSmallElement.dataset.darkSrc);
                } else { // Default to light theme
                    logoSmallElement.setAttribute('src', logoSmallElement.dataset.lightSrc);
                }
            }
        }
    };

    if (logoSmallElement && logoLargeElement) {
        // Set the logos initially
        updateLogosForThemeAndSize();

        // Observe changes to data-bs-theme on <html> for dynamic theme switching
        const themeObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-bs-theme') {
                    updateLogosForThemeAndSize(); // Update logos when theme changes
                    break;
                }
            }
        });
        themeObserver.observe(document.documentElement, { attributes: true });

        // Update logos when the screen size crosses the breakpoint
        window.addEventListener('resize', updateLogosForThemeAndSize);
    } else {
        console.warn('Logo elements with IDs "logo-small" or "logo-large" not found. Cannot update logos based on theme and size.');
    }

    // --- Theme Toggle Functionality ---
    const themeToggleBtns = document.querySelectorAll('.themeToggleBtn');
    const sunIconClass = 'bi-sun-fill'; // Bootstrap Icon class for sun
    const moonIconClass = 'bi-moon-stars-fill'; // Bootstrap Icon class for moon
    const htmlElement = document.documentElement;

    /**
     * Updates the icon and ARIA attributes of all theme toggle buttons.
     * @param {string} theme The current theme ('light' or 'dark').
     */
    const updateAllThemeButtonIcons = (theme) => {
        themeToggleBtns.forEach(btn => {
            if (theme === 'dark') {
                btn.innerHTML = `<i class="${sunIconClass}"></i>`;
                btn.setAttribute('aria-label', 'Switch to light theme');
            } else { // 'light' or resolved 'auto' to light
                btn.innerHTML = `<i class="${moonIconClass}"></i>`;
                btn.setAttribute('aria-label', 'Switch to dark theme');
            }
        });
    };

    /**
     * Applies the selected theme preference to the HTML element and saves it to localStorage.
     * @param {string} theme The theme to apply ('light' or 'dark').
     */
    const applyThemePreference = (theme) => {
        htmlElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme); // Persist choice
        updateAllThemeButtonIcons(theme);
        // Logo updates are handled by the MutationObserver on 'data-bs-theme'.
    };

    /**
     * Handles the click event on a theme toggle button.
     */
    const handleThemeToggleClick = () => {
        let currentTheme = htmlElement.getAttribute('data-bs-theme');

        // If current theme is 'auto' or not set, determine effective theme before toggling
        if (currentTheme === 'auto' || !currentTheme) {
            currentTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyThemePreference(newTheme);
    };

     /**
     * Initializes the theme toggle buttons' icons based on the currently applied theme.
     */
    const initializeThemeToggle = () => {
        let currentAppliedTheme = htmlElement.getAttribute('data-bs-theme');
        // Resolve 'auto' or unset theme to an effective theme for icon initialization
        if (!currentAppliedTheme || currentAppliedTheme === 'auto') {
            currentAppliedTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        updateAllThemeButtonIcons(currentAppliedTheme);
    };

   // Attach event listener to each theme toggle button
    if (themeToggleBtns.length > 0) {
        themeToggleBtns.forEach(btn => {
            btn.addEventListener('click', handleThemeToggleClick);
        });
    } else {
        console.warn('No theme toggle buttons with class "themeToggleBtn" found.');
    }

    initializeThemeToggle(); // Initialize the buttons icon on page load
});
