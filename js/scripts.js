document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. ANIMACIÓN DE CONTADORES NUMÉRICOS ---
    const countersContainer = document.getElementById('counters-container');
    const counters = document.querySelectorAll('.counter');
    let started = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000;
                    const increment = target / (duration / 20);
                    let current = 0;
                    const updateCount = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            setTimeout(updateCount, 20);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });
                started = true;
            }
        });
    });
    if(countersContainer) observer.observe(countersContainer);

    // --- 2. CHATBOT ---
    const chatWidget = document.getElementById('chat-widget');
    const chatBody = document.getElementById('chat-body');

    function openChat() {
        if (chatWidget && chatWidget.style.display !== 'flex') {
            chatWidget.style.display = 'flex';
            if (chatBody.innerHTML.trim() === '' || chatBody.children.length === 0) {
                addBotMessage("¡Hola! 👋 Bienvenido a Edificio Centenario.");
                setTimeout(() => {
                    addBotMessage("¿Te gustaría conocer la Financiación o el Plan Canje de Cereales/Leche? 🌱");
                    addButtons();
                }, 1500);
            }
        }
    }
    setTimeout(openChat, 4000);

    function addBotMessage(text) {
        const div = document.createElement('div');
        div.className = 'bot-message';
        div.innerHTML = text; 
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function addButtons() {
        if(document.getElementById('chat-options')) return;
        const div = document.createElement('div');
        div.id = 'chat-options';
        div.className = 'd-grid gap-2 mt-2';
        div.innerHTML = `
            <button class="btn btn-sm btn-outline-secondary" onclick="handleChatOption('canje')">Plan Canje 🌾</button>
            <button class="btn btn-sm btn-outline-dark" onclick="handleChatOption('financiacion')">Financiación 💰</button>
            <button class="btn btn-sm btn-outline-primary" onclick="handleChatOption('asesor')">Hablar con Asesor 👤</button>
        `;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    window.handleChatOption = function(option) {
        const optionsDiv = document.getElementById('chat-options');
        if(optionsDiv) optionsDiv.remove();
        const userMsg = document.createElement('div');
        userMsg.className = 'user-reply';
        userMsg.innerText = option === 'canje' ? "Plan Canje" : option === 'financiacion' ? "Financiación" : "Asesor";
        chatBody.appendChild(userMsg);

        setTimeout(() => {
            if (option === 'canje') {
                addBotMessage("El Plan Canje es ideal para productores. Aceptamos granos y leche directo con Cooperativa 8 de Septiembre y AUT.");
            } else if (option === 'financiacion') {
                addBotMessage("Contamos con una financiación flexible de hasta 48 cuotas en pesos ajustables.");
            } else {
                addBotMessage("Te derivo a nuestro WhatsApp oficial.");
                setTimeout(() => window.open('https://wa.me/5493425450016', '_blank'), 1500);
                return;
            }
            setTimeout(() => {
                addBotMessage("¿Deseas descargar la ficha técnica?");
                const div = document.createElement('div');
                div.className = 'd-grid gap-2 mt-2';
                div.innerHTML = `<button class="btn btn-success btn-sm" onclick="window.open('https://wa.me/5493425450016', '_blank')"><i class="bi bi-whatsapp"></i> Chat en WhatsApp</button>`;
                chatBody.appendChild(div);
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 2000);
        }, 600);
    };

    // --- 3. FUNCIÓN GALERÍA MODAL ---
    window.openGalleryModal = function(imageSrc) {
        const modalElement = document.getElementById('galleryModal');
        const modalImg = document.getElementById('modalImage');
        const myModal = new bootstrap.Modal(modalElement);
        modalImg.src = imageSrc;
        myModal.show();
    };
});