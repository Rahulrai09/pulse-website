const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

const newHtml = `<div class="pulse-chat-window" id="ai-chat-window">
  <div class="pulse-chat-header">
    <div class="pulse-chat-title">Pulse AI Assistant</div>
    <div class="pulse-chat-actions">
      <button id="chat-refresh-btn" title="Start new chat" style="background: none; border: none; color: #ffffff; font-size: 16px; cursor: pointer; margin-right: 8px; opacity: 0.8;">↺</button>
      <button id="ai-chat-close" aria-label="Close">✕</button>
    </div>
  </div>
  <div class="pulse-chat-body" id="ai-chat-body"></div>
  <div class="pulse-chat-input-area">
    <input type="text" id="ai-chat-input" placeholder="Type a message...">
    <button class="pulse-chat-send" id="ai-chat-send" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
  </div>
  <div class="pulse-chat-footer">Powered by Pulse AI</div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const chatBtn = document.getElementById('ai-chat-btn');
    const chatWindow = document.getElementById('ai-chat-window');
    const chatClose = document.getElementById('ai-chat-close');
    const chatRefresh = document.getElementById('chat-refresh-btn');
    const chatBody = document.getElementById('ai-chat-body');
    const chatInput = document.getElementById('ai-chat-input');
    const chatSend = document.getElementById('ai-chat-send');

    let chatStep = 0;
    let userData = { name: '', role: '', category: '', contact: '' };

    function startChatFlow() {
      chatStep = 0;
      userData = { name: '', role: '', category: '', contact: '' };
      chatBody.innerHTML = '';
      renderBotMessage(\`Hello! 👋 Welcome to Pulse Medical — India's integrated MedTech manufacturer. I'm here to help you find the right solution. May I know your name?\`, []);
    }

    function addMessage(text, sender) {
      const msgDiv = document.createElement('div');
      msgDiv.className = \`chat-msg \${sender}\`;
      msgDiv.textContent = text;
      chatBody.appendChild(msgDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function renderBotMessage(text, options = []) {
      addMessage(text, 'bot');
      if (options.length > 0) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'chat-quick-actions';
        options.forEach(opt => {
          const btn = document.createElement('button');
          btn.className = 'chat-quick-btn';
          btn.textContent = opt;
          btn.addEventListener('click', () => handleUserInput(opt));
          actionsDiv.appendChild(btn);
        });
        chatBody.appendChild(actionsDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    }

    function handleUserInput(text) {
      if (!text.trim()) return;
      addMessage(text, 'user');
      
      const existingActions = chatBody.querySelectorAll('.chat-quick-actions');
      existingActions.forEach(el => el.remove());

      setTimeout(() => {
        if (chatStep === 0) {
          userData.name = text;
          chatStep = 1;
          renderBotMessage(\`Nice to meet you, \${userData.name}! Are you a:\`, [
            "🏥 Hospital / Clinic",
            "🏭 Distributor / Dealer",
            "🔬 Research Institution",
            "👤 Individual Enquiry"
          ]);
        } else if (chatStep === 1) {
          userData.role = text;
          chatStep = 2;
          renderBotMessage("Which category are you interested in?", [
            "01 Critical Care",
            "02 Renal Care",
            "03 Cardiac Care",
            "04 Aesthetics",
            "05 Rehab & Therapy",
            "06 Hospital Setup"
          ]);
        } else if (chatStep === 2) {
          userData.category = text;
          chatStep = 3;
          renderBotMessage("Great choice! To connect you with our specialist, could you share your phone number or email?", []);
        } else if (chatStep === 3) {
          userData.contact = text;
          chatStep = 4;
          renderBotMessage(\`Thank you, \${userData.name}! Our \${userData.category} specialist will reach out within 24 hours. For urgent queries call 📞 +91 90711 01108 directly.\`, []);
        } else {
          renderBotMessage("Your request has been logged. For urgent queries call 📞 +91 90711 01108 directly.", []);
        }
      }, 600);
    }

    if (chatBtn && chatWindow) {
      chatBtn.addEventListener('click', () => { 
        chatWindow.classList.add('open'); 
        chatBtn.style.transform = 'scale(0)'; 
        setTimeout(() => chatBtn.style.display = 'none', 300);
        if (chatBody.innerHTML.trim() === '') {
          startChatFlow();
        }
      });
      
      const closeChat = () => { 
        chatWindow.classList.remove('open'); 
        chatBtn.style.display = 'flex'; 
        setTimeout(() => chatBtn.style.transform = 'scale(1)', 10); 
      };
      
      chatClose.addEventListener('click', closeChat);
      if (chatRefresh) chatRefresh.addEventListener('click', startChatFlow);

      chatSend.addEventListener('click', () => {
        handleUserInput(chatInput.value);
        chatInput.value = '';
      });
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleUserInput(chatInput.value);
          chatInput.value = '';
        }
      });
    }
  });
</script>`.split('\n');

const result = [...lines.slice(0, 3319), ...newHtml, ...lines.slice(3415)];
fs.writeFileSync('index.html', result.join('\n'));
console.log('done');
