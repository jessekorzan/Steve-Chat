
import { ELEMENTS } from '../core/config.js';
import { processUserInput } from './input.js';
import { handleInput } from './input.js';

// Slash command menu functionality
let slashCommandMenu = null;
let isSlashCommandMenuVisible = false;

function createSlashCommandMenu() {
    const menu = document.createElement('div');
    menu.className = 'slash-command-menu';
    menu.innerHTML = `
        <div class="command-option" data-command="/help">
            <span class="command-name">/help</span>
            <span class="command-desc">How can we work together?</span>
        </div>
        <div class="command-option" data-command="/history clear">
            <span class="command-name">/history clear</span>
            <span class="command-desc">Clear chat history</span>
        </div>
        <div class="command-option" data-command="/tools">
            <span class="command-name">/tools</span>
            <span class="command-desc">What tools can we use here?</span>
        </div>
    `;

    menu.addEventListener('click', handleSlashCommandClick);
    document.body.appendChild(menu);
    return menu;
}

function handleSlashCommandClick(event) {
    const commandElement = event.target.closest('.command-option');
    if (!commandElement) return;

    const command = commandElement.getAttribute('data-command');
    if (command) {
        const textarea = ELEMENTS.textarea();
        textarea.value = command;
        hideSlashCommandMenu();
        processUserInput();
    }
}

function showSlashCommandMenu() {
    if (!slashCommandMenu) {
        slashCommandMenu = createSlashCommandMenu();
    }

    const textarea = ELEMENTS.textarea();
    const textareaRect = textarea.getBoundingClientRect();
    
    slashCommandMenu.style.display = 'block';
    slashCommandMenu.style.left = `${textareaRect.left + 10}px`;
    slashCommandMenu.style.bottom = `${window.innerHeight - textareaRect.top + 4}px`;
    slashCommandMenu.style.width = `${textareaRect.width - 60}px`; // Account for button width
    
    isSlashCommandMenuVisible = true;
}

export function hideSlashCommandMenu() {
    if (slashCommandMenu) {
        slashCommandMenu.style.display = 'none';
    }
    isSlashCommandMenuVisible = false;
}

export function updateSlashCommandMenu(value) {
    if (value.startsWith('/')) {
        showSlashCommandMenu();
    } else {
        hideSlashCommandMenu();
    }
}

// Custom context menu functionality
let contextMenu = null;
let selectedText = '';

function createContextMenu() {
    const menu = document.createElement('div');
    menu.className = 'custom-context-menu';
    menu.innerHTML = `
        <div class="context-option" data-action="tell-more">Tell me more</div>
        <div class="context-option" data-action="verify">Verify</div>
        <div class="context-option" data-action="more-like">More like this</div>
        <div class="context-option" data-action="reformat">Reformat</div>
    `;

    menu.addEventListener('click', handleContextMenuClick);
    document.body.appendChild(menu);
    return menu;
}

function handleContextMenuClick(event) {
    const action = event.target.getAttribute('data-action');
    if (!action || !selectedText.trim()) return;

    hideContextMenu();

    const prompts = {
        'tell-more': `Tell me more about: "${selectedText}"`,
        'verify': `Can you verify if this information is accurate: "${selectedText}"`,
        'more-like': `Give me more examples or information similar to: "${selectedText}"`,
        'reformat': `Please reformat this text for better readability: "${selectedText}"`
    };

    const prompt = prompts[action];
    if (prompt) {
        handleInput(prompt);
    }
}

function showContextMenu(x, y) {
    if (!contextMenu) {
        contextMenu = createContextMenu();
    }

    contextMenu.style.display = 'block';
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;

    // Adjust position if menu goes off screen
    const menuRect = contextMenu.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (menuRect.right > windowWidth) {
        contextMenu.style.left = `${windowWidth - menuRect.width - 10}px`;
    }

    if (menuRect.bottom > windowHeight) {
        contextMenu.style.top = `${windowHeight - menuRect.height - 10}px`;
    }
}

function hideContextMenu() {
    if (contextMenu) {
        contextMenu.style.display = 'none';
    }
}

export function setupMenuListeners() {
    document.addEventListener('contextmenu', (event) => {
        const selection = window.getSelection();
        selectedText = selection.toString().trim();

        if (selectedText) {
            event.preventDefault();
            showContextMenu(event.pageX, event.pageY);
        } else {
            hideContextMenu();
        }
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.custom-context-menu')) {
            hideContextMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            hideContextMenu();
            hideSlashCommandMenu();
        }
    });

    // Hide slash command menu on click outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.slash-command-menu') && !event.target.closest('textarea')) {
            hideSlashCommandMenu();
        }
    });
}
