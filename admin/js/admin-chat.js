// Pulse Admin Chat Panel
(function() {
  // Inject chat button + panel into sidebar
  const style = document.createElement('style');
  style.textContent = `
    .adm-chat-btn {
      color: rgba(255,255,255,0.55);
      cursor: pointer;
      transition: all 0.2s; border: none; background: none;
      font-family: inherit;
      width: 40px !important;
      height: 40px !important;
      padding: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin: 4px auto !important;
      border-radius: 10px !important;
    }
    .adm-chat-btn:hover { background: rgba(232,119,34,0.1); color: #fff; }
    .adm-chat-btn.open { background: #E87722; color: #fff; }

    .adm-chat-panel {
      position: fixed; bottom: 24px; left: 240px;
      width: 340px; height: 480px;
      background: #0f1e3d; border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      display: flex; flex-direction: column; z-index: 9999;
      transform: translateY(20px); opacity: 0; pointer-events: none;
      transition: all 0.3s ease;
    }
    .adm-chat-panel.open { transform: translateY(0); opacity: 1; pointer-events: all; }
    .adm-chat-header {
      background: #E87722; padding: 14px 16px;
      border-radius: 14px 14px 0 0;
      display: flex; justify-content: space-between; align-items: center;
    }
    .adm-chat-header-title { font-weight: 700; color: #fff; font-size: 0.92rem; display: flex; align-items: center; gap: 8px; }
    .adm-chat-header-title::before { content: ''; width: 8px; height: 8px; background: #fff; border-radius: 50%; display: inline-block; animation: pulse-dot 1.5s infinite; }
    @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .adm-chat-close { background: none; border: none; color: #fff; cursor: pointer; font-size: 1.1rem; opacity: 0.8; }
    .adm-chat-close:hover { opacity: 1; }
    .adm-chat-messages {
      flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px;
    }
    .adm-chat-messages::-webkit-scrollbar { width: 4px; }
    .adm-chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    .adm-msg { max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 0.83rem; line-height: 1.5; }
    .adm-msg.bot { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.85); border-bottom-left-radius: 3px; align-self: flex-start; }
    .adm-msg.user { background: #E87722; color: #fff; border-bottom-right-radius: 3px; align-self: flex-end; }
    .adm-chat-quick { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 12px; }
    .adm-chat-quick button {
      background: rgba(232,119,34,0.15); border: 1px solid rgba(232,119,34,0.3);
      color: #ffb780; padding: 5px 10px; border-radius: 14px; font-size: 0.75rem;
      font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit;
    }
    .adm-chat-quick button:hover { background: #E87722; color: #fff; border-color: #E87722; }
    .adm-chat-input-area {
      padding: 12px; border-top: 1px solid rgba(255,255,255,0.07);
      display: flex; gap: 8px; align-items: center;
    }
    .adm-chat-input {
      flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px; padding: 9px 14px; color: #fff; font-size: 0.83rem; font-family: inherit;
    }
    .adm-chat-input:focus { outline: none; border-color: #E87722; }
    .adm-chat-input::placeholder { color: rgba(255,255,255,0.3); }
    .adm-chat-send {
      width: 34px; height: 34px; border-radius: 50%; background: #E87722;
      border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.2s;
    }
    .adm-chat-send:hover { background: #d06a1a; }
    .adm-chat-footer { text-align: center; font-size: 0.62rem; color: rgba(255,255,255,0.2); padding: 0 0 10px; }
  `;
  document.head.appendChild(style);

  // Find sidebar and inject chat button (prioritizing sidebars/asides)
  const injectChat = () => {
    const sidebar = document.querySelector('.icon-rail');
    if (!sidebar) { setTimeout(injectChat, 500); return; }

    const chatBtn = document.createElement('button');
    chatBtn.className = 'adm-chat-btn';
    chatBtn.title = 'Pulse AI Chat';
    chatBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
    sidebar.appendChild(chatBtn);

    // Chat panel
    const panel = document.createElement('div');
    panel.className = 'adm-chat-panel';
    panel.id = 'admChatPanel';
    panel.innerHTML = `
      <div class="adm-chat-header">
        <div class="adm-chat-header-title">Pulse AI Assistant</div>
        <button class="adm-chat-close" id="admChatClose">✕</button>
      </div>
      <div class="adm-chat-messages" id="admChatMessages">
        <div class="adm-msg bot">Hello 👋 I'm your Pulse Admin assistant. Ask me about submissions, leads, or site status.</div>
      </div>
      <div class="adm-chat-quick" id="admChatQuick">
        <button>📋 New submissions</button>
        <button>📊 Today's stats</button>
        <button>📝 Latest blog</button>
        <button>🔔 Pending replies</button>
      </div>
      <div class="adm-chat-input-area">
        <input type="text" class="adm-chat-input" id="admChatInput" placeholder="Ask anything…">
        <button class="adm-chat-send" id="admChatSend">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
      <div class="adm-chat-footer">Powered by Pulse AI</div>
    `;
    document.body.appendChild(panel);

    // Toggle
    chatBtn.addEventListener('click', () => {
      panel.classList.toggle('open');
      chatBtn.classList.toggle('open');
    });
    document.getElementById('admChatClose').addEventListener('click', () => {
      panel.classList.remove('open');
      chatBtn.classList.remove('open');
    });

    // Quick action responses
    const quickReplies = {
      '📋 New submissions': 'Checking submissions… tap "View Inbox" to see all new enquiries from your website.',
      '📊 Today\'s stats': 'Fetching today\'s data from your dashboard stats panel.',
      '📝 Latest blog': 'You can manage blog posts from the Blog Posts section in the sidebar.',
      '🔔 Pending replies': 'Go to Form Submissions → filter by "New" to see all pending replies.'
    };

    document.getElementById('admChatQuick').querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        addMsg(btn.textContent, 'user');
        document.getElementById('admChatQuick').style.display = 'none';
        setTimeout(() => addMsg(quickReplies[btn.textContent] || 'Let me check that for you.', 'bot'), 600);
      });
    });

    // Send message → Anthropic API
    const sendMsg = async () => {
      const input = document.getElementById('admChatInput');
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      addMsg(text, 'user');
      document.getElementById('admChatQuick').style.display = 'none';
      const thinking = addMsg('…', 'bot');
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 300,
            system: 'You are the Pulse Admin AI assistant. Pulse is an Indian medical equipment manufacturer. You help admin users with questions about their dashboard, form submissions, leads, blog posts, and website content. Keep answers brief and actionable.',
            messages: [{ role: 'user', content: text }]
          })
        });
        const data = await res.json();
        thinking.textContent = data.content?.[0]?.text || 'Sorry, I couldn\'t get a response.';
      } catch {
        thinking.textContent = 'Network error. Please check your connection.';
      }
      scrollChat();
    };

    document.getElementById('admChatSend').addEventListener('click', sendMsg);
    document.getElementById('admChatInput').addEventListener('keypress', e => { if (e.key === 'Enter') sendMsg(); });
  };

  function addMsg(text, type) {
    const msgs = document.getElementById('admChatMessages');
    const div = document.createElement('div');
    div.className = `adm-msg ${type}`;
    div.textContent = text;
    msgs.appendChild(div);
    scrollChat();
    return div;
  }

  function scrollChat() {
    const msgs = document.getElementById('admChatMessages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectChat);
  else injectChat();
})();
