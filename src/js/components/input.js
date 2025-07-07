
import { ELEMENTS, baseHeight } from '../core/config.js';
import { addMessageToHistory, clearChatHistory } from '../core/history.js';
import { appendUserInput, initiateBotProcessing, postUserInput } from './chat.js';
import { scrollPageToEnd } from '../utils/ui.js';
import { updateSlashCommandMenu, hideSlashCommandMenu } from './menus.js';
import { processImageFile } from './image.js';

export async function handleInput(msg) {
    // Check for special commands
    if (msg.trim().toLowerCase() === '/history clear') {
        clearChatHistory();
        return;
    }
    if (msg.trim().toLowerCase() === '/help') {
        handleInput('Explain how we can work together!');
        return;
    }
    if (msg.trim().toLowerCase() === '/tools') {
        handleInput('What tools can we use here?');
        return;
    }

    appendUserInput(msg);
    addMessageToHistory('user', msg);
    initiateBotProcessing();
    scrollPageToEnd();
    const main = ELEMENTS.main();
    main.classList.add("processing");
    postUserInput(msg);
}

export function processUserInput() {
    const textarea = ELEMENTS.textarea();
    const input = textarea.value;
    textarea.value = '';
    textarea.focus();
    textarea.disabled = true;
    textarea.style.height = `${baseHeight}px`;
    hideSlashCommandMenu();
    handleInput(input);
}

export function handleButtonClick(event) {
    const action = event.target.getAttribute('data-action');
    switch (action) {
        case 'input':
            processUserInput();
            break;
        case 'action2':
            // Additional actions can be added here
            break;
        default:
            console.log('No valid action specified');
    }
}

export function setupInputListeners() {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });

    const textarea = ELEMENTS.textarea();
    const scrollHeight = baseHeight;

    textarea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleButtonClick({ target: { getAttribute: () => 'input' } });
            event.preventDefault();
        }
    });

    textarea.addEventListener('input', () => {
        const chk = textarea.scrollHeight - 1;
        if ((chk > scrollHeight) && textarea.value != '') {
            textarea.style.height = `${scrollHeight * 2.5}px`;
        } else {
            textarea.style.height = `${scrollHeight}px`;
        }
        
        // Handle slash command menu
        updateSlashCommandMenu(textarea.value);
    });

    // Add paste event listener for images
    textarea.addEventListener('paste', handlePaste);

    // Add drag and drop event listeners for images
    textarea.addEventListener('dragover', handleDragOver);
    textarea.addEventListener('drop', handleDrop);
}

function handlePaste(event) {
    const items = event.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.type.indexOf('image') !== -1) {
            event.preventDefault();
            const file = item.getAsFile();

            if (file) {
                processImageFile(file);
            }
            break;
        }
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
}

function handleDrop(event) {
    event.preventDefault();

    const files = event.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.type.indexOf('image') !== -1) {
            processImageFile(file);
            break; // Only process the first image
        }
    }
}
