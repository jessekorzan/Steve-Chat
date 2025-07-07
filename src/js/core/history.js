
import { CONFIG, ELEMENTS } from './config.js';
import { scrollPageToEnd } from '../utils/ui.js';

export function loadChatHistory() {
    const storedMessages = localStorage.getItem('chatHistory');
    if (storedMessages) {
        const messages = JSON.parse(storedMessages);
        const target = ELEMENTS.target();
        messages.forEach(message => {
            if (message.type === 'user') {
                target.innerHTML += `<div class="user"><span>${message.content}</span></div>`;
            } else if (message.type === 'bot') {
                target.innerHTML += `<div class="bot"><span>${message.content}</span></div>`;
            }
        });
        scrollPageToEnd();
    }
}

export function saveChatHistory() {
    const messages = [];
    const target = ELEMENTS.target();
    const messageElements = target.querySelectorAll('.user, .bot:not(.status)');

    // Get the last MAX_STORED_MESSAGES messages
    const startIndex = Math.max(0, messageElements.length - CONFIG.maxStoredMessages);

    for (let i = startIndex; i < messageElements.length; i++) {
        const element = messageElements[i];
        const content = element.querySelector('span').innerHTML;
        const type = element.classList.contains('user') ? 'user' : 'bot';
        messages.push({ type, content });
    }

    localStorage.setItem('chatHistory', JSON.stringify(messages));
}

export function addMessageToHistory(type, content) {
    saveChatHistory();
}

export function clearChatHistory() {
    localStorage.removeItem('chatHistory');
    location.reload();
}
