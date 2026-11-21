// Variáveis globais
let currentUser = null;
let currentTeamId = null;
let teams = [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin();
    loadTeams();
    setupEventListeners();
});

// Verificar se usuário está logado
function checkUserLogin() {
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
        currentUser = JSON.parse(loggedUser);
        showMainContent();
    } else {
        showLoginPrompt();
    }
}

// Mostrar conteúdo principal
function showMainContent() {
    document.getElementById('loginPrompt').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('userInfo').style.display = 'flex';
    document.getElementById('welcomeMessage').textContent = `Bem-vindo, ${currentUser.name}!`;
    renderTeams();
}

// Mostrar prompt de login
function showLoginPrompt() {
    document.getElementById('loginPrompt').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
}

// Configurar event listeners
function setupEventListeners() {
    // Formulário de criação de time
    document.getElementById('teamForm').addEventListener('submit', handleCreateTeam);
    
    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
}

// Carregar times do localStorage
function loadTeams() {
    const savedTeams = localStorage.getItem('teams');
    teams = savedTeams ? JSON.parse(savedTeams) : [];
}

// Salvar times no localStorage
function saveTeams() {
    localStorage.setItem('teams', JSON.stringify(teams));
}

// Criar novo time
function handleCreateTeam(event) {
    event.preventDefault();
    
    if (!currentUser) {
        alert('Você precisa estar logado para criar um time!');
        return;
    }
    
    const teamData = {
        id: Date.now(),
        name: document.getElementById('teamName').value,
        sport: document.getElementById('teamSport').value,
        category: document.getElementById('teamCategory').value,
        maxPlayers: parseInt(document.getElementById('maxPlayers').value),
        description: document.getElementById('teamDescription').value,
        owner: currentUser.email,
        ownerName: currentUser.name,
        players: [],
        createdAt: new Date().toISOString()
    };
    
    teams.push(teamData);
    saveTeams();
    renderTeams();
    
    // Limpar formulário
    document.getElementById('teamForm').reset();
    
    // Mostrar mensagem de sucesso
    showSuccessMessage('Time criado com sucesso!');
}

// Renderizar times
function renderTeams(filter = 'todos') {
    const teamsGrid = document.getElementById('teamsGrid');
    
    if (!currentUser) {
        teamsGrid.innerHTML = '<div class="empty-state"><h3>Faça login para ver seus times</h3></div>';
        return;
    }
    
    // Filtrar times do usuário atual
    let userTeams = teams.filter(team => team.owner === currentUser.email);
    
    // Aplicar filtro de modalidade
    if (filter !== 'todos') {
        if (filter === 'outros') {
            userTeams = userTeams.filter(team => 
                !['futebol', 'basquete', 'volei'].includes(team.sport)
            );
        } else {
            userTeams = userTeams.filter(team => team.sport === filter);
        }
    }
    
    if (userTeams.length === 0) {
        teamsGrid.innerHTML = `
            <div class="empty-state">
                <h3>📋 Nenhum time encontrado</h3>
                <p>Crie seu primeiro time usando o formulário acima!</p>
            </div>
        `;
        return;
    }
    
    teamsGrid.innerHTML = userTeams.map(team => `
        <div class="team-card" data-sport="${team.sport}">
            <div class="team-header">
                <h3 class="team-name">${team.name}</h3>
                <span class="team-sport">${getSportIcon(team.sport)} ${getSportName(team.sport)}</span>
            </div>
            <div class="team-info">
                <p><strong>Categoria:</strong> ${team.category}</p>
                <p><strong>Jogadores:</strong> ${team.players.length}/${team.maxPlayers}</p>
                <p><strong>Criado em:</strong> ${formatDate(team.createdAt)}</p>
            </div>
            ${team.description ? `<div class="team-description">${team.description}</div>` : ''}
            <div class="team-actions">
                <button class="action-btn manage-btn" onclick="openPlayersModal(${team.id})">
                    👥 Gerenciar Jogadores
                </button>
                <button class="action-btn delete-btn" onclick="deleteTeam(${team.id})">
                    🗑️ Excluir
                </button>
            </div>
        </div>
    `).join('');
}

// Filtrar times
function handleFilter(event) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const filter = event.target.getAttribute('data-filter');
    renderTeams(filter);
}

// Abrir modal de jogadores
function openPlayersModal(teamId) {
    currentTeamId = teamId;
    const team = teams.find(t => t.id === teamId);
    
    if (!team) return;
    
    document.getElementById('playersModal').style.display = 'block';
    renderPlayersList(team);
}

// Fechar modal de jogadores
function closePlayersModal() {
    document.getElementById('playersModal').style.display = 'none';
    currentTeamId = null;
    document.getElementById('playerName').value = '';
    document.getElementById('playerPosition').value = '';
}

// Renderizar lista de jogadores
function renderPlayersList(team) {
    const playersList = document.getElementById('playersList');
    
    if (team.players.length === 0) {
        playersList.innerHTML = '<p style="text-align: center; color: #64748b;">Nenhum jogador cadastrado</p>';
        return;
    }
    
    playersList.innerHTML = team.players.map((player, index) => `
        <div class="player-item">
            <div class="player-info">
                <div class="player-name">${player.name}</div>
                <div class="player-position">${player.position}</div>
            </div>
            <button class="remove-player-btn" onclick="removePlayer(${index})">
                Remover
            </button>
        </div>
    `).join('');
}

// Adicionar jogador
function addPlayer() {
    const playerName = document.getElementById('playerName').value.trim();
    const playerPosition = document.getElementById('playerPosition').value.trim();
    
    if (!playerName || !playerPosition) {
        alert('Preencha nome e posição do jogador!');
        return;
    }
    
    const team = teams.find(t => t.id === currentTeamId);
    if (!team) return;
    
    if (team.players.length >= team.maxPlayers) {
        alert(`Time já atingiu o limite máximo de ${team.maxPlayers} jogadores!`);
        return;
    }
    
    // Verificar se jogador já existe
    if (team.players.some(p => p.name.toLowerCase() === playerName.toLowerCase())) {
        alert('Jogador já cadastrado neste time!');
        return;
    }
    
    team.players.push({
        name: playerName,
        position: playerPosition,
        addedAt: new Date().toISOString()
    });
    
    saveTeams();
    renderPlayersList(team);
    renderTeams();
    
    // Limpar campos
    document.getElementById('playerName').value = '';
    document.getElementById('playerPosition').value = '';
    
    showSuccessMessage('Jogador adicionado com sucesso!');
}

// Remover jogador
function removePlayer(playerIndex) {
    const team = teams.find(t => t.id === currentTeamId);
    if (!team) return;
    
    if (confirm('Tem certeza que deseja remover este jogador?')) {
        team.players.splice(playerIndex, 1);
        saveTeams();
        renderPlayersList(team);
        renderTeams();
        showSuccessMessage('Jogador removido com sucesso!');
    }
}

// Excluir time
function deleteTeam(teamId) {
    if (confirm('Tem certeza que deseja excluir este time? Esta ação não pode ser desfeita.')) {
        teams = teams.filter(team => team.id !== teamId);
        saveTeams();
        renderTeams();
        showSuccessMessage('Time excluído com sucesso!');
    }
}

// Logout
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('loggedUser');
        currentUser = null;
        showLoginPrompt();
        teams = [];
    }
}

// Redirecionar para login
function redirectToLogin() {
    window.location.href = '../login/login.html';
}

// Voltar para página principal
function voltarPagina() {
    window.location.href = '../../index.html';
}

// Funções auxiliares
function getSportIcon(sport) {
    const icons = {
        futebol: '⚽',
        basquete: '🏀',
        volei: '🏐',
        futsal: '🥅',
        handebol: '🤾',
        natacao: '🏊',
        atletismo: '🏃',
        tenis: '🎾'
    };
    return icons[sport] || '🏆';
}

function getSportName(sport) {
    const names = {
        futebol: 'Futebol',
        basquete: 'Basquete',
        volei: 'Vôlei',
        futsal: 'Futsal',
        handebol: 'Handebol',
        natacao: 'Natação',
        atletismo: 'Atletismo',
        tenis: 'Tênis'
    };
    return names[sport] || sport;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function showSuccessMessage(message) {
    // Criar elemento de mensagem
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
        animation: slideInRight 0.3s ease;
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // Remover após 3 segundos
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 3000);
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('playersModal');
    if (event.target === modal) {
        closePlayersModal();
    }
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);