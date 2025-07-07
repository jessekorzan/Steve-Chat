import { initializeSession } from './core/session.js';
import { loadChatHistory } from './core/history.js';
import { setupInputListeners, handleInput } from './components/input.js';
import { setupMenuListeners } from './components/menus.js';
import { displayWelcomeMessage } from './components/chat.js';
import { checkURLParameters } from './utils/ui.js';

window.addEventListener("load", () => {
    console.log("Page loaded and ready!");
    initializeSession();
    setupInputListeners();
    setupMenuListeners();
    loadChatHistory();
    displayWelcomeMessage();

    // Check for URL parameters and handle them
    const urlParam = checkURLParameters();
    if (urlParam) {
        setTimeout(() => {
            handleInput(urlParam);
        }, 500);
    }
});

// Expose handleInput to the global scope for dev tools and onclick handlers
window.handleInput = handleInput;