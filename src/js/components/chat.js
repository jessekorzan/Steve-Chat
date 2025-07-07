
import { CONFIG, ELEMENTS } from '../core/config.js';
import { addMessageToHistory } from '../core/history.js';
import { scrollPageToEnd } from '../utils/ui.js';
import { getSessionID } from '../core/session.js';

function readStream(reader) {
    const decoder = new TextDecoder();

    const processStream = ({ done, value }) => {
        if (done) return;

        const event = decoder.decode(value);
        try {
            const payload = JSON.parse(event);
            handleOutput(payload.data);
        } catch (error) {
            console.error('Error parsing event:', error);
        }
        readStream(reader);
    };

    reader.read().then(processStream).catch(error => console.error('Stream read error:', error));
}

export async function handleOutput(payload) {
    removeLastBotStatus();
    appendBotOutput(payload);
    finalizeOutput();
    addMessageToHistory('bot', payload);
}

function removeLastBotStatus() {
    const target = ELEMENTS.target();
    const lastBotSpan = target.querySelector('.bot.status:last-child');
    if (lastBotSpan) {
        lastBotSpan.remove();
    }
}

function appendBotOutput(payload) {
    const target = ELEMENTS.target();
    target.innerHTML += `<div class="bot"><span>${payload}</span></div>`;
}

function finalizeOutput() {
    const target = ELEMENTS.target();
    const lastBotStatus = target.querySelector('.bot.status:last-child');
    if (lastBotStatus) {
        lastBotStatus.classList.remove('status');
    }
    const main = ELEMENTS.main();
    main.classList.remove("processing");
    const textarea = ELEMENTS.textarea();
    textarea.disabled = false;
    textarea.focus();
    scrollPageToEnd();
}

export function appendUserInput(msg) {
    const target = ELEMENTS.target();
    target.innerHTML += `<div class="user"><span>${msg}</span></div>`;
}

export function initiateBotProcessing() {
    const target = ELEMENTS.target();
    target.innerHTML += `<div class="bot status"><span>Agent working...</span></div>`;
}

export async function postUserInput(msg) {
    try {
        const response = await fetch(CONFIG.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chatInput: msg,
                action: "sendMessage",
                sessionId: getSessionID()
            })
        });
        const reader = response.body.getReader();
        readStream(reader);
    } catch (error) {
        console.error('Error in fetch operation:', error);
    }
}

export function displayWelcomeMessage() {
    // Only show welcome message if no chat history exists
    const storedMessages = localStorage.getItem('chatHistory');
    if (!storedMessages || JSON.parse(storedMessages).length === 0) {
        handleOutput(`
            <h1>Hello, I'm a dumb chat UI 🤠</h1>
            <h2>I'm a surface to interact with an AI agent or workflow.</h2>
            <p>You need to hook me up to your agents webhook so you can chat with it.</p>
            <p>
                <a class="prompt" onclick="handleInput('Who are you?')">Who are you?</a>
                <a class="prompt" onclick="handleInput('What can I do here? What features do you have?')">What can I do here?</a>
                <a class="prompt" onclick="handleInput('Give me some examples of how AI helps me today')">Help me get started</a>
            </p>
        `);
    }
}
