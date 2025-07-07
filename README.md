
# AI Chat Interface

A clean, modern chat interface for connecting with AI agents and workflows. Built with vanilla JavaScript and designed to be easily customizable and deployable.

## Features

- 🤖 **AI Agent Integration** - Connect to any webhook-based AI service
- 💬 **Real-time Streaming** - Supports streaming responses for natural conversation flow
- 🖼️ **Image Support** - Drag & drop or paste images directly into the chat
- 📱 **Responsive Design** - Works great on desktop and mobile
- 💾 **Session Management** - Maintains chat history across browser sessions
- 🔗 **URL Parameters** - Share specific prompts via URL (`?p=your prompt here`)
- ⚡ **Zero Dependencies** - Pure vanilla JavaScript, no frameworks required

## Quick Start

### 1. Clone and Setup
```bash
git clone [your-repo-url]
cd ai-chat-interface
```

### 2. Configure Your AI Service
Edit `src/js/core/config.js` and replace the webhook URLs:

```javascript
export const CONFIG = {
    webhookUrl: 'https://your-service.com/webhook/chat',
    webhookImage: 'https://your-service.com/webhook/image',
    maxStoredMessages: 15
};
```

### 3. Run Locally
Click the **Run** button in Replit, or serve the files with any static web server.

### 4. Deploy
This project is ready to deploy on Replit. Just hit the Deploy button!

## Project Structure

```
├── src/
│   ├── css/
│   │   ├── components/     # Component-specific styles
│   │   ├── App.css        # Global app styles
│   │   ├── reset.css      # CSS reset
│   │   ├── style.css      # Main stylesheet
│   │   └── vars.css       # CSS variables
│   └── js/
│       ├── components/    # UI components
│       │   ├── chat.js    # Chat display logic
│       │   ├── input.js   # Input handling
│       │   ├── image.js   # Image processing
│       │   └── menus.js   # Menu interactions
│       ├── core/         # Core functionality
│       │   ├── config.js  # Configuration
│       │   ├── session.js # Session management
│       │   └── history.js # Chat history
│       ├── utils/        # Utility functions
│       │   └── ui.js     # UI helpers
│       └── script.js     # Main entry point
├── index.html            # Main HTML file
└── .replit              # Replit configuration
```

## Configuration

### Webhook Integration
Your AI service needs to accept POST requests with this structure:

```javascript
{
    "chatInput": "user message",
    "action": "sendMessage",
    "sessionId": "unique-session-id"
}
```

For images:
```javascript
{
    "chatInput": "User uploaded an image, please describe.",
    "imageData": "data:image/jpeg;base64,/9j/4AAQ...", 
    "fileName": "image.jpg",
    "action": "sendImage",
    "sessionId": "unique-session-id"
}
```

### Response Format
Your webhook should return streaming text responses. The interface will display them in real-time as they arrive.

### URL Parameters
Share specific prompts by adding `?p=your prompt` to the URL:
```
https://your-app.com?p=Tell me about AI
```

## Customization

### Styling
- Edit CSS variables in `src/css/vars.css` for colors and spacing
- Modify component styles in `src/css/components/`
- The design uses CSS Grid and Flexbox for responsive layouts

### Functionality
- Adjust message history limit in `CONFIG.maxStoredMessages`
- Customize welcome message in `src/js/components/chat.js`
- Add new UI components following the existing pattern

### Example AI Services
This interface works with:
- OpenAI GPT models via custom webhooks
- Anthropic Claude via API wrappers
- Local AI models (Ollama, etc.)
- Custom AI workflows (n8n, Zapier, etc.)

## Browser Support
- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge
- Mobile browsers supported

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
Open source - feel free to use and modify for your projects.

## Need Help?
- Check the browser console for error messages
- Ensure your webhook URLs are correctly configured
- Test your AI service endpoints independently first
- Make sure CORS is properly configured on your backend

---

Built with ❤️ for the AI community. Happy chatting! 🤖
