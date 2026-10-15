// PULSE AI Chatbot widget logic — shared across every page
// Depends on: window.PULSE_CATEGORY_PRODUCTS (js/header.js), window.PulseFAQSearch (js/faq-search.js), window.PulsePublic.submitChat (js/pulse-forms.js), window.fbq (js/footer.js), window.openCareerModal (js/footer.js)
  document.addEventListener('DOMContentLoaded', () => {
    const chatBtn = document.getElementById('ai-chat-btn');
    const chatWindow = document.getElementById('ai-chat-window');
    const chatClose = document.getElementById('ai-chat-close');
    const chatRefresh = document.getElementById('chat-refresh-btn');
    const chatMinimize = document.getElementById('chat-minimize-btn');
    const chatExpand = document.getElementById('chat-expand-btn');
    const chatBody = document.getElementById('ai-chat-body');
    const chatInput = document.getElementById('ai-chat-input');
    const chatSend = document.getElementById('ai-chat-send');

    let chatStep = 0;
    let userData = { name: '', role: '', category: '', contact: '', firstMessage: '' };
    let chatTranscript = [];

    function looksLikeQuestion(text) {
      const t = text.trim();
      if (t.length > 300) return false;
      if (/\?\s*$/.test(t)) return true;
      const starters = ['what','how','where','when','why','is','are','do','does','can','could','should','will','which','who','tell','explain'];
      const firstWord = t.toLowerCase().split(/\s+/)[0].replace(/[^a-z]/g, '');
      if (starters.indexOf(firstWord) !== -1) return true;
      if (t.split(/\s+/).length >= 5) return true;
      return false;
    }

    function renderLearnMoreLink(url) {
      if (!url) return;
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'chat-quick-actions';
      const link = document.createElement('a');
      link.className = 'chat-quick-btn';
      link.textContent = 'Learn more \u2192';
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.textDecoration = 'none';
      link.style.display = 'inline-block';
      actionsDiv.appendChild(link);
      chatBody.appendChild(actionsDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function answerFromFAQ(queryText) {
      const results = (window.PulseFAQSearch && window.PulseFAQSearch.search) ? window.PulseFAQSearch.search(queryText, 1) : [];
      if (results.length && results[0].score >= window.PulseFAQSearch.THRESHOLD) {
        const entry = results[0].entry;
        renderBotMessage(entry.a, []);
        renderLearnMoreLink(entry.u);
        return true;
      }
      renderBotMessage("I don't have a specific answer for that yet, but I'll make sure our specialist covers it when they reach out.", []);
      return false;
    }

    function renderContactFormCard() {
      const card = document.createElement('div');
      card.className = 'chat-form-card';
      card.id = 'chat-contact-form-card';
      card.innerHTML = `
        <div class="chat-form-title">Please share your details</div>
        <div class="chat-form-row active" data-field="phone">
          <span class="chat-form-label">Mobile Number (1 of 2) *</span>
          <span class="chat-form-value"></span>
        </div>
        <div class="chat-form-row" data-field="email">
          <span class="chat-form-label">Email ID (2 of 2) *</span>
          <span class="chat-form-value"></span>
        </div>
      `;
      chatBody.appendChild(card);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function markContactFormField(fieldKey, displayValue) {
      const card = document.getElementById('chat-contact-form-card');
      if (!card) return;
      const row = card.querySelector('.chat-form-row[data-field="' + fieldKey + '"]');
      if (row) {
        row.classList.remove('active');
        row.classList.add('done');
        const valueSpan = row.querySelector('.chat-form-value');
        if (valueSpan) valueSpan.textContent = displayValue + ' ✓';
      }
      const rows = card.querySelectorAll('.chat-form-row');
      for (const r of rows) {
        if (r.classList.contains('done')) continue;
        r.classList.add('active');
        break;
      }
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function renderAnythingElse() {
      chatStep = 6;
      renderBotMessage("Is there anything else I can help you with?", [
        "More Questions",
        "Request a Callback",
        "No, thank you"
      ]);
    }

    function startChatFlow() {
      chatStep = -1;
      userData = { name: '', role: '', category: '', contact: '', firstMessage: '', phone: '', email: '', issue: '' };
      chatTranscript = [];
      chatBody.innerHTML = '';
      chatWindow.classList.remove('minimized');
      renderBotMessage(`Hello! 👋 Welcome to PULSE — India's integrated MedTech manufacturer.`, []);
      renderBotMessage("How may I help you today?", [
        "Products",
        "Service Enquiry",
        "Request a Callback",
        "Careers",
        "Chat with a Specialist"
      ]);
    }

    function formatChatTimestamp(date) {
      const d = String(date.getDate()).padStart(2, '0');
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const y = date.getFullYear();
      let h = date.getHours();
      const min = String(date.getMinutes()).padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12; if (h === 0) h = 12;
      return `${d}-${m}-${y} ${h}:${min} ${ampm}`;
    }

    function addMessage(text, sender) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-msg ${sender}`;
      msgDiv.textContent = text;
      chatBody.appendChild(msgDiv);

      const timeDiv = document.createElement('div');
      timeDiv.className = `chat-msg-time ${sender}`;
      timeDiv.textContent = formatChatTimestamp(new Date());
      chatBody.appendChild(timeDiv);

      chatBody.scrollTop = chatBody.scrollHeight;
      chatTranscript.push((sender === 'bot' ? 'Bot: ' : 'You: ') + text);
    }

    function renderProductCardList(products) {
      if (!products || !products.length) return;
      const cardsDiv = document.createElement('div');
      cardsDiv.className = 'chat-product-cards';
      products.forEach(p => {
        const card = document.createElement('a');
        card.className = 'chat-product-card';
        card.href = p.href;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        const img = document.createElement('img');
        img.src = p.image;
        img.alt = p.name;
        img.loading = 'lazy';
        const nameDiv = document.createElement('div');
        nameDiv.className = 'cpc-name';
        nameDiv.textContent = p.name;
        card.appendChild(img);
        card.appendChild(nameDiv);
        cardsDiv.appendChild(card);
      });
      chatBody.appendChild(cardsDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function renderProductSuggestions(categoryText) {
      if (!window.PULSE_CATEGORY_PRODUCTS) return;
      const key = categoryText.trim().replace(/^\d+\s*/, '');
      const data = window.PULSE_CATEGORY_PRODUCTS[key];
      if (!data || !data.products || !data.products.length) return;
      renderProductCardList(data.products.slice(0, 3));
    }

    let __allProductsFlatCache = null;
    function getAllProductsFlat() {
      if (__allProductsFlatCache) return __allProductsFlatCache;
      const out = [];
      if (window.PULSE_CATEGORY_PRODUCTS) {
        Object.keys(window.PULSE_CATEGORY_PRODUCTS).forEach(catKey => {
          const cat = window.PULSE_CATEGORY_PRODUCTS[catKey];
          (cat.products || []).forEach(p => {
            out.push({ name: p.name, image: p.image, href: p.href, category: catKey });
          });
        });
      }
      __allProductsFlatCache = out;
      return out;
    }

    function searchProducts(query, topK) {
      const q = query.trim().toLowerCase();
      if (q.length < 2) return [];
      const all = getAllProductsFlat();
      const scored = [];
      all.forEach(p => {
        const nameLower = p.name.toLowerCase();
        let score = 0;
        if (nameLower === q) score = 100;
        else if (nameLower.startsWith(q)) score = 50;
        else if (nameLower.includes(q)) score = 20;
        else {
          const qWords = q.split(/\s+/).filter(w => w.length > 2);
          const matchedWords = qWords.filter(w => nameLower.includes(w));
          if (qWords.length && matchedWords.length === qWords.length) score = 10;
        }
        if (score > 0) scored.push({ score, product: p });
      });
      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, topK || 5).map(s => s.product);
    }

    function renderCategoryButtons(introText) {
      addMessage(introText, 'bot');
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'chat-quick-actions';
      const categories = ["01 Critical Care","02 Renal Care","03 Cardiac Care","04 Aesthetics","05 Rehabilitation","06 Hospital Setup","07 Surgical"];
      categories.forEach(catLabel => {
        const key = catLabel.replace(/^\d+\s*/, '');
        const data = window.PULSE_CATEGORY_PRODUCTS && window.PULSE_CATEGORY_PRODUCTS[key];
        const products = (data && data.products) || [];
        const btn = document.createElement('button');
        btn.className = 'chat-quick-btn chat-category-btn';
        const titleSpan = document.createElement('span');
        titleSpan.className = 'cat-btn-title';
        titleSpan.textContent = catLabel;
        btn.appendChild(titleSpan);
        if (products.length) {
          const exampleNames = products.slice(0, 2).map(p => p.name).join(', ');
          const extra = products.length > 2 ? (', +' + (products.length - 2) + ' more') : '';
          const subSpan = document.createElement('span');
          subSpan.className = 'cat-btn-sub';
          subSpan.textContent = exampleNames + extra;
          btn.appendChild(subSpan);
        }
        btn.addEventListener('click', () => handleUserInput(catLabel));
        actionsDiv.appendChild(btn);
      });
      const browseBtn = document.createElement('button');
      browseBtn.className = 'chat-quick-btn chat-category-btn chat-browse-all-btn';
      const bTitle = document.createElement('span');
      bTitle.className = 'cat-btn-title';
      bTitle.textContent = '\u{1F50D} Browse All Products';
      const bSub = document.createElement('span');
      bSub.className = 'cat-btn-sub';
      bSub.textContent = 'See every product, every category';
      browseBtn.appendChild(bTitle);
      browseBtn.appendChild(bSub);
      browseBtn.addEventListener('click', () => handleUserInput('Browse All Products'));
      actionsDiv.appendChild(browseBtn);
      chatBody.appendChild(actionsDiv);
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
        if (chatStep === -1) {
          userData.firstMessage = text;
          if (text === "Products") {
            chatStep = 0.5;
            renderBotMessage('Great! Could you please tell me your name?', []);
            return;
          }
          if (text === "Service Enquiry") {
            chatStep = 9;
            renderBotMessage("Sure — what issue are you facing? (e.g. equipment not working, need a spare part, AMC query)", []);
            return;
          }
          if (text === "Request a Callback") {
            userData.category = "Callback Request";
            chatStep = 10;
            renderBotMessage("Sure! Could you tell me your name?", []);
            return;
          }
          if (text === "Careers") {
            renderBotMessage("Opening our Careers application form for you — you're welcome to keep chatting here too.", []);
            if (typeof window.openCareerModal === 'function') window.openCareerModal();
            setTimeout(() => { renderAnythingElse(); }, 700);
            return;
          }
          if (text === "Chat with a Specialist") {
            renderBotMessage("You can reach a PULSE specialist directly at +91 90711 01108 (call or WhatsApp) — our team typically responds within a few hours.", []);
            setTimeout(() => { renderAnythingElse(); }, 700);
            return;
          }
          // Free text instead of a menu click: fall through to original first-message handling
          const greetings = ["hi","hii","hiii","hiiii","hello","helo","hey","heyy","heya","hola","yo","namaste","good morning","good afternoon","good evening"];
          const normalized = text.trim().toLowerCase().replace(/[!.,]+$/, "");
          if (greetings.indexOf(normalized) !== -1) {
            userData.name = '';
            chatStep = 0.5;
            renderBotMessage('Hi! How can I assist you? Could you please tell me your name?', []);
            return;
          }
          if (looksLikeQuestion(text)) {
            const answered = answerFromFAQ(text);
            chatStep = 0.5;
            setTimeout(() => {
              const followUp = answered
                ? "I hope that helps! I'm here to connect you with a PULSE specialist too — could you tell me your name?"
                : "No problem — I'll pass that along. In the meantime, could you tell me your name so I can connect you with a PULSE specialist?";
              renderBotMessage(followUp, []);
            }, 700);
            return;
          }
          const properName0 = text.trim().split(/\s+/).map(function(w){ return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }).join(' ');
          userData.name = properName0;
          chatStep = 1;
          renderBotMessage('Hi ' + properName0 + '! How can I assist you? Are you a:', [
            "🏥 Hospital / Clinic",
            "🏭 Distributor / Dealer",
            "🔬 Research Institution",
            "👤 Individual Enquiry"
          ]);
        } else if (chatStep === 9) {
          userData.issue = text;
          chatStep = 10;
          renderBotMessage("Got it. Could you tell me your name?", []);
        } else if (chatStep === 10) {
          const properNameSvc = text.trim().split(/\s+/).map(function(w){ return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }).join(' ');
          userData.name = properNameSvc;
          chatStep = 11;
          renderBotMessage('Thanks, ' + properNameSvc + '! Could you share your phone number so our team can reach you?', []);
        } else if (chatStep === 11) {
          const phoneRegex11 = /^[6-9]\d{9}$/;
          const cleanPhone11 = text.trim().replace(/\s+/g, "");
          if (!phoneRegex11.test(cleanPhone11)) {
            renderBotMessage("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).", []);
            return;
          }
          userData.phone = cleanPhone11;
          if (window.PulsePublic && window.PulsePublic.submitChat) {
            window.PulsePublic.submitChat({
              firstMessage: userData.firstMessage,
              name: userData.name,
              phone: userData.phone,
              email: userData.email || '',
              userType: userData.role || '',
              category: userData.category || 'Service Enquiry',
              message: (userData.issue ? ('Issue: ' + userData.issue + ' || ') : '') + chatTranscript.join(' || ')
            }).catch(err => console.error("[chat] Lead submission failed:", err));
          }
          renderBotMessage(`Thank you, ${userData.name}! Our team will call you on ${userData.phone} within 24 hours. For urgent queries call +91 90711 01108 directly.`, []);
          setTimeout(() => { renderAnythingElse(); }, 900);
        } else if (chatStep === 0.5) {
          const properName2 = text.trim().split(/\s+/).map(function(w){ return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }).join(' ');
          userData.name = properName2;
          chatStep = 1;
          renderBotMessage('Nice to meet you, ' + properName2 + '! Are you a:', [
            "\u{1F3E5} Hospital / Clinic",
            "\u{1F3ED} Distributor / Dealer",
            "\u{1F52C} Research Institution",
            "\u{1F464} Individual Enquiry"
          ]);
        } else if (chatStep === 1) {
          userData.role = text;
          chatStep = 2;
          renderCategoryButtons("Which category are you interested in? Each one shows a couple of example products below it — or just type a product name to search (e.g. \"wheelchair\" or \"ventilator\").");
        } else if (chatStep === 2) {
          const knownCategories = ["01 Critical Care","02 Renal Care","03 Cardiac Care","04 Aesthetics","05 Rehabilitation","06 Hospital Setup","07 Surgical"];
          if (text === "Browse All Products") {
            renderBotMessage("Here's our full product range — tap any card to view details:", []);
            renderProductCardList(getAllProductsFlat());
            setTimeout(() => {
              renderCategoryButtons("Or pick a category to narrow it down:");
            }, 700);
            return;
          }
          if (knownCategories.indexOf(text) === -1) {
            // Not a category button click: treat as a product search query
            const matches = searchProducts(text, 5);
            if (!matches.length) {
              renderCategoryButtons("I couldn't find a product matching \"" + text + "\" — please pick a category below, or try a different product name:");
              return;
            }
            userData.category = matches[0].category;
            chatStep = 3;
            renderBotMessage('Here’s what I found for "' + text + '":', []);
            renderProductCardList(matches);
            setTimeout(() => {
              renderBotMessage("To connect you with our specialist, please share your details:", []);
              renderContactFormCard();
            }, 900);
            return;
          }
          userData.category = text;
          chatStep = 3;
          renderBotMessage("Great choice! Here are a few options in that category:", []);
          renderProductSuggestions(text);
          setTimeout(() => {
            renderBotMessage("To connect you with our specialist, please share your details:", []);
            renderContactFormCard();
          }, 900);
        } else if (chatStep === 3) {
          // Validate 10-digit phone number
          const phoneRegex = /^[6-9]\d{9}$/;
          const cleanPhone = text.trim().replace(/\s+/g, "");
          if (!phoneRegex.test(cleanPhone)) {
            renderBotMessage("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).", []);
            return;
          }
          userData.phone = cleanPhone;
          chatStep = 4;
          markContactFormField('phone', cleanPhone);
          renderBotMessage("Thank you! Could you also share your email address?", []);
        } else if (chatStep === 4) {
          userData.email = text.trim();
          chatStep = 5;
          markContactFormField('email', userData.email);
          // Submit chat lead to Google Sheets
          if (window.PulsePublic && window.PulsePublic.submitChat) {
            window.PulsePublic.submitChat({
              firstMessage: userData.firstMessage,
              name: userData.name,
              phone: userData.phone,
              email: userData.email,
              userType: userData.role,
              category: userData.category.replace(/^\d+\s*/, ""),
              message: chatTranscript.join(' || ')
            }).catch(err => console.error("[chat] Lead submission failed:", err));
          }
          // Meta Pixel: Advanced Matching + Lead event, now that we have real contact details
          if (window.fbq) {
            window.fbq('init', '3413725288776120', {
              ph: '91' + userData.phone,
              em: userData.email.trim().toLowerCase()
            });
            window.fbq('track', 'Lead');
          }
          renderBotMessage(`Thank you! Our ${userData.category.replace(/^\d+\s*/, "").replace(/\s*Care$/i, "")} Care expert will reach out within 24 hours. For urgent queries call +91 90711 01108 directly.`, []);
          setTimeout(() => { renderAnythingElse(); }, 900);
        } else if (chatStep === 5) {
          answerFromFAQ(text);
          setTimeout(() => { renderAnythingElse(); }, 700);
        } else if (chatStep === 6) {
          if (text === "More Questions") {
            renderBotMessage("Sure! What would you like to know?", []);
            chatStep = 5;
          } else if (text === "Request a Callback") {
            renderBotMessage(`Noted! Our specialist will call you on ${userData.phone || 'the number you shared'} within 24 hours.`, []);
            setTimeout(() => { renderAnythingElse(); }, 700);
          } else if (text === "No, thank you") {
            renderBotMessage("Thanks for chatting with PULSE! Feel free to reach out anytime \u{1F44B}", []);
          } else {
            answerFromFAQ(text);
            setTimeout(() => { renderAnythingElse(); }, 700);
          }
        }
      }, 600);
    }

    if (chatBtn && chatWindow) {
      chatBtn.addEventListener('click', () => { 
        chatWindow.classList.add('open'); 
        chatBtn.style.transform = 'scale(0)'; 
        var hiBubble = document.getElementById('chat-hi-bubble');
        if (hiBubble) hiBubble.classList.add('hidden');
        setTimeout(() => chatBtn.style.display = 'none', 300);
        if (chatBody.innerHTML.trim() === '') {
          startChatFlow();
        }
      });

      // Auto-open AI chat widget after 1 second
      setTimeout(function() {
        if (window.innerWidth <= 767) {
          // On mobile: show sliding welcome pill instead of full chat
          var pill = document.getElementById('chat-welcome-pill');
          var hiBubbleMob = document.getElementById('chat-hi-bubble');
          if (pill) {
            // Hide Hi bubble, show pill
            if (hiBubbleMob) hiBubbleMob.classList.add('hidden');
            pill.classList.add('show');
            // After 5s hide pill, show Hi bubble again
            setTimeout(function() {
              pill.classList.remove('show');
              if (hiBubbleMob) hiBubbleMob.classList.remove('hidden');
            }, 5000);
            pill.addEventListener('click', function() {
              pill.classList.remove('show');
              if (hiBubbleMob) hiBubbleMob.classList.add('hidden');
              if (chatBtn && !chatWindow.classList.contains('open')) {
                chatBtn.click();
              }
            });
          }
        } else {
          // On desktop: open chat normally
          if (chatBtn && !chatWindow.classList.contains('open')) {
            chatBtn.click();
          }
        }
      }, 1000);
      
      const closeChat = () => { 
        chatWindow.classList.remove('open'); 
        chatBtn.style.display = 'flex'; 
        setTimeout(() => chatBtn.style.transform = 'scale(1)', 10);
        var hiBubble = document.getElementById('chat-hi-bubble');
        if (hiBubble) hiBubble.classList.remove('hidden');
      };
      
      chatClose.addEventListener('click', closeChat);
      if (chatRefresh) chatRefresh.addEventListener('click', startChatFlow);

      if (chatMinimize) {
        chatMinimize.addEventListener('click', () => {
          chatWindow.classList.toggle('minimized');
          const isMin = chatWindow.classList.contains('minimized');
          chatMinimize.title = isMin ? 'Restore chat' : 'Minimize chat';
          chatMinimize.setAttribute('aria-label', isMin ? 'Restore' : 'Minimize');
        });
      }

      if (chatExpand) {
        chatExpand.addEventListener('click', () => {
          chatWindow.classList.remove('minimized');
          chatWindow.classList.toggle('expanded');
          const isExp = chatWindow.classList.contains('expanded');
          chatExpand.textContent = isExp ? '⤡' : '⤢';
          chatExpand.title = isExp ? 'Collapse chat' : 'Expand chat';
          chatExpand.setAttribute('aria-label', isExp ? 'Collapse' : 'Expand');
        });
      }

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
