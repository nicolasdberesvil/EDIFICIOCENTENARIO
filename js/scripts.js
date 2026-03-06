document.addEventListener("DOMContentLoaded", function () {

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
    if (countersContainer) observer.observe(countersContainer);

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
        if (document.getElementById('chat-options')) return;
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

    window.handleChatOption = function (option) {
        const optionsDiv = document.getElementById('chat-options');
        if (optionsDiv) optionsDiv.remove();
        const userMsg = document.createElement('div');
        userMsg.className = 'user-reply';
        userMsg.innerText = option === 'canje' ? "Plan Canje" : option === 'financiacion' ? "Financiación" : "Asesor";
        chatBody.appendChild(userMsg);

        setTimeout(() => {
            if (option === 'canje') {
                addBotMessage("El Plan Canje es ideal para productores. Aceptamos granos y leche directo con Cooperativa 8 de Septiembre y AUT.");
                // Mostrar imagen de canjes
                setTimeout(() => {
                    const div = document.createElement('div');
                    div.className = 'bot-message p-0 overflow-hidden';
                    div.innerHTML = `<img src="assets/img/canjes.png" class="img-fluid rounded" style="cursor:pointer" onclick="window.openGalleryModal(this.src)" alt="Plan Canje">`;
                    chatBody.appendChild(div);
                    chatBody.scrollTop = chatBody.scrollHeight;
                }, 1000);
            } else if (option === 'financiacion') {
                addBotMessage("Para conocer los detalles de financiación, por favor contacta a nuestro vendedor:");
                const div = document.createElement('div');
                div.className = 'd-grid gap-2 mt-2';
                div.innerHTML = `<button class="btn btn-success btn-sm" onclick="window.open('https://wa.me/5493425141860', '_blank')"><i class="bi bi-whatsapp"></i> Chat directo con el vendedor</button>`;
                chatBody.appendChild(div);
                chatBody.scrollTop = chatBody.scrollHeight;
            } else {
                addBotMessage("Te derivo a nuestro WhatsApp oficial.");
                setTimeout(() => window.open('https://wa.me/5493425141860', '_blank'), 1500);
            }
        }, 600);
    };

    // --- 3. FUNCIÓN GALERÍA MODAL ---
    window.openGalleryModal = function (imageSrc) {
        const modalElement = document.getElementById('galleryModal');
        const modalImg = document.getElementById('modalImage');
        const myModal = new bootstrap.Modal(modalElement);
        modalImg.src = imageSrc;
        myModal.show();
    };

    // --- 4. SISTEMA DE NOTICIAS (ADMIN & RENDER) ---

    // A. Renderizar noticias al cargar la página
    const newsContainer = document.getElementById('news-feed-container');
    const storedNews = JSON.parse(localStorage.getItem('centenarioNews')) || [];

    function renderNews() {
        if (!newsContainer) return;
        newsContainer.innerHTML = '';

        if (storedNews.length === 0) {
            newsContainer.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Próximamente novedades sobre el avance de obra.</p></div>';
            return;
        }

        // Ordenar: más recientes primero
        storedNews.slice().reverse().forEach(news => {
            const col = document.createElement('div');
            col.className = 'col-md-4';
            col.innerHTML = `
                <div class="card h-100 border-0 shadow-sm">
                    <div style="height: 200px; overflow: hidden;">
                        <img src="${news.image || 'assets/img/logoedificiocentenariosinfondo.png'}" class="card-img-top" alt="${news.title}" style="object-fit: cover; height: 100%; width: 100%;">
                    </div>
                    <div class="card-body">
                        <small class="text-muted">${news.date}</small>
                        <h5 class="card-title mt-2 text-teal fw-bold">${news.title}</h5>
                        <p class="card-text small text-muted">${news.body.substring(0, 100)}...</p>
                        <button class="btn btn-sm btn-outline-dark rounded-0" onclick="alert('${news.body.replace(/\n/g, '\\n')}')">Leer más</button>
                    </div>
                </div>
            `;
            newsContainer.appendChild(col);
        });
    }
    renderNews();

    // B. Funciones del Panel de Admin
    window.openAdminModal = function () {
        const modal = new bootstrap.Modal(document.getElementById('adminModal'));
        modal.show();
        // Verificar si ya está logueado en esta sesión
        if (sessionStorage.getItem('adminLogged') === 'true') {
            document.getElementById('admin-login-form').style.display = 'none';
            document.getElementById('admin-panel-content').style.display = 'block';
        }
    };

    window.checkLogin = function () {
        const user = document.getElementById('admin-user').value;
        const pass = document.getElementById('admin-pass').value;
        const errorMsg = document.getElementById('login-error');

        // CREDENCIALES SIMULADAS
        if (user === 'admin' && pass === 'centenario') {
            sessionStorage.setItem('adminLogged', 'true');
            document.getElementById('admin-login-form').style.display = 'none';
            document.getElementById('admin-panel-content').style.display = 'block';
            errorMsg.style.display = 'none';
            // Limpiar campos
            document.getElementById('admin-user').value = '';
            document.getElementById('admin-pass').value = '';
        } else {
            errorMsg.style.display = 'block';
        }
    };

    window.logoutAdmin = function () {
        sessionStorage.removeItem('adminLogged');
        document.getElementById('admin-panel-content').style.display = 'none';
        document.getElementById('admin-login-form').style.display = 'block';
    };

    window.postNews = function () {
        const title = document.getElementById('news-title').value;
        const body = document.getElementById('news-body').value;
        const fileInput = document.getElementById('news-image');

        if (!title || !body) {
            alert("Por favor completa el título y el cuerpo de la noticia.");
            return;
        }

        const saveNews = (imgBase64) => {
            const newPost = {
                id: Date.now(),
                title: title,
                body: body,
                image: imgBase64,
                date: new Date().toLocaleDateString()
            };
            storedNews.push(newPost);
            localStorage.setItem('centenarioNews', JSON.stringify(storedNews));
            alert("Noticia publicada con éxito.");
            renderNews(); // Actualizar vista
            // Limpiar form
            document.getElementById('news-title').value = '';
            document.getElementById('news-body').value = '';
            fileInput.value = '';
        };

        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                saveNews(e.target.result);
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            saveNews(''); // Guardar sin imagen si no se seleccionó
        }
    };
});