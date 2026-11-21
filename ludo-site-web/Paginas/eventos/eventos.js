const eventos = [
    { titulo: 'Corrida de Rua Fortaleza', categoria: 'competição', data: '2026-12-06', local: 'Av. Beira Mar - Meireles', descricao: 'Evento anual que reúne milhares de corredores.', preco: 'Gratuito' },
    { titulo: 'Jogos Escolares', categoria: 'competição', data: '2026-11-28', local: 'Centro de Formação Olímpica', descricao: 'Competição anual entre escolas da rede municipal.', preco: 'Gratuito' },
    { titulo: 'Workshop de Iniciação ao Vôlei', categoria: 'workshop', data: '2026-11-22', local: 'Praia do Futuro', descricao: 'Fundamentos e prática para quem quer começar no vôlei.', preco: 'R$ 20,00' },
    { titulo: 'Palestra: Nutrição no Esporte', categoria: 'palestra', data: '2026-12-02', local: 'Secretaria de Esporte e Lazer', descricao: 'Alimentação e hidratação para atletas amadores.', preco: 'Gratuito' }
];

function formatarData(iso) {
    const [a, m, d] = iso.split('-');
    return `${d}/${m}/${a}`;
}

function renderEventos(filtro = 'todos') {
    const grid = document.querySelector('.eventos-grid');
    const lista = filtro === 'todos' ? eventos : eventos.filter(e => e.categoria === filtro);
    grid.innerHTML = lista.map(e => `
        <div class="evento-card">
            <div class="evento-header">
                <h3 class="evento-titulo">${e.titulo}</h3>
                <span class="evento-categoria">${e.categoria}</span>
            </div>
            <div class="evento-data">📅 ${formatarData(e.data)}</div>
            <div class="evento-local">📍 ${e.local}</div>
            <p class="evento-descricao">${e.descricao}</p>
            <div class="evento-footer">
                <span class="evento-preco">${e.preco}</span>
                <button class="btn-inscrever">Inscrever-se</button>
            </div>
        </div>`).join('') || '<p style="color:#fff">Nenhum evento nesta categoria.</p>';
}

function voltarPagina() {
    window.location.href = '../../index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    renderEventos();
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderEventos(btn.dataset.filter);
        });
    });
});
