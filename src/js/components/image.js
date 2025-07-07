
import { CONFIG } from '../core/config.js';
import { appendUserInput, initiateBotProcessing, handleOutput } from './chat.js';
import { scrollPageToEnd } from '../utils/ui.js';
import { getSessionID } from '../core/session.js';

export function processImageFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        handleImageInput(base64Image, file.name || 'dropped-image.png');
    };
    reader.readAsDataURL(file);
}

async function handleImageInput(base64Image, fileName) {
    // Display the image in the chat
    appendUserInput(`<img src="${base64Image}" alt="Uploaded image" style="max-width: 420px;">
                     <div style="font-size: 0.8em; opacity: 0.7; margin-top: 0.25rem;">🖼️ ${fileName}</div>`);

    initiateBotProcessing();
    scrollPageToEnd();
    document.querySelector('main').classList.add("processing");

    // Send image data to webhook
    try {
        const response = await fetch(CONFIG.webhookImage, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chatInput: "User uploaded an image, please describe.",
                imageData: base64Image,
                fileName: fileName,
                action: "sendImage",
                sessionId: getSessionID()
            })
        });
        
        const decoder = new TextDecoder();
        const reader = response.body.getReader();

        const processStream = ({ done, value }) => {
            if (done) return;

            const event = decoder.decode(value);
            try {
                const payload = JSON.parse(event);
                handleOutput(payload.data);
            } catch (error) {
                console.error('Error parsing event:', error);
            }
            reader.read().then(processStream);
        };

        reader.read().then(processStream);
    } catch (error) {
        console.error('Error sending image:', error);
        handleOutput('Sorry, there was an error processing your image.');
    }
}
