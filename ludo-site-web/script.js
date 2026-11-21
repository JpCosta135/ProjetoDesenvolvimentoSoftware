// Espera o conteúdo da página carregar completamente antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // 1. Dados expandidos dos cards
    const sportsData = [
        { id: 1, title: 'Areninha Campo do América', category: 'Equipamento Público', description: 'Campo de futebol society e equipamentos de ginástica.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcZ1-GMvzb9R07Bttrh2jkkKPX23lr55EGrv7O1ugxZooJ8STw3DYAqkI&s=10' },
        { id: 2, title: 'Voleibol de Praia', category: 'Modalidade', description: 'Aulas e treinos na orla da Beira-Mar.', image: 'https://images.unsplash.com/photo-1634501087922-c01c76ed66d6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: 3, title: 'Jogos Escolares 2025', category: 'Evento', description: 'Competição anual entre escolas da rede municipal.', image: 'https://www.ceara.gov.br/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-11-at-12.04.00-scaled.jpeg?w=500' },
        { id: 4, title: 'Centro de Formação Olímpica', category: 'Equipamento Estadual', description: 'Complexo para atletas de alto rendimento e grandes eventos.', image: 'https://cfo.esporte.ce.gov.br/wp-content/uploads/2022/10/logo-cfo.png' },
        { id: 5, title: 'Futebol de Campo', category: 'Modalidade', description: 'Escolinhas e campeonatos em diversos bairros da cidade.', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500' },
        { id: 6, title: 'Basquete Comunitário', category: 'Modalidade', description: 'Programa de basquete para jovens e adultos.', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500' },
        { id: 7, title: 'Ginásio Poliesportivo Central', category: 'Equipamento Público', description: 'Espaço multiuso para diversas modalidades esportivas.', image: 'https://urbnews.com.br/wp-content/uploads/2024/09/Design-sem-nome-2024-09-14T164654.457_Easy-Resize.com_.jpg?w=500' },
        { id: 8, title: 'Corrida de Rua Fortaleza', category: 'Evento', description: 'Evento anual que reúne milhares de corredores.', image: 'https://images.unsplash.com/photo-1590333748338-d629e4564ad9?q=80&w=1849&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?=500' },
        { id: 9, title: 'Skate Park Beira-Mar', category: 'Equipamento Público', description: 'Evento anual que reúne milhares de corredores.', image: 'https://images.adsttc.com/media/images/6321/5925/34b7/7601/6e91/d31d/newsletter/skatepark-av-beira-mar-henry-teixeira-arquitetura-e-urbanismo_15.jpg?1663129923' },
    ];

    // 2. Variáveis globais
    const cardGrid = document.querySelector('.card-grid');
    let currentFilter = 'all';

    // 3. Função para criar e exibir os cards com filtro
    function displayCards(filter = 'all') {
        let filteredData = filter === 'all' ? sportsData : sportsData.filter(item => item.category === filter);
        
        let allCardsHTML = '';
        
        filteredData.forEach((item, index) => {
            const cardHTML = `
                <div class="info-card" style="animation-delay: ${index * 0.1}s">
                    <div class="card-image-container" style="background-image: url('${item.image}');">
                        <span class="card-category">${item.category}</span>
                    </div>
                    <div class="card-content">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                        <button class="card-button" onclick="showDetails(${item.id})">Ver Detalhes</button>
                    </div>
                </div>
            `;
            allCardsHTML += cardHTML;
        });
        
        cardGrid.innerHTML = allCardsHTML;
        
        // Animação de entrada
        setTimeout(() => {
            document.querySelectorAll('.info-card').forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, 100);
    }

    // 4. Sistema de filtros
    function setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove classe ativa de todos os botões
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Adiciona classe ativa ao botão clicado
                button.classList.add('active');
                
                // Obtém o filtro selecionado
                const filter = button.getAttribute('data-filter');
                currentFilter = filter;
                
                // Aplica o filtro
                displayCards(filter);
            });
        });
    }

    // 5. Animação das estatísticas
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalNumber = target.textContent;
                    const numericValue = parseInt(finalNumber.replace(/\D/g, ''));
                    
                    let current = 0;
                    const increment = numericValue / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= numericValue) {
                            target.textContent = finalNumber;
                            clearInterval(timer);
                        } else {
                            const suffix = finalNumber.includes('+') ? '+' : '';
                            const prefix = finalNumber.includes('k') ? 'k' : '';
                            target.textContent = Math.floor(current) + prefix + suffix;
                        }
                    }, 30);
                }
            });
        });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }

    // 6. Formulário de contato
    function setupContactForm() {
        const contactForm = document.querySelector('.contact-form');
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simula envio do formulário
            const button = contactForm.querySelector('button');
            const originalText = button.textContent;
            
            button.textContent = 'Enviando...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = 'Mensagem Enviada! ✓';
                button.style.background = 'var(--success-color)';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.background = '';
                    contactForm.reset();
                }, 2000);
            }, 1500);
        });
    }

    // 7. Sistema de filtros do mapa
    function setupMapFilters() {
        const mapFilterButtons = document.querySelectorAll('.map-filter-btn');
        const locationCards = document.querySelectorAll('.location-card');
        
        mapFilterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove classe ativa de todos os botões
                mapFilterButtons.forEach(btn => btn.classList.remove('active'));
                // Adiciona classe ativa ao botão clicado
                button.classList.add('active');
                
                const filterType = button.getAttribute('data-type');
                
                locationCards.forEach(card => {
                    if (filterType === 'todos' || card.getAttribute('data-type') === filterType) {
                        card.style.display = 'flex';
                        card.style.animation = 'fadeInUp 0.5s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 8. Inicialização
    displayCards();
    setupFilters();
    animateStats();
    setupContactForm();
    setupMapFilters();
});

// Funções globais para modal e detalhes
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    showLogin();
}

function closeModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    clearForms();
}

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    clearMessages();
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    clearMessages();
}

function clearForms() {
    document.querySelectorAll('.auth-form').forEach(form => form.reset());
    clearMessages();
}

function clearMessages() {
    document.querySelectorAll('.success-message, .error-message').forEach(msg => msg.remove());
}

function showMessage(container, message, type) {
    clearMessages();
    const messageDiv = document.createElement('div');
    messageDiv.className = type + '-message';
    messageDiv.textContent = message;
    container.insertBefore(messageDiv, container.querySelector('.auth-form'));
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simula validação
    if (email && password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('loggedUser', JSON.stringify(user));
            showMessage(document.getElementById('loginForm'), 'Login realizado com sucesso!', 'success');
            setTimeout(() => {
                closeModal();
                alert(`Bem-vindo, ${user.name}!`);
            }, 1500);
        } else {
            showMessage(document.getElementById('loginForm'), 'E-mail ou senha incorretos!', 'error');
        }
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showMessage(document.getElementById('registerForm'), 'As senhas não coincidem!', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === email)) {
        showMessage(document.getElementById('registerForm'), 'E-mail já cadastrado!', 'error');
        return;
    }
    
    users.push({ name, email, phone, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    showMessage(document.getElementById('registerForm'), 'Cadastro realizado com sucesso!', 'success');
    setTimeout(() => {
        showLogin();
    }, 1500);
}

function showDetails(id) {
    // Simula abertura de detalhes
    alert(`Detalhes do item ${id} - Em breve, esta funcionalidade abrirá uma página completa com informações detalhadas!`);
}

// Fecha modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Navegação suave
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});