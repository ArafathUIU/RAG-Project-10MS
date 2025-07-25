document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatContainer = document.getElementById('chat-container');
    const charCount = document.getElementById('char-count');
    const clearChatBtn = document.getElementById('clear-chat');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    const saveSettings = document.getElementById('save-settings');
    const cancelSettings = document.getElementById('cancel-settings');
    const langEnBtn = document.getElementById('lang-en');
    const langBnBtn = document.getElementById('lang-bn');
    const voiceInputBtn = document.getElementById('voice-input');
    const uploadPdfBtn = document.getElementById('upload-pdf');
    const pdfUpload = document.getElementById('pdf-upload');

    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        charCount.textContent = this.value.length;
    });

    // Language switching
    langEnBtn.addEventListener('click', function() {
        this.classList.add('active', 'bg-red-600', 'text-white');
        this.classList.remove('text-gray-800');
        langBnBtn.classList.remove('active', 'bg-red-600', 'text-white');
        langBnBtn.classList.add('text-gray-800');
        userInput.placeholder = "Type your question here...";
    });

    langBnBtn.addEventListener('click', function() {
        this.classList.add('active', 'bg-red-600', 'text-white');
        this.classList.remove('text-gray-800');
        langEnBtn.classList.remove('active', 'bg-red-600', 'text-white');
        langEnBtn.classList.add('text-gray-800');
        userInput.placeholder = "আপনার প্রশ্ন এখানে লিখুন...";
    });

    // Settings modal
    settingsBtn.addEventListener('click', function() {
        settingsModal.classList.remove('hidden');
    });

    closeSettings.addEventListener('click', function() {
        settingsModal.classList.add('hidden');
    });

    cancelSettings.addEventListener('click', function() {
        settingsModal.classList.add('hidden');
    });

    saveSettings.addEventListener('click', function() {
        settingsModal.classList.add('hidden');
        // In a real app, you would save settings here
    });

    // Clear chat
    clearChatBtn.addEventListener('click', function() {
        chatContainer.innerHTML = `
            <div class="flex justify-center">
                <div class="max-w-3xl w-full bg-white rounded-lg shadow-md p-4 border-l-4 border-red-600">
                    <div class="flex items-start space-x-3">
                        <div class="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-black">RAG Assistant</h3>
                            <p class="text-gray-700">Hello! I can answer questions about the HSC Bangla 1st paper book. Ask me anything in English or বাংলা.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    // Voice input (mock functionality)
    voiceInputBtn.addEventListener('click', function() {
        if (langEnBtn.classList.contains('active')) {
            alert("Voice input would be enabled for English in a real implementation");
        } else {
            alert("ভয়েস ইনপুট বাংলার জন্য সক্রিয় করা হবে");
        }
    });

    // PDF upload
    uploadPdfBtn.addEventListener('click', function() {
        pdfUpload.click();
    });

    pdfUpload.addEventListener('change', function() {
        if (this.files.length > 0) {
            const fileName = this.files[0].name;
            alert(`PDF "${fileName}" would be uploaded and processed in a real implementation`);
        }
    });

    // Chat form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = userInput.value.trim();
        if (message === '') return;

        // Add user message to chat
        addMessageToChat('user', message);
        userInput.value = '';
        userInput.style.height = 'auto';
        charCount.textContent = '0';

        // Show typing indicator
        const typingId = showTypingIndicator();

        // Simulate API response after delay
        setTimeout(() => {
            // Remove typing indicator
            removeTypingIndicator(typingId);

            // Generate mock response based on sample questions
            let responseText = '';
            let confidence = Math.random().toFixed(2);
            let source = "HSC26 Bangla 1st paper, Page " + Math.floor(Math.random() * 50 + 1);
            
            if (message.includes('সুপুরুষ')) {
                responseText = 'শুম্ভুনাথ';
            } else if (message.includes('ভাগ্য দেবতা')) {
                responseText = 'মামাকে';
            } else if (message.includes('বয়স') || message.includes('age')) {
                responseText = '১৫ বছর';
            } else {
                responseText = langEnBtn.classList.contains('active') 
                    ? "I found this information in the text: [This would be the actual retrieved content in a real implementation]"
                    : "আমি পাঠ্যে এই তথ্য্যটি পেয়েছি: [এটি একটি বাস্তব বাস্তবায়নে প্রকৃত পুনরুদ্ধার করা বিষয়বস্তু হবে]";
            }

            // Add assistant message to chat
            addMessageToChat('assistant', responseText, confidence, source);
        }, 1500 + Math.random() * 2000); // Random delay between 1.5-3.5 seconds
    });

    // Helper functions
    function addMessageToChat(sender, message, confidence, source) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex justify-' + (sender === 'user' ? 'end' : 'start');
        
        const messageContent = `
            <div class="max-w-3xl w-full bg-${sender === 'user' ? 'black text-white' : 'white'} rounded-lg shadow-md p-4 border-l-4 border-${sender === 'user' ? 'gray-800' : 'red-600'}">
                <div class="flex items-start space-x-3">
                    ${sender === 'assistant' ? 
                        `<div class="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                            <i class="fas fa-robot"></i>
                        </div>` : 
                        `<div class="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center">
                            <i class="fas fa-user"></i>
                        </div>`}
                    <div class="flex-1">
                        <h3 class="font-bold text-${sender === 'user' ? 'white' : 'black'}">${sender === 'assistant' ? 'RAG Assistant' : 'You'}</h3>
                        <p class="text-${sender === 'user' ? 'white' : 'gray-700'}">${message}</p>
                        ${sender === 'assistant' ? `
                            <div class="mt-2 text-xs text-gray-500">
                                <div class="flex items-center space-x-2">
                                    <span class="font-medium">Confidence:</span>
                                    <div class="w-full bg-gray-200 rounded-full h-1.5">
                                        <div class="bg-red-600 h-1.5 rounded-full" style="width: ${confidence * 100}%"></div>
                                    </div>
                                    <span>${confidence}</span>
                                </div>
                                <div class="mt-1">
                                    <span class="font-medium">Source:</span> ${source}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        messageDiv.innerHTML = messageContent;
        chatContainer.appendChild(messageDiv);
        messageDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function showTypingIndicator() {
        const typingId = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.className = 'flex justify-start';
        typingDiv.id = typingId;
        
        typingDiv.innerHTML = `
            <div class="max-w-3xl w-full bg-white rounded-lg shadow-md p-4 border-l-4 border-red-600">
                <div class="flex items-start space-x-3">
                    <div class="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-black">RAG Assistant</h3>
                        <div class="flex space-x-1 mt-1">
                            <div class="typing-dot w-2 h-2 bg-gray-500 rounded-full"></div>
                            <div class="typing-dot w-2 h-2 bg-gray-500 rounded-full"></div>
                            <div class="typing-dot w-2 h-2 bg-gray-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        chatContainer.appendChild(typingDiv);
        typingDiv.scrollIntoView({ behavior: 'smooth' });
        return typingId;
    }

    function removeTypingIndicator(id) {
        const typingElement = document.getElementById(id);
        if (typingElement) {
            typingElement.remove();
        }
    }
});