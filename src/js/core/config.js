
// Core configuration and constants
export const CONFIG = {
    webhookUrl: 'https://n8n-service.com/webhook/chat', // Replace with your actual webhook URL
    webhookImage: 'https://n8n-service.com/webhook/image', // Replace with your actual image webhook URL
    maxStoredMessages: 15
};

export const ELEMENTS = {
    target: () => document.querySelector('.out'),
    textarea: () => document.querySelector('textarea'),
    main: () => document.querySelector('main')
};

export const baseHeight = document.querySelector('textarea')?.scrollHeight || 40;
