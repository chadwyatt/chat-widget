(function() {
    // Store styles in a string
    const styles = `
        :root {
            --primary-color: #bb7e4c;
            --secondary-color: #785030;
        }

        .chat-widget-popup {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        }

        .chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
        }

        .chat-widget-popup {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 360px;
            height: 600px;
            opacity: 0;
            visibility: hidden;
            z-index: 1000;
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease, visibility 0.5s ease;
        }

        .chat-widget-popup.active {
            visibility: visible;
            opacity: 1;
            transform: translateY(0);
        }

        .chat-widget-popup.centered {
            bottom: auto;
            right: auto;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: min(90vw, 800px);
            height: min(90vh, 800px);
            aspect-ratio: 4/3;
        }

        .chat-widget-popup.centered.active {
            visibility: visible;
            opacity: 1;
            transform: translate(-50%, -50%);
        }

        @media (orientation: portrait) {
            .chat-widget-popup.centered {
                aspect-ratio: 3/4;
            }
        }

        .chat-trigger-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: var(--primary-color);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }

        .chat-trigger-button svg {
            width: 32px;
            height: 32px;
            fill: white;
            margin-top: 6px;
        }

        .chat-widget-popup .chat-messages {
            height: calc(100% - 175px);
        }

        .chat-widget-popup .chat-suggestions + .chat-messages {
            height: calc(100% - 220px);
        }

        .chat-widget-popup .chat-input-container {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: #fff;
            border-top: 1px solid #E9E9EB;
            padding: 16px;
            display: flex;
            gap: 12px;
        }

        .chat-header {
            padding: 16px;
            border-bottom: 1px solid #E9E9EB;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fff;
        }

        .chat-title {
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 600;
            font-size: 16px;
            color: #333;
        }

        .chat-title-icon-wrapper {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 2px solid var(--primary-color);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2px;
        }

        .chat-title-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            object-fit: cover;
        }

        .close-button {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
            padding: 4px 8px;
            border-radius: 4px;
            transition: background-color 0.2s;
        }

        .close-button:hover {
            background-color: #f0f0f0;
        }

        .prompt-close-button {
            position: absolute;
            top: -8px;
            right: -8px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #fff;
            border: 1px solid #E9E9EB;
            color: #666;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            z-index: 1;
        }

        .prompt-close-button:hover {
            background: #f0f0f0;
        }

        .chat-prompt-bubble::after {
            content: '';
            position: absolute;
            bottom: -8px;
            right: 24px;
            width: 16px;
            height: 16px;
            background: white;
            border-right: 1px solid #E9E9EB;
            border-bottom: 1px solid #E9E9EB;
            transform: rotate(45deg);
        }

        .chat-prompt-bubble {
            position: fixed;
            bottom: 95px;
            right: 20px;
            background: white;
            padding: 12px 16px;
            border-radius: 16px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            max-width: 90%;
            z-index: 999;
            border: 1px solid #E9E9EB;
            animation: fadeIn 0.3s ease-in;
            cursor: pointer;
        }

        .chat-suggestions {
            padding: 0 16px 16px 16px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .chat-suggestion {
            background: #f0f0f0;
            border: 1px solid #e0e0e0;
            border-radius: 16px;
            padding: 8px 12px;
            font-size: 13px;
            cursor: pointer;
            transition: background-color 0.2s;
            color: #333;
        }

        .chat-suggestion:hover {
            background: #e0e0e0;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .chat-widget-popup.active + .chat-prompt-bubble {
            display: none;
        }

        .chat-input-container {
            display: flex;
            gap: 12px;
            padding: 16px;
            border-top: 1px solid #E9E9EB;
            background: #fff;
        }

        .chat-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #E9E9EB;
            border-radius: 20px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
        }

        .chat-input:focus {
            border-color: var(--primary-color);
        }

        .send-button {
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 20px;
            padding: 8px 16px;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .send-button:hover {
            background: var(--secondary-color);
        }

        .send-button:disabled {
            /*background: #E9E9EB;*/
            cursor: not-allowed;
        }

        .message {
            margin: 8px 0;
            padding: 8px 12px;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            width: fit-content;
        }

        .user-message {
            background: var(--primary-color);
            color: white;
            margin-left: auto;
            border-bottom-right-radius: 4px;
            align-self: flex-end;
        }

        .bot-message {
            background: #F1F1F1;
            color: #333;
            margin-right: auto;
            border-bottom-left-radius: 4px;
        }

        .typing-indicator {
            display: flex;
            gap: 4px;
            padding: 12px;
            background: #F1F1F1;
            border-radius: 12px;
            width: fit-content;
            margin: 8px 0;
        }

        .typing-dot {
            width: 8px;
            height: 8px;
            background: #666;
            border-radius: 50%;
            animation: typing-bounce 1s infinite;
        }

        @keyframes typing-bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-8px); }
        }

        .typing-dot:nth-child(2) { 
            animation-delay: 0.2s; 
        }

        .typing-dot:nth-child(3) { 
            animation-delay: 0.4s; 
        }

        /* Dark mode styles */
        .chat-widget-popup.dark-mode {
            background: #1c1c1e;
            color: #fff;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
        }

        .dark-mode .chat-header {
            background: #2c2c2e;
            border-bottom: 1px solid #3d3d3d;
        }

        .dark-mode .chat-title {
            color: #fff;
        }

        .dark-mode .close-button {
            color: #fff;
        }

        .dark-mode .close-button:hover {
            background-color: #3d3d3d;
        }

        .dark-mode .chat-input-container {
            background: #2c2c2e;
            border-top: 1px solid #3d3d3d;
        }

        .dark-mode .chat-input {
            background: #1c1c1e;
            border-color: #3d3d3d;
            color: #fff;
        }

        .dark-mode .chat-input:focus {
            border-color: var(--primary-color);
        }

        .dark-mode .chat-suggestion {
            background: #2c2c2e;
            border-color: #3d3d3d;
            color: #fff;
        }

        .dark-mode .chat-suggestion:hover {
            background: #3d3d3d;
        }

        .dark-mode .bot-message {
            background: #2c2c2e;
            color: #fff;
        }

        .dark-mode .typing-indicator {
            background: #2c2c2e;
        }

        .dark-mode .typing-dot {
            background: #fff;
        }

        /* Additional styles for suggestions title */
        .suggestions-title {
            padding: 16px 16px 8px 16px;
            font-size: 14px;
            color: #666;
            font-weight: 500;
        }

        .dark-mode .suggestions-title {
            color: #999;
        }

        /* Adjust messages container heights */
        .chat-widget-popup .chat-messages {
            height: calc(100% - 170px); /* Adjusted for header + input heights */
            padding-bottom: 80px;
        }

        .chat-widget-popup .chat-suggestions + .chat-messages {
            height: calc(100% - 220px); /* Adjusted to account for suggestions */
        }

        .chat-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
            z-index: 999;
        }

        .chat-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .dark-mode + .chat-overlay {
            background: rgba(0, 0, 0, 0.7);
        }
    `;

    class ChatWidget {
        constructor(config) {
            // console.log("config1:", config);
            this.init(config);
        }

        async init(config) {
            // Get the page URL info
            const pageUrl = window.location;
            // console.log("pageUrl:", pageUrl);
            
            // Merge the URL info with provided config
            config = {
                ...config,
                url: pageUrl.href,
                domain: pageUrl.hostname,
                pathname: pageUrl.pathname
            };
            await this.getConfig(config);
            // console.log("config3:", config);
            
            // Check for thread_id in URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const threadId = urlParams.get('thread_id');
            if (threadId) {
                await this.loadThread(threadId);
            }
            
            this.injectStyles()
            this.createWidget()
            this.setupEventListeners()
            if (this.config.darkMode) {
                this.elements.widget.classList.add('dark-mode')
            }
            if (this.config.centered) {
                this.elements.widget.classList.add('centered');
            }
            if (this.config.auto_open) {
                this.elements.widget.classList.add('active');
                if (this.config.centered) {
                    this.elements.overlay.classList.add('active');
                }
                // Load message history if auto-opening
                this.loadMessageHistory();
            }
        }

        async getConfig(config) {
            let endpoint = "https://hook.us1.make.com/g1xnzwxq3faod19mkcx0d3yhm1z0c6nk";

            // Fetch configuration from endpoint
            const configResponse = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'get_config',
                    url: config.url,
                    domain: config.domain,
                    pathname: config.pathname
                })
            });

            // if (configResponse.ok) {
                const configData = await configResponse.json();

                // console.log("configData:", configData);
                // if (configData.config) {
                    config = {...config, ...configData};
                // }
            // }

            console.log("config2:", config);

            this.config = {
                // endpoint: "https://hook.us1.make.com/ouc69ww2ybwot4w9utreqbrxddc3dozv",
                endpoint: "https://hook.us1.make.com/g1xnzwxq3faod19mkcx0d3yhm1z0c6nk",
                title: config.title || 'Chat Support',
                mode: config.mode || 'popup',
                suggestions: config.suggestions.split("\n") || [],
                prompt: config.prompt || 'How can we help you today?',
                icon: config.icon || 'https://assets.zyrosite.com/dWx06KrN05hEkWvY/lml-anchor-m6Lwvywoloukoege.png',
                darkMode: config.dark_mode || false,
                key: config.key || null,
                assistant_id: config.assistant_id || null,
                centered: config.centered || false,
                auto_open: config.auto_open || false,
            };
            // console.log("config4:", this.config);
            this.thread_id = null;
        }

        injectStyles() {
            const styleElement = document.createElement('style');
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }

        createWidget() {
            const widgetHTML = `
                <div class="chat-widget-popup" id="chat-widget">
                    <div class="chat-header">
                        <div class="chat-title">
                            <div class="chat-title-icon-wrapper">
                                <img 
                                    src="${this.config.icon}"
                                    alt="Chat icon"
                                    class="chat-title-icon"
                                />
                            </div>
                            <span>${this.config.title}</span>
                        </div>
                        <button class="close-button" id="close-chat">×</button>
                    </div>
                    ${this.config.suggestions.length ? `
                        <div class="suggestions-title">Examples / Suggestions</div>
                        <div class="chat-suggestions">
                            ${this.config.suggestions.map(suggestion => 
                                `<button class="chat-suggestion">${suggestion}</button>`
                            ).join('')}
                        </div>
                    ` : ''}
                    <div id="chat-messages" class="chat-messages"></div>
                    <div class="chat-input-container">
                        <input type="text" id="chat-input" class="chat-input" placeholder="Type your message...">
                        <button id="send-button" class="send-button">Send</button>
                    </div>
                </div>

                <button id="chat-trigger" class="chat-trigger-button">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                    </svg>
                </button>

                <div class="chat-prompt-bubble">
                    <button class="prompt-close-button" id="prompt-close">×</button>
                    ${this.config.prompt}
                </div>

                <div id="chat-overlay" class="chat-overlay"></div>
            `;

            const container = document.createElement('div');
            container.innerHTML = widgetHTML;
            document.body.appendChild(container);

            this.elements = {
                widget: document.getElementById('chat-widget'),
                messages: document.getElementById('chat-messages'),
                input: document.getElementById('chat-input'),
                sendButton: document.getElementById('send-button'),
                trigger: document.getElementById('chat-trigger'),
                closeButton: document.getElementById('close-chat'),
                promptClose: document.getElementById('prompt-close'),
                overlay: document.getElementById('chat-overlay')
            };
        }

        setupEventListeners() {
            this.elements.trigger.addEventListener('click', () => {
                this.elements.widget.classList.add('active');
                if (this.config.centered) {
                    this.elements.overlay.classList.add('active');
                }
                // Load message history if it exists
                this.loadMessageHistory();
            });

            this.elements.closeButton.addEventListener('click', () => {
                this.elements.widget.classList.remove('active');
                this.elements.overlay.classList.remove('active');
            });

            this.elements.overlay.addEventListener('click', () => {
                this.elements.widget.classList.remove('active');
                this.elements.overlay.classList.remove('active');
            });

            this.elements.sendButton.addEventListener('click', () => this.sendMessage());
            this.elements.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });

            this.elements.input.addEventListener('input', () => {
                this.elements.sendButton.disabled = !this.elements.input.value.trim();
            });

            // Add click handler for prompt bubble
            const promptBubble = document.querySelector('.chat-prompt-bubble');
            if (promptBubble) {
                promptBubble.addEventListener('click', () => {
                    this.elements.widget.classList.add('active');
                    if (this.config.centered) {
                        this.elements.overlay.classList.add('active');
                    }
                    promptBubble.style.display = 'none';
                });
            }

            if (this.elements.promptClose) {
                this.elements.promptClose.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const promptBubble = document.querySelector('.chat-prompt-bubble');
                    if (promptBubble) {
                        promptBubble.style.display = 'none';
                    }
                });
            }

            // Add suggestion click handlers
            document.querySelectorAll('.chat-suggestion').forEach(button => {
                button.addEventListener('click', () => {
                    this.elements.input.value = button.textContent;
                    this.sendMessage();
                });
            });

            // Add click handlers for any toggle-chat-window elements
            document.addEventListener('click', (e) => {
                if (e.target.closest('.toggle-chat-window')) {
                    if (this.elements.widget.classList.contains('active')) {
                        // Close the chat if it's open
                        this.elements.widget.classList.remove('active');
                        this.elements.overlay.classList.remove('active');
                    } else {
                        // Open the chat if it's closed
                        this.elements.widget.classList.add('active');
                        if (this.config.centered) {
                            this.elements.overlay.classList.add('active');
                        }
                    }
                }
            });
        }

        async sendMessage() {
            const message = this.elements.input.value.trim();
            if (!message) return;

            // Add user message to chat
            this.addMessage(message, 'user');
            this.elements.input.value = '';
            this.elements.sendButton.disabled = true;

            // Clear suggestions
            const suggestionsContainer = document.querySelector('.chat-suggestions');
            const suggestionsTitle = document.querySelector('.suggestions-title');
            if (suggestionsContainer) suggestionsContainer.remove();
            if (suggestionsTitle) suggestionsTitle.remove();

            // Show typing indicator
            this.showTypingIndicator();

            try {
                const response = await fetch(this.config.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message,
                        assistant_id: this.config.assistant_id,
                        thread_id: this.thread_id,
                        action: 'send_message',
                        key: this.config.key
                    })
                });

                const data = await response.json();
                this.removeTypingIndicator();
                this.thread_id = data.thread_id;
                this.addMessage(data.response, 'bot');
            } catch (error) {
                this.removeTypingIndicator();
                console.error('Error sending message:', error);
                this.addMessage('Sorry, there was an error sending your message.', 'bot');
            }
        }

        addMessage(text, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}-message`;
            messageDiv.textContent = text;
            this.elements.messages.appendChild(messageDiv);
            this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
        }

        toggleDarkMode(enabled) {
            if (enabled) {
                this.elements.widget.classList.add('dark-mode');
            } else {
                this.elements.widget.classList.remove('dark-mode');
            }
            this.config.darkMode = enabled;
        }

        toggleCenteredMode(enabled) {
            if (enabled) {
                this.elements.widget.classList.add('centered');
            } else {
                this.elements.widget.classList.remove('centered');
            }
            this.config.centered = enabled;
        }

        showTypingIndicator() {
            const indicator = document.createElement('div');
            indicator.className = 'typing-indicator';
            indicator.innerHTML = `
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            `;
            indicator.id = 'typing-indicator';
            this.elements.messages.appendChild(indicator);
            this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
        }

        removeTypingIndicator() {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) {
                indicator.remove();
            }
        }

        // Add new loadThread method
        async loadThread(threadId) {
            try {
                const response = await fetch(this.config.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'load_thread',
                        thread_id: threadId,
                        key: this.config.key,
                        assistant_id: this.config.assistant_id
                    })
                });

                const data = await response.json();
                console.log("data:", data);
                // if (data.messages) {
                    // Clear any existing messages
                    // this.elements.messages.innerHTML = '';
                    
                    // Add each message to the chat
                    // data.data.forEach(msg => {
                    //     this.addMessage(msg.content[0], msg.role === 'user' ? 'user' : 'bot');
                    // });

                    this.messageHistory = data.data

                    
                    // Store the thread_id
                    this.thread_id = threadId;
                // }
            } catch (error) {
                console.error('Error loading thread:', error);
                this.addMessage('Sorry, there was an error loading the chat history.', 'bot');
            }
        }

        // Add new method to handle message history loading
        loadMessageHistory() {
            if (this.messageHistory && this.messageHistory.length) {
                // Clear suggestions
                const suggestionsContainer = document.querySelector('.chat-suggestions');
                const suggestionsTitle = document.querySelector('.suggestions-title');
                if (suggestionsContainer) suggestionsContainer.remove();
                if (suggestionsTitle) suggestionsTitle.remove();

                // Add each message to the chat
                this.messageHistory.forEach(msg => {
                    this.addMessage(msg.content[0].text.value, msg.role === 'user' ? 'user' : 'bot');
                });
                // Clear the message history after loading
                this.messageHistory = null;
            }
        }
    }

    // Queue handler
    window.cw = window.cw || function() {
        (window.cw.q = window.cw.q || []).push(arguments);
    };

    // Process queue
    const processQueue = () => {
        const queue = window.cw.q || [];
        queue.forEach(args => {
            const [method, ...params] = args;
            if (method === 'init') {
                window.chatWidget = new ChatWidget(params[0]);
            }
        });
    };

    // Process any queued commands
    processQueue();

    // Handle any future commands
    window.cw = function() {
        const [method, ...params] = arguments;
        // console.log("test:", method, params);
        if (method === 'init') {
            window.chatWidget = new ChatWidget(params[0]);
        } else if (method === 'toggleDarkMode') {
            if (window.chatWidget) {
                window.chatWidget.toggleDarkMode(params[0]);
            }
        } else if (method === 'toggleCenteredMode') {
            if (window.chatWidget) {
                window.chatWidget.toggleCenteredMode(params[0]);
            }
        }
    };
})(); 