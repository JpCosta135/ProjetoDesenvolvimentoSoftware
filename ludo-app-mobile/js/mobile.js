/* ===== Imagens =====
   Todos os caminhos ficam aqui (pasta assets/). O resto do código usa só a chave
   ('futebol', 'volei'...). Itens publicados guardam a chave, e caminhos antigos
   (Asset/Imagens/...) ainda são reconhecidos pelo nome do arquivo. */
const IMG = {
  logo: 'assets/logos/nome-ludo-lateral-corte-menor.png',
  futebol: 'assets/images/futebol-comunidade.jpg',
  volei: 'assets/images/volei-praia.jpg',
  corrida: 'assets/images/corrida.jpg',
  areninha: 'assets/images/areninha-500.jpg'
};
const IMG_BY_FILE = { 'futebol-comunidade.jpg': 'futebol', 'volei-praia.jpg': 'volei', 'corrida.jpg': 'corrida', 'areninha-500.jpg': 'areninha' };
function resolveImage(value) {
  if (IMG[value]) return IMG[value];
  return IMG[IMG_BY_FILE[String(value || '').split('/').pop()]] || IMG.areninha;
}

const icon = (name) => `<svg aria-hidden="true"><use href="#i-${name}"></use></svg>`;

const seedEvents = [
  {
    id: 1,
    type: 'Evento',
    sport: 'Futebol',
    title: 'Futebol na Areninha',
    date: 'Hoje, 18:30',
    location: 'Areninha Campo do América',
    distance: '2,1 km',
    people: '12 de 16 vagas',
    image: IMG.futebol,
    description: 'Partida aberta para todos os níveis. Forme novas conexões e confirme sua vaga antes de sair de casa.'
  },
  {
    id: 2,
    type: 'Evento',
    sport: 'Vôlei',
    title: 'Vôlei ao pôr do sol',
    date: 'Sáb, 16:00',
    location: 'Praia do Futuro',
    distance: '5,8 km',
    people: '8 de 12 vagas',
    image: IMG.volei,
    description: 'Encontro de vôlei de praia com orientação para iniciantes e espaço para quem já pratica.'
  },
  {
    id: 3,
    type: 'Evento',
    sport: 'Corrida',
    title: 'Corrida Beira-Mar 5 km',
    date: 'Dom, 06:00',
    location: 'Aterro da Praia de Iracema',
    distance: '3,4 km',
    people: '24 participantes',
    image: IMG.corrida,
    description: 'Treino coletivo com ritmo leve e pontos de hidratação ao longo do percurso.'
  },
  {
    id: 4,
    type: 'Espaço',
    sport: 'Futebol',
    title: 'Arena Aldeota',
    date: 'Livre hoje, 20:00',
    location: 'Aldeota',
    distance: '1,8 km',
    people: 'Quadra society',
    image: IMG.areninha,
    description: 'Campo society com iluminação, vestiário e horários disponíveis para reserva.'
  },
  {
    id: 5,
    type: 'Profissional',
    sport: 'Corrida',
    title: 'Joaquim Lima',
    date: 'Disponível amanhã',
    location: 'Meireles e região',
    distance: '4,2 km',
    people: 'Educador físico',
    image: IMG.futebol,
    description: 'Educador físico com foco em corrida, condicionamento e avaliação para iniciantes.'
  },
  {
    id: 6,
    type: 'Espaço',
    sport: 'Vôlei',
    title: 'Quadras Praia do Futuro',
    date: 'Livre hoje, 17:00',
    location: 'Praia do Futuro',
    distance: '6,1 km',
    people: 'Areia e iluminação',
    image: IMG.volei,
    description: 'Duas quadras de areia com rede, iluminação e apoio para grupos.'
  }
];

let events = seedEvents.slice();

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const state = {
  user: null,
  view: 'home',
  filter: 'Todos',
  favorites: new Set(),
  joined: new Set([1])
};

const views = [...document.querySelectorAll('.app-view')];
const navButtons = [...document.querySelectorAll('[data-nav]')];
const sheet = document.getElementById('detailSheet');
const backdrop = document.getElementById('sheetBackdrop');
const sheetContent = document.getElementById('sheetContent');
const toast = document.getElementById('toast');
let toastTimer;

function eventCard(event) {
  return `
    <article class="event-card" data-event-id="${event.id}" tabindex="0" role="button" aria-label="Ver ${esc(event.title)}">
      <div class="event-image">
        <img src="${esc(event.image)}" alt="">
        <span class="event-badge">${esc(event.sport)}</span>
        <button class="favorite ${state.favorites.has(event.id) ? 'active' : ''}" type="button" data-favorite="${event.id}" aria-label="Favoritar ${esc(event.title)}">
          ${icon('heart')}
        </button>
      </div>
      <div class="event-body">
        <div class="event-meta"><span>${esc(event.date)}</span><span>${esc(event.distance)}</span></div>
        <h3>${esc(event.title)}</h3>
        <span class="event-location">${icon('location')} ${esc(event.location)}</span>
      </div>
    </article>`;
}

function resultCard(event) {
  return `
    <article class="result-card" data-event-id="${event.id}" tabindex="0" role="button">
      <img src="${esc(event.image)}" alt="">
      <div class="result-copy">
        <span class="type">${esc(event.type)} · ${esc(event.sport)}</span>
        <h3>${esc(event.title)}</h3>
        <p>${esc(event.location)} · ${esc(event.distance)}</p>
        <strong>${esc(event.date)}</strong>
      </div>
    </article>`;
}

function renderHome(sport = 'Todos', query = '') {
  const normalized = query.toLocaleLowerCase('pt-BR');
  const list = events.filter((event) => {
    const sportMatch = sport === 'Todos' || event.sport === sport;
    const queryMatch = !normalized || `${esc(event.title)} ${esc(event.sport)} ${esc(event.location)}`.toLocaleLowerCase('pt-BR').includes(normalized);
    return sportMatch && queryMatch;
  }).slice(0, 3);
  document.getElementById('homeEvents').innerHTML = list.length
    ? list.map(eventCard).join('')
    : '<p class="sheet-description">Nenhuma atividade encontrada. Tente outra modalidade.</p>';
}

function renderExplore() {
  const query = document.getElementById('exploreSearch').value.toLocaleLowerCase('pt-BR');
  const filtered = events.filter((event) => {
    const filterMatch = state.filter === 'Todos' || event.type === state.filter;
    const queryMatch = !query || `${esc(event.title)} ${esc(event.sport)} ${esc(event.location)}`.toLocaleLowerCase('pt-BR').includes(query);
    return filterMatch && queryMatch;
  });
  document.getElementById('resultCount').textContent = `${filtered.length} ${filtered.length === 1 ? 'resultado' : 'resultados'}`;
  document.getElementById('exploreResults').innerHTML = filtered.length
    ? filtered.map(resultCard).join('')
    : '<section class="empty-agenda"><h2>Nada por aqui ainda</h2><p>Altere o filtro ou pesquise outro bairro.</p></section>';
}

function navigate(view) {
  state.view = view;
  document.querySelectorAll('.app-view').forEach((item) => item.classList.toggle('active', item.dataset.view === view));
  document.querySelectorAll('[data-nav]').forEach((button) => button.classList.toggle('active', button.dataset.nav === view));
  if (view === 'profile' && state.user) renderProfile();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showToast(message) {
  toast.querySelector('span').textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function openSheet(content) {
  sheetContent.innerHTML = content;
  sheet.classList.add('open');
  backdrop.classList.add('open');
  sheet.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeSheet() {
  sheet.classList.remove('open');
  backdrop.classList.remove('open');
  sheet.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function openEvent(id) {
  const event = events.find((item) => item.id === Number(id));
  if (!event) return;
  const joined = state.joined.has(event.id);
  openSheet(`
    <img class="sheet-image" src="${esc(event.image)}" alt="${esc(event.title)}">
    <span class="sheet-kicker">${esc(event.type)} · ${esc(event.sport)}</span>
    <h2 id="detailTitle">${esc(event.title)}</h2>
    <p class="sheet-description">${esc(event.description)}</p>
    <div class="sheet-facts">
      <div>${icon('calendar')} ${esc(event.date)}</div>
      <div>${icon('location')} ${esc(event.location)} · ${esc(event.distance)}</div>
      <div>${icon('users')} ${esc(event.people)}</div>
    </div>
    <div class="sheet-actions">
      <button class="secondary-button" type="button" data-favorite="${event.id}">${state.favorites.has(event.id) ? 'Salvo' : 'Salvar'}</button>
      <button class="primary-button" type="button" data-join="${event.id}">${joined ? 'Presença confirmada' : event.type === 'Espaço' ? 'Ver horários' : event.type === 'Profissional' ? 'Ver disponibilidade' : 'Confirmar presença'}</button>
    </div>`);
}

function bookingSheet(id) {
  const space = events.find((item) => item.id === Number(id));
  openSheet(`
    <span class="sheet-kicker">Reserva de espaço</span>
    <h2 id="detailTitle">${esc(space.title)}</h2>
    <p class="sheet-description">Escolha um horário livre para hoje. A disponibilidade é atualizada pelo proprietário.</p>
    <div class="sheet-facts">
      <div>${icon('location')} ${esc(space.location)} · ${esc(space.distance)}</div>
      <div>${icon('calendar')} Hoje, 18 de novembro</div>
    </div>
    <span class="sheet-kicker">Horários disponíveis</span>
    <div class="time-slots">
      <button class="time-slot" type="button" data-book-time="18:00">18:00</button>
      <button class="time-slot" type="button" data-book-time="19:00">19:00</button>
      <button class="time-slot" type="button" data-book-time="20:00">20:00</button>
      <button class="time-slot" type="button" data-book-time="21:00">21:00</button>
    </div>
    <button class="booking-confirm" type="button" data-book-confirm="${space.id}" disabled>Confirmar reserva</button>`);
}

function genericSheet(kind) {
  const sheets = {
    location: `
      <span class="sheet-kicker">Localização</span><h2 id="detailTitle">Onde você quer praticar?</h2>
      <p class="sheet-description">A localização ajuda a ordenar espaços, eventos e profissionais por proximidade.</p>
      <form class="publish-form" data-location-form>
        <label class="field-label">Cidade ou bairro<input required value="Fortaleza, CE"></label>
        <button class="form-submit" type="submit">Usar esta localização</button>
      </form>`,
    filters: `
      <span class="sheet-kicker">Filtros</span><h2 id="detailTitle">Encontre a opção certa</h2>
      <form class="publish-form" data-filter-form>
        <label class="field-label">Distância máxima<select><option>Até 5 km</option><option selected>Até 10 km</option><option>Qualquer distância</option></select></label>
        <label class="field-label">Quando<select><option>Hoje</option><option selected>Esta semana</option><option>Fim de semana</option></select></label>
        <button class="form-submit" type="submit">Aplicar filtros</button>
      </form>`,
    professional: `
      <span class="sheet-kicker">Profissional em destaque</span><h2 id="detailTitle">Joaquim Lima</h2>
      <p class="sheet-description">Educador físico, CREF ativo, com atendimento em corrida e condicionamento funcional na região do Meireles.</p>
      <div class="sheet-facts"><div>${icon('award')} Perfil verificado</div><div>${icon('location')} Atende a 4,2 km</div><div>${icon('clock')} Próximo horário: amanhã, 07:00</div></div>
      <button class="primary-button" type="button" data-toast="Solicitação enviada para Joaquim">Solicitar contato</button>`
  };
  openSheet(sheets[kind] || '');
}


/* ===== Perfis, cadastro e acesso =====
   Três perfis: praticante, proprietário de espaço e educador físico.
   Contas usam as mesmas chaves do site web ('users' e 'loggedUser'). Espaços,
   aulas e eventos publicados ficam salvos na própria conta (user.items) e
   aparecem na busca dos praticantes. Solicitações de reserva e de alunos
   são dados de exemplo do protótipo. O app sempre abre na tela de acesso. */
const SPORTS = ['Futebol', 'Vôlei', 'Corrida', 'Basquete'];
const DEFAULT_IMAGE = 'areninha';
const SPORT_IMAGES = {
  'Futebol': 'futebol',
  'Vôlei': 'volei',
  'Corrida': 'corrida',
  'Basquete': DEFAULT_IMAGE
};

const ROLES = {
  praticante: {
    label: 'Praticante', profileLabel: 'Perfil praticante', start: 'home', publishLabel: 'Criar evento',
    nav: [['home', 'home', 'Início'], ['explore', 'compass', 'Explorar'], 'publish', ['agenda', 'calendar', 'Agenda'], ['profile', 'user', 'Perfil']]
  },
  proprietario: {
    label: 'Proprietário', profileLabel: 'Proprietário de espaço', start: 'owner-home', publishLabel: 'Novo espaço',
    nav: [['owner-home', 'home', 'Painel'], ['owner-spaces', 'building', 'Espaços'], 'publish', ['owner-bookings', 'calendar', 'Reservas'], ['profile', 'user', 'Perfil']]
  },
  educador: {
    label: 'Educador físico', profileLabel: 'Educador físico', start: 'pro-home', publishLabel: 'Nova aula',
    nav: [['pro-home', 'home', 'Painel'], ['pro-students', 'users', 'Alunos'], 'publish', ['pro-classes', 'calendar', 'Aulas'], ['profile', 'user', 'Perfil']]
  }
};

const COMMON_FIELDS = [
  { name: 'name', label: 'Nome completo', placeholder: 'Maria Santos', autocomplete: 'name', required: true },
  { name: 'email', type: 'email', label: 'E-mail', placeholder: 'voce@email.com', autocomplete: 'email', required: true },
  { name: 'phone', type: 'tel', label: 'Telefone', placeholder: '(85) 90000-0000', autocomplete: 'tel' },
  { name: 'cpf', inputmode: 'numeric', label: 'CPF', placeholder: 'Somente números', required: true }
];

const SPACE_FIELDS = [
  { name: 'spaceName', label: 'Nome do espaço', placeholder: 'Ex.: Arena do Bairro', required: true },
  { name: 'region', label: 'Endereço ou bairro', placeholder: 'Ex.: Aldeota', required: true },
  { name: 'spaceType', kind: 'select', label: 'Tipo de espaço', options: ['Quadra society', 'Quadra poliesportiva', 'Quadra de areia', 'Campo', 'Pista ou parque'] },
  { name: 'sports', kind: 'sports', label: 'Modalidades oferecidas' },
  { name: 'hours', label: 'Horário de funcionamento', placeholder: 'Ex.: Seg a sex, 17h às 22h', required: true },
  { name: 'price', type: 'number', label: 'Valor por hora (R$)', placeholder: '80', required: true }
];

const REGISTER = {
  praticante: {
    title: 'Cadastro de praticante',
    intro: 'Conte o que você gosta de praticar para encontrarmos atividades perto de você.',
    fields: [
      { name: 'sports', kind: 'sports', label: 'Modalidades de interesse' },
      { name: 'level', kind: 'select', label: 'Nível', options: ['Iniciante', 'Intermediário', 'Avançado'] },
      { name: 'neighborhood', label: 'Bairro', placeholder: 'Ex.: Aldeota', required: true }
    ]
  },
  proprietario: {
    title: 'Cadastro de proprietário',
    intro: 'Cadastre seu primeiro espaço. Você poderá adicionar outros depois.',
    fields: SPACE_FIELDS
  },
  educador: {
    title: 'Cadastro de educador físico',
    intro: 'Apresente sua atuação para quem procura orientação profissional.',
    fields: [
      { name: 'cref', label: 'CREF', placeholder: 'Ex.: 000123-G/CE', required: true },
      { name: 'sports', kind: 'sports', label: 'Modalidades que você ensina' },
      { name: 'region', label: 'Região de atendimento', placeholder: 'Ex.: Meireles e Aldeota', required: true },
      { name: 'availability', label: 'Disponibilidade', placeholder: 'Ex.: Seg a sex, 6h às 9h', required: true },
      { name: 'price', type: 'number', label: 'Valor por aula (R$)', placeholder: '60', required: true },
      { name: 'bio', kind: 'textarea', label: 'Sobre você (opcional)', placeholder: 'Formação e especialidades' }
    ]
  }
};

const EVENT_FIELDS = [
  { name: 'title', label: 'Nome do evento', placeholder: 'Ex.: Pelada de sexta', required: true },
  { name: 'sport', kind: 'select', label: 'Modalidade', options: SPORTS },
  { name: 'location', label: 'Local', placeholder: 'Ex.: Areninha do bairro', required: true },
  { name: 'when', label: 'Quando', placeholder: 'Ex.: Sáb, 16:00', required: true },
  { name: 'slots', type: 'number', label: 'Vagas', placeholder: '12', required: true }
];

const roleState = { bookings: [], students: [] };
const authMessage = document.getElementById('authMessage');
const newUid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const brl = (value) => 'R$ ' + Math.round(value).toLocaleString('pt-BR');
const onlyDigits = (value) => String(value || '').replace(/\D/g, '');
const normEmail = (value) => String(value || '').trim().toLocaleLowerCase('pt-BR');
const firstName = (name) => String(name || '').trim().split(/\s+/)[0] || 'atleta';
const tag = (text, kind = '') => `<span class="tag ${kind}">${esc(text)}</span>`;
const statBox = (value, label) => `<div><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`;
const viewEl = (name) => document.querySelector(`[data-view="${name}"]`);

function readUsers() {
  try { return JSON.parse(localStorage.getItem('users') || '[]'); } catch (e) { return []; }
}

function saveUsers(users) {
  try { localStorage.setItem('users', JSON.stringify(users)); return true; } catch (e) { return false; }
}

function persistUser(user) {
  const users = readUsers();
  const index = users.findIndex((u) => normEmail(u.email) === normEmail(user.email));
  if (index >= 0) users[index] = user; else users.push(user);
  return saveUsers(users);
}

function showAuthMessage(message, type) {
  authMessage.textContent = message;
  authMessage.className = `auth-message ${type}`;
  authMessage.hidden = false;
}

function clearAuthMessage() {
  authMessage.hidden = true;
  authMessage.textContent = '';
}

function fieldHtml(field) {
  if (field.kind === 'sports') {
    return `<div class="field-label">${esc(field.label)}<div class="choice-grid">${SPORTS.map((sport) => `<label><input type="checkbox" name="sports" value="${sport}"> ${sport}</label>`).join('')}</div></div>`;
  }
  if (field.kind === 'select') {
    return `<label class="field-label">${esc(field.label)}<select name="${field.name}">${field.options.map((option) => `<option>${esc(option)}</option>`).join('')}</select></label>`;
  }
  if (field.kind === 'textarea') {
    return `<label class="field-label">${esc(field.label)}<textarea name="${field.name}" rows="3" placeholder="${esc(field.placeholder || '')}"></textarea></label>`;
  }
  const attrs = [
    `name="${field.name}"`,
    `type="${field.type || 'text'}"`,
    `placeholder="${esc(field.placeholder || '')}"`,
    `autocomplete="${field.autocomplete || 'off'}"`,
    field.inputmode ? `inputmode="${field.inputmode}"` : '',
    field.type === 'number' ? 'min="1" step="1"' : '',
    field.required ? 'required' : ''
  ].filter(Boolean).join(' ');
  return `<label class="field-label">${esc(field.label)}<input ${attrs}></label>`;
}

function readFields(form, fields) {
  const data = new FormData(form);
  const values = {};
  for (const field of fields) {
    if (field.kind === 'sports') {
      values.sports = data.getAll('sports');
      if (!values.sports.length) return { error: 'Escolha ao menos uma modalidade.' };
      continue;
    }
    const raw = String(data.get(field.name) ?? '').trim();
    if (field.required && !raw) return { error: `Preencha o campo "${field.label}".` };
    if (field.type === 'number') {
      if (raw && !(Number(raw) > 0)) return { error: `Informe um valor válido em "${field.label}".` };
      values[field.name] = raw ? Number(raw) : 0;
      continue;
    }
    values[field.name] = raw;
  }
  return { values };
}

function setAuthTab(tab) {
  document.querySelectorAll('.auth-tabs [data-auth-tab]').forEach((button) => {
    const active = button.dataset.authTab === tab;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('[data-auth-form]').forEach((el) => el.classList.toggle('active', el.dataset.authForm === tab));
  showRegisterRoles();
  clearAuthMessage();
}

function showRegisterRoles() {
  document.getElementById('registerRoles').hidden = false;
  const host = document.getElementById('registerFormHost');
  host.hidden = true;
  host.innerHTML = '';
}

function showRegisterForm(role) {
  const config = REGISTER[role];
  if (!config) return;
  document.getElementById('registerRoles').hidden = true;
  const host = document.getElementById('registerFormHost');
  host.hidden = false;
  host.innerHTML = `
    <button class="auth-link-back" type="button" data-register-back>← Trocar perfil</button>
    <span class="sheet-kicker">${esc(config.title)}</span>
    <p class="sheet-description">${esc(config.intro)}</p>
    <form class="publish-form" data-register-form="${role}" novalidate>
      ${COMMON_FIELDS.concat(config.fields).map(fieldHtml).join('')}
      <button class="form-submit" type="submit">Criar conta</button>
    </form>`;
  clearAuthMessage();
}

function makeSpaceItem(p) {
  const sports = p.sports || [];
  return {
    uid: newUid(), type: 'Espaço', kind: 'espaco', sport: sports[0] || 'Futebol', sports,
    title: p.spaceName, date: 'Disponível para reserva', location: p.region, distance: 'Novo',
    people: p.spaceType, spaceType: p.spaceType, hours: p.hours, price: Number(p.price) || 0, active: true,
    image: SPORT_IMAGES[sports[0]] || DEFAULT_IMAGE,
    description: `${p.spaceType} em ${p.region}. Funcionamento: ${p.hours}. A partir de ${brl(p.price)} por hora.`
  };
}

function makeProItem(user, p) {
  const sports = p.sports || [];
  return {
    uid: newUid(), type: 'Profissional', kind: 'perfil', sport: sports[0] || 'Corrida', sports,
    title: user.name, date: `Disponível: ${p.availability}`, location: p.region, distance: 'Novo',
    people: `Educador físico · CREF ${p.cref}`, price: Number(p.price) || 0,
    image: SPORT_IMAGES[sports[0]] || DEFAULT_IMAGE,
    description: `Educador físico (CREF ${p.cref}) com atuação em ${sports.join(', ')}. ${p.bio ? p.bio + ' ' : ''}A partir de ${brl(p.price)} por aula.`
  };
}

function buildCatalog() {
  let next = 100;
  const published = readUsers().flatMap((u) => (u.items || []).filter((item) => item.active !== false).map((item) => ({ ...item, image: resolveImage(item.image), id: next++ })));
  events = seedEvents.concat(published);
}

function ownerSpaces() { return (state.user?.items || []).filter((item) => item.type === 'Espaço'); }
function proClasses() { return (state.user?.items || []).filter((item) => item.kind === 'aula'); }

function handleLogin(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const email = normEmail(data.email);
  const cpf = onlyDigits(data.cpf);
  if (!email || !cpf) return showAuthMessage('Informe e-mail e CPF.', 'error');
  const user = readUsers().find((u) => normEmail(u.email) === email && onlyDigits(u.cpf) === cpf);
  if (!user) return showAuthMessage('E-mail ou CPF incorretos!', 'error');
  unlockApp(user);
}

function handleRegister(form) {
  const role = form.dataset.registerForm;
  const config = REGISTER[role];
  if (!config) return;

  const base = readFields(form, COMMON_FIELDS);
  if (base.error) return showAuthMessage(base.error, 'error');
  const extra = readFields(form, config.fields);
  if (extra.error) return showAuthMessage(extra.error, 'error');

  const { name, phone } = base.values;
  const email = normEmail(base.values.email);
  const cpf = base.values.cpf;
  if (!/^\S+@\S+\.\S+$/.test(email)) return showAuthMessage('Digite um e-mail válido.', 'error');
  if (onlyDigits(cpf).length !== 11) return showAuthMessage('O CPF deve ter 11 dígitos.', 'error');

  const users = readUsers();
  if (users.find((u) => normEmail(u.email) === email)) return showAuthMessage('E-mail já cadastrado!', 'error');
  if (users.find((u) => onlyDigits(u.cpf) === onlyDigits(cpf))) return showAuthMessage('CPF já cadastrado!', 'error');

  const user = { name, email, phone, cpf, role, profile: extra.values, items: [] };
  if (role === 'proprietario') user.items.push(makeSpaceItem(extra.values));
  if (role === 'educador') user.items.push(makeProItem(user, extra.values));

  users.push(user);
  if (!saveUsers(users)) return showAuthMessage('Não foi possível salvar o cadastro neste navegador.', 'error');

  setAuthTab('login');
  document.querySelector('[data-auth-form="login"] [name="email"]').value = email;
  showAuthMessage(`Cadastro de ${ROLES[role].label.toLocaleLowerCase('pt-BR')} realizado! Agora é só entrar.`, 'success');
}

function initRoleData(user) {
  roleState.bookings = [];
  roleState.students = [];
  if (user.role === 'proprietario') {
    const space = (user.items || []).find((item) => item.type === 'Espaço');
    const name = space ? space.title : 'Seu espaço';
    roleState.bookings = [
      { id: 1, who: 'Maria Santos', space: name, when: 'Hoje, 19:00', status: 'pending' },
      { id: 2, who: 'Carlos Lima', space: name, when: 'Amanhã, 20:00', status: 'pending' },
      { id: 3, who: 'Time Aldeota FC', space: name, when: 'Hoje, 18:00', status: 'confirmed' },
      { id: 4, who: 'Ana Beatriz', space: name, when: 'Sáb, 17:00', status: 'confirmed' }
    ];
  }
  if (user.role === 'educador') {
    const sport = ((user.profile || {}).sports || [])[0] || 'treino';
    roleState.students = [
      { id: 1, name: 'Maria Santos', goal: `${sport} · iniciante`, status: 'pending' },
      { id: 2, name: 'Pedro Alves', goal: `${sport} · condicionamento`, status: 'pending' },
      { id: 3, name: 'Luciana Prado', goal: `${sport} · intermediário`, status: 'active' },
      { id: 4, name: 'Rafael Costa', goal: `${sport} · avaliação inicial`, status: 'active' }
    ];
  }
}

function renderNav(role) {
  const config = ROLES[role];
  document.getElementById('bottomNav').innerHTML = config.nav.map((item) => item === 'publish'
    ? `<button class="publish-button" type="button" data-open-sheet="publish" aria-label="${config.publishLabel}"><span>${icon('plus')}</span><small>${config.publishLabel}</small></button>`
    : `<button type="button" data-nav="${item[0]}">${icon(item[1])}<span>${item[2]}</span></button>`).join('');
}

function unlockApp(user) {
  user.role = ROLES[user.role] ? user.role : 'praticante';
  user.profile = user.profile || {};
  user.items = user.items || [];
  state.user = user;
  state.favorites = new Set();
  state.joined = new Set([1]);
  initRoleData(user);
  buildCatalog();
  document.body.dataset.role = user.role;
  document.getElementById('homeGreeting').textContent = `Olá, ${firstName(user.name)}`;
  try { localStorage.setItem('loggedUser', JSON.stringify(user)); } catch (e) {}
  renderNav(user.role);
  refreshCatalog();
  document.body.classList.remove('auth-locked');
  navigate(ROLES[user.role].start);
  window.scrollTo(0, 0);
}

function lockApp() {
  try { localStorage.removeItem('loggedUser'); } catch (e) {}
  closeSheet();
  state.user = null;
  delete document.body.dataset.role;
  document.querySelectorAll('form').forEach((form) => form.reset());
  document.body.classList.add('auth-locked');
  setAuthTab('login');
  window.scrollTo(0, 0);
}

function refreshCatalog() {
  buildCatalog();
  renderHome(document.querySelector('.sport-pill.active')?.dataset.sport || 'Todos', document.getElementById('homeSearch').value);
  renderExplore();
  renderRoleViews();
}

/* ----- Publicar (depende do perfil) ----- */
function openPublish() {
  const user = state.user;
  if (!user) return;
  if (user.role === 'proprietario') {
    openSheet(`<span class="sheet-kicker">Novo espaço</span><h2 id="detailTitle">Cadastre outro espaço</h2>
      <p class="sheet-description">Ele aparece na busca dos praticantes assim que for publicado.</p>
      <form class="publish-form" data-publish-form="space" novalidate>${SPACE_FIELDS.map(fieldHtml).join('')}<button class="form-submit" type="submit">Publicar espaço</button></form>`);
  } else if (user.role === 'educador') {
    const sports = (user.profile.sports && user.profile.sports.length) ? user.profile.sports : SPORTS;
    const fields = [
      { name: 'title', label: 'Nome da aula', placeholder: 'Ex.: Corrida para iniciantes', required: true },
      { name: 'sport', kind: 'select', label: 'Modalidade', options: sports },
      { name: 'location', label: 'Local', placeholder: 'Ex.: Aterro da Praia de Iracema', required: true },
      { name: 'when', label: 'Dia e horário', placeholder: 'Ex.: Qua, 06:00', required: true },
      { name: 'slots', type: 'number', label: 'Vagas', placeholder: '10', required: true }
    ];
    openSheet(`<span class="sheet-kicker">Nova aula</span><h2 id="detailTitle">Publique uma aula</h2>
      <p class="sheet-description">Praticantes poderão encontrar e confirmar presença.</p>
      <form class="publish-form" data-publish-form="class" novalidate>${fields.map(fieldHtml).join('')}<button class="form-submit" type="submit">Publicar aula</button></form>`);
  } else {
    openSheet(`<span class="sheet-kicker">Novo evento</span><h2 id="detailTitle">Chame a galera para jogar</h2>
      <p class="sheet-description">Crie um encontro aberto e acompanhe quem confirma presença.</p>
      <form class="publish-form" data-publish-form="event" novalidate>${EVENT_FIELDS.map(fieldHtml).join('')}<button class="form-submit" type="submit">Criar evento</button></form>`);
  }
}

function handlePublish(form) {
  const kind = form.dataset.publishForm;
  const user = state.user;
  let item;
  let target;
  let message;

  if (kind === 'space') {
    const { values, error } = readFields(form, SPACE_FIELDS);
    if (error) return showToast(error);
    item = makeSpaceItem(values);
    target = 'owner-spaces';
    message = 'Espaço publicado com sucesso';
  } else {
    const fields = kind === 'class'
      ? [{ name: 'title', label: 'Nome da aula', required: true }, { name: 'sport' }, { name: 'location', label: 'Local', required: true }, { name: 'when', label: 'Dia e horário', required: true }, { name: 'slots', type: 'number', label: 'Vagas', required: true }]
      : EVENT_FIELDS;
    const { values, error } = readFields(form, fields);
    if (error) return showToast(error);
    const isClass = kind === 'class';
    item = {
      uid: newUid(), type: 'Evento', kind: isClass ? 'aula' : 'evento', sport: values.sport,
      title: isClass ? `Aula: ${values.title}` : values.title, date: values.when, location: values.location,
      distance: 'Novo', people: isClass ? `${values.slots} vagas` : `0 de ${values.slots} vagas`, slots: values.slots,
      image: SPORT_IMAGES[values.sport] || DEFAULT_IMAGE,
      description: isClass
        ? `Aula com ${user.name}, educador físico. ${values.slots} vagas.`
        : `Evento criado por ${user.name}. Confirme presença e venha jogar.`
    };
    target = isClass ? 'pro-classes' : 'explore';
    message = isClass ? 'Aula publicada com sucesso' : 'Evento criado! Já aparece na busca.';
  }

  user.items.push(item);
  persistUser(user);
  closeSheet();
  refreshCatalog();
  navigate(target);
  showToast(message);
}

function professionalSheet(item) {
  openSheet(`
    <span class="sheet-kicker">Educador físico</span><h2 id="detailTitle">${esc(item.title)}</h2>
    <p class="sheet-description">${esc(item.description)}</p>
    <div class="sheet-facts"><div>${icon('award')} ${esc(item.people)}</div><div>${icon('location')} ${esc(item.location)}</div><div>${icon('clock')} ${esc(item.date)}</div></div>
    <button class="primary-button" type="button" data-toast="Solicitação enviada para ${esc(firstName(item.title))}">Solicitar contato</button>`);
}

/* ----- Painéis por perfil ----- */
const decisionButtons = (kind, id) => `<div class="manage-actions"><button class="secondary-button" type="button" data-decision="decline" data-kind="${kind}" data-id="${id}">Recusar</button><button class="primary-button" type="button" data-decision="accept" data-kind="${kind}" data-id="${id}">Aceitar</button></div>`;

const emptyBlock = (title, text = '', action = '') => `<section class="empty-agenda"><h2>${esc(title)}</h2>${text ? `<p>${esc(text)}</p>` : ''}${action}</section>`;

const BOOKING_TAGS = { pending: ['Pendente', 'pending'], confirmed: ['Confirmada', ''], declined: ['Recusada', 'declined'] };
const STUDENT_TAGS = { pending: ['Solicitação', 'pending'], active: ['Ativo', ''], declined: ['Recusado', 'declined'] };

function bookingCard(b) {
  const [label, kind] = BOOKING_TAGS[b.status];
  return `<article class="manage-card"><div class="manage-top"><div><h3>${esc(b.who)}</h3><p>${esc(b.space)} · ${esc(b.when)}</p></div>${tag(label, kind)}</div>${b.status === 'pending' ? decisionButtons('booking', b.id) : ''}</article>`;
}

function spaceCard(space) {
  return `<article class="manage-card">
    <div class="manage-top"><div><h3>${esc(space.title)}</h3><p>${esc(space.location)} · ${esc(space.hours)}</p></div>${space.active ? tag('Aberto') : tag('Pausado', 'off')}</div>
    <div class="manage-meta">${tag(space.spaceType, 'neutral')}${(space.sports || []).map((sport) => tag(sport, 'neutral')).join('')}${tag(brl(space.price) + '/h', 'neutral')}</div>
    <div class="manage-actions">
      <button class="secondary-button" type="button" data-space-edit="${space.uid}">Editar</button>
      <button class="secondary-button" type="button" data-space-toggle="${space.uid}">${space.active ? 'Pausar' : 'Reativar'}</button>
    </div></article>`;
}

function studentCard(s) {
  const [label, kind] = STUDENT_TAGS[s.status];
  const actions = s.status === 'pending'
    ? decisionButtons('student', s.id)
    : s.status === 'active' ? `<div class="manage-actions"><button class="secondary-button" type="button" data-toast="Mensagem enviada para ${esc(firstName(s.name))}">Enviar mensagem</button></div>` : '';
  return `<article class="manage-card"><div class="manage-top"><div><h3>${esc(s.name)}</h3><p>${esc(s.goal)}</p></div>${tag(label, kind)}</div>${actions}</article>`;
}

function classCard(c) {
  return `<article class="manage-card"><div class="manage-top"><div><h3>${esc(c.title)}</h3><p>${esc(c.date)} · ${esc(c.location)}</p></div>${tag(`${c.slots} vagas`)}</div>
    <div class="manage-actions"><button class="secondary-button" type="button" data-class-cancel="${c.uid}">Cancelar aula</button></div></article>`;
}

const sectionHead = (overline, title, button = '') => `<div class="section-heading"><div><span class="overline">${esc(overline)}</span><h2>${esc(title)}</h2></div>${button}</div>`;
const addButton = (label) => `<button class="icon-button" type="button" data-open-sheet="publish" aria-label="${esc(label)}">${icon('plus')}</button>`;
const demoNote = '<p class="demo-note">Solicitações de exemplo para demonstrar o protótipo.</p>';
const noSpaceBlock = () => emptyBlock('Nenhum espaço cadastrado', 'Cadastre um espaço para receber reservas.', '<button class="primary-button" type="button" data-open-sheet="publish">Cadastrar espaço</button>');
const noClassBlock = () => emptyBlock('Nenhuma aula publicada', 'Publique sua primeira aula para aparecer na busca dos praticantes.', '<button class="primary-button" type="button" data-open-sheet="publish">Publicar aula</button>');

function renderOwnerHome() {
  const bookings = roleState.bookings;
  const pending = bookings.filter((b) => b.status === 'pending');
  const confirmed = bookings.filter((b) => b.status === 'confirmed');
  const spaces = ownerSpaces();
  const rate = (spaces.find((s) => s.active) || {}).price || 0;
  viewEl('owner-home').innerHTML = `
    <div class="home-intro"><p class="eyebrow">Olá, ${esc(firstName(state.user.name))}</p><h1>Seu espaço em um só lugar.</h1></div>
    <div class="profile-stats">${statBox(pending.length, 'pendentes')}${statBox(confirmed.length, 'confirmadas')}${statBox(brl(confirmed.length * rate), 'previsto')}</div>
    ${sectionHead('Ação necessária', 'Solicitações de reserva', '<button type="button" data-nav-target="owner-bookings">Ver todas</button>')}
    <div class="manage-list">${pending.length ? pending.slice(0, 3).map(bookingCard).join('') : emptyBlock('Nenhuma solicitação pendente')}</div>
    ${sectionHead('Seus locais', 'Meus espaços', '<button type="button" data-nav-target="owner-spaces">Gerenciar</button>')}
    <div class="manage-list">${spaces.length ? spaces.slice(0, 2).map(spaceCard).join('') : noSpaceBlock()}</div>
    ${demoNote}`;
}

function renderOwnerSpaces() {
  const spaces = ownerSpaces();
  viewEl('owner-spaces').innerHTML = `
    <div class="view-header"><div><span class="overline">${spaces.length} ${spaces.length === 1 ? 'espaço' : 'espaços'}</span><h1>Meus espaços</h1></div>${addButton('Cadastrar espaço')}</div>
    <div class="manage-list">${spaces.length ? spaces.map(spaceCard).join('') : noSpaceBlock()}</div>`;
}

function renderOwnerBookings() {
  const group = (status) => roleState.bookings.filter((b) => b.status === status);
  const list = (items, empty) => `<div class="manage-list">${items.length ? items.map(bookingCard).join('') : emptyBlock(empty)}</div>`;
  const declined = group('declined');
  viewEl('owner-bookings').innerHTML = `
    <div class="view-header"><div><span class="overline">Agenda do espaço</span><h1>Reservas</h1></div></div>
    ${sectionHead('Aguardando você', 'Pendentes')}${list(group('pending'), 'Nenhuma solicitação pendente')}
    ${sectionHead('Na agenda', 'Confirmadas')}${list(group('confirmed'), 'Nenhuma reserva confirmada')}
    ${declined.length ? sectionHead('Histórico', 'Recusadas') + list(declined, '') : ''}
    ${demoNote}`;
}

function renderProHome() {
  const students = roleState.students;
  const pending = students.filter((s) => s.status === 'pending');
  const active = students.filter((s) => s.status === 'active');
  const classes = proClasses();
  viewEl('pro-home').innerHTML = `
    <div class="home-intro"><p class="eyebrow">Olá, ${esc(firstName(state.user.name))}</p><h1>Seus alunos e aulas.</h1></div>
    <div class="profile-stats">${statBox(active.length, 'alunos ativos')}${statBox(pending.length, 'solicitações')}${statBox(classes.length, 'aulas')}</div>
    ${sectionHead('Novos alunos', 'Solicitações', '<button type="button" data-nav-target="pro-students">Ver alunos</button>')}
    <div class="manage-list">${pending.length ? pending.slice(0, 3).map(studentCard).join('') : emptyBlock('Nenhuma solicitação pendente')}</div>
    ${sectionHead('Agenda', 'Próximas aulas', '<button type="button" data-nav-target="pro-classes">Ver todas</button>')}
    <div class="manage-list">${classes.length ? classes.slice(0, 3).map(classCard).join('') : noClassBlock()}</div>
    ${demoNote}`;
}

function renderProStudents() {
  const group = (status) => roleState.students.filter((s) => s.status === status);
  const list = (items, empty) => `<div class="manage-list">${items.length ? items.map(studentCard).join('') : emptyBlock(empty)}</div>`;
  viewEl('pro-students').innerHTML = `
    <div class="view-header"><div><span class="overline">${group('active').length} ativos</span><h1>Alunos</h1></div></div>
    ${sectionHead('Aguardando resposta', 'Solicitações')}${list(group('pending'), 'Nenhuma solicitação pendente')}
    ${sectionHead('Seus alunos', 'Ativos')}${list(group('active'), 'Nenhum aluno ativo ainda')}
    ${demoNote}`;
}

function renderProClasses() {
  const classes = proClasses();
  viewEl('pro-classes').innerHTML = `
    <div class="view-header"><div><span class="overline">Publicadas por você</span><h1>Aulas</h1></div>${addButton('Publicar aula')}</div>
    <div class="manage-list">${classes.length ? classes.map(classCard).join('') : noClassBlock()}</div>`;
}

function renderRoleViews() {
  const role = state.user && state.user.role;
  if (role === 'proprietario') { renderOwnerHome(); renderOwnerSpaces(); renderOwnerBookings(); }
  if (role === 'educador') { renderProHome(); renderProStudents(); renderProClasses(); }
  if (state.view === 'profile') renderProfile();
}

function renderProfile() {
  const user = state.user;
  const p = user.profile || {};
  const role = user.role;
  document.getElementById('profileRole').textContent = ROLES[role].profileLabel;
  document.getElementById('profile-title').textContent = user.name;
  document.getElementById('profileAvatar').textContent = (() => {
    const parts = user.name.trim().split(/\s+/).filter(Boolean);
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toLocaleUpperCase('pt-BR');
  })();

  let stats;
  let facts;
  if (role === 'proprietario') {
    const space = ownerSpaces()[0] || {};
    stats = [[ownerSpaces().length, 'espaços'], [roleState.bookings.filter((b) => b.status === 'confirmed').length, 'reservas'], [roleState.bookings.filter((b) => b.status === 'pending').length, 'pendentes']];
    facts = [['building', space.title ? `${space.title} · ${space.spaceType}` : ''], ['location', space.location], ['clock', space.hours], ['award', space.price ? `${brl(space.price)} por hora` : '']];
  } else if (role === 'educador') {
    stats = [[roleState.students.filter((s) => s.status === 'active').length, 'alunos'], [proClasses().length, 'aulas'], [(p.sports || []).length, 'modalidades']];
    facts = [['award', p.cref ? `CREF ${p.cref}` : ''], ['users', (p.sports || []).join(', ')], ['location', p.region], ['clock', p.availability], ['check', p.price ? `${brl(p.price)} por aula` : '']];
  } else {
    stats = [[state.joined.size, 'eventos'], [(p.sports || []).length, 'modalidades'], [state.favorites.size, 'favoritos']];
    facts = [['users', (p.sports || []).join(', ')], ['award', p.level ? `Nível ${p.level.toLocaleLowerCase('pt-BR')}` : ''], ['location', p.neighborhood]];
  }
  document.getElementById('profileStats').innerHTML = stats.map(([value, label]) => statBox(value, label)).join('');
  const rows = [['user', user.email]].concat(facts).filter(([, text]) => text);
  document.getElementById('profileDetails').innerHTML = `<span class="overline">${esc(ROLES[role].label)}</span><h2>Dados da sua conta</h2><div class="sheet-facts">${rows.map(([name, text]) => `<div>${icon(name)} ${esc(text)}</div>`).join('')}</div>`;
}

function handleDecision({ kind, id, decision }) {
  const accept = decision === 'accept';
  const list = kind === 'booking' ? roleState.bookings : roleState.students;
  const entry = list.find((item) => item.id === Number(id));
  if (!entry) return;
  entry.status = accept ? (kind === 'booking' ? 'confirmed' : 'active') : 'declined';
  showToast(kind === 'booking' ? (accept ? 'Reserva confirmada' : 'Reserva recusada') : (accept ? 'Aluno aceito' : 'Solicitação recusada'));
  renderRoleViews();
}

function toggleSpace(uid) {
  const space = ownerSpaces().find((item) => item.uid === uid);
  if (!space) return;
  space.active = !space.active;
  persistUser(state.user);
  refreshCatalog();
  showToast(space.active ? 'Espaço reativado' : 'Espaço pausado: não aparece na busca');
}

function openSpaceEdit(uid) {
  const space = ownerSpaces().find((item) => item.uid === uid);
  if (!space) return;
  openSheet(`<span class="sheet-kicker">Editar espaço</span><h2 id="detailTitle">${esc(space.title)}</h2>
    <form class="publish-form" data-space-edit-form="${space.uid}" novalidate>
      <label class="field-label">Horário de funcionamento<input name="hours" value="${esc(space.hours)}" required></label>
      <label class="field-label">Valor por hora (R$)<input name="price" type="number" min="1" step="1" value="${esc(space.price)}" required></label>
      <button class="form-submit" type="submit">Salvar alterações</button>
    </form>`);
}

function saveSpaceEdit(form) {
  const space = ownerSpaces().find((item) => item.uid === form.dataset.spaceEditForm);
  const data = new FormData(form);
  const hours = String(data.get('hours') || '').trim();
  const price = Number(data.get('price'));
  if (!space || !hours || !(price > 0)) return showToast('Preencha horário e valor.');
  space.hours = hours;
  space.price = price;
  space.description = `${space.spaceType} em ${space.location}. Funcionamento: ${hours}. A partir de ${brl(price)} por hora.`;
  persistUser(state.user);
  closeSheet();
  refreshCatalog();
  showToast('Espaço atualizado');
}

function cancelClass(uid) {
  state.user.items = state.user.items.filter((item) => item.uid !== uid);
  persistUser(state.user);
  refreshCatalog();
  showToast('Aula cancelada');
}

/* ===== Modo escuro =====
   Usa theme.js (mesma chave 'theme' do site web), então a escolha vale nos dois. */
function syncThemeButtons() {
  const dark = document.documentElement.classList.contains('dark-theme');
  const label = dark ? 'Ativar modo claro' : 'Ativar modo escuro';
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-label', label);
    button.title = label;
    const emoji = button.querySelector('[data-theme-emoji]');
    if (emoji) emoji.textContent = dark ? '☀️' : '🌙';
    else if (!button.children.length) button.textContent = dark ? '☀️' : '🌙';
    const text = button.querySelector('[data-theme-text]');
    if (text) text.textContent = dark ? 'Modo claro' : 'Modo escuro';
  });
  const meta = document.getElementById('themeColorMeta');
  if (meta) meta.setAttribute('content', dark ? '#0d1512' : '#0b7444');
}

function toggleDarkMode() {
  if (typeof window.toggleTheme === 'function') {
    window.toggleTheme();
  } else {
    const root = document.documentElement;
    root.classList.toggle('dark-theme');
    try { localStorage.setItem('theme', root.classList.contains('dark-theme') ? 'dark' : 'light'); } catch (e) {}
  }
  syncThemeButtons();
}

document.addEventListener('click', (event) => {
  if (event.target.closest('[data-theme-toggle]')) toggleDarkMode();
  const authTab = event.target.closest('[data-auth-tab]');
  if (authTab) setAuthTab(authTab.dataset.authTab);

  if (event.target.closest('[data-logout]')) lockApp();

  const registerRole = event.target.closest('[data-register-role]');
  if (registerRole) showRegisterForm(registerRole.dataset.registerRole);
  if (event.target.closest('[data-register-back]')) showRegisterRoles();

  const decision = event.target.closest('[data-decision]');
  if (decision) handleDecision(decision.dataset);

  const spaceToggle = event.target.closest('[data-space-toggle]');
  if (spaceToggle) toggleSpace(spaceToggle.dataset.spaceToggle);
  const spaceEdit = event.target.closest('[data-space-edit]');
  if (spaceEdit) openSpaceEdit(spaceEdit.dataset.spaceEdit);
  const classCancel = event.target.closest('[data-class-cancel]');
  if (classCancel) cancelClass(classCancel.dataset.classCancel);

  const nav = event.target.closest('[data-nav], [data-nav-target]');
  if (nav) navigate(nav.dataset.nav || nav.dataset.navTarget);

  const eventTarget = event.target.closest('[data-event-id]');
  if (eventTarget && !event.target.closest('[data-favorite]')) openEvent(eventTarget.dataset.eventId);

  const favorite = event.target.closest('[data-favorite]');
  if (favorite) {
    event.stopPropagation();
    const id = Number(favorite.dataset.favorite);
    state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
    showToast(state.favorites.has(id) ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
    renderHome(document.querySelector('.sport-pill.active')?.dataset.sport || 'Todos', document.getElementById('homeSearch').value);
    renderExplore();
    if (sheet.classList.contains('open')) openEvent(id);
  }

  const join = event.target.closest('[data-join]');
  if (join) {
    const id = Number(join.dataset.join);
    const selected = events.find((item) => item.id === id);
    if (selected.type === 'Espaço' || selected.type === 'Profissional') {
      closeSheet();
      setTimeout(() => selected.type === 'Profissional' ? professionalSheet(selected) : bookingSheet(id), 180);
      return;
    }
    state.joined.add(id);
    join.textContent = 'Presença confirmada';
    showToast('Vaga confirmada. Adicionamos à sua agenda.');
  }

  const open = event.target.closest('[data-open-sheet]');
  if (open) open.dataset.openSheet === 'publish' ? openPublish() : genericSheet(open.dataset.openSheet);

  const bookTime = event.target.closest('[data-book-time]');
  if (bookTime) {
    document.querySelectorAll('[data-book-time]').forEach((button) => button.classList.remove('selected'));
    bookTime.classList.add('selected');
    document.querySelector('[data-book-confirm]').disabled = false;
    document.querySelector('[data-book-confirm]').dataset.time = bookTime.dataset.bookTime;
  }

  const booking = event.target.closest('[data-book-confirm]');
  if (booking) {
    const reserved = events.find((item) => item.id === Number(booking.dataset.bookConfirm));
    const time = booking.dataset.time;
    document.getElementById('reservationCard').innerHTML = `
      <div>${icon('check')}</div>
      <h2>Reserva confirmada</h2>
      <p>${esc(reserved.title)} · Hoje, ${time}<br>${esc(reserved.location)}</p>
      <button class="secondary-button" type="button" data-event-id="${reserved.id}">Ver espaço</button>`;
    closeSheet();
    navigate('agenda');
    showToast(`Reserva confirmada para ${time}`);
  }

  if (event.target.closest('[data-close-sheet]') || event.target === backdrop) closeSheet();

  const toastTarget = event.target.closest('[data-toast]');
  if (toastTarget) showToast(toastTarget.dataset.toast);

  const sport = event.target.closest('[data-sport]');
  if (sport) {
    document.querySelectorAll('[data-sport]').forEach((button) => button.classList.remove('active'));
    sport.classList.add('active');
    renderHome(sport.dataset.sport, document.getElementById('homeSearch').value);
  }

  const filter = event.target.closest('[data-filter]');
  if (filter) {
    document.querySelectorAll('[data-filter]').forEach((button) => button.classList.remove('active'));
    filter.classList.add('active');
    state.filter = filter.dataset.filter;
    renderExplore();
  }

  const date = event.target.closest('.date-strip button');
  if (date) {
    document.querySelectorAll('.date-strip button').forEach((button) => button.classList.remove('active'));
    date.classList.add('active');
    showToast(`Agenda de ${date.querySelector('strong').textContent}/11 selecionada`);
  }
});

document.addEventListener('submit', (event) => {
  event.preventDefault();
  if (event.target.matches('[data-auth-form="login"]')) return handleLogin(event.target);
  if (event.target.matches('[data-register-form]')) return handleRegister(event.target);
  if (event.target.matches('[data-publish-form]')) return handlePublish(event.target);
  if (event.target.matches('[data-space-edit-form]')) return saveSpaceEdit(event.target);
  if (event.target.matches('[data-location-form]')) {
    closeSheet();
    showToast('Localização atualizada');
  }
  if (event.target.matches('[data-filter-form]')) {
    closeSheet();
    showToast('Filtros aplicados');
  }
});

document.getElementById('homeSearch').addEventListener('input', (event) => {
  renderHome(document.querySelector('.sport-pill.active')?.dataset.sport || 'Todos', event.target.value);
});
document.getElementById('exploreSearch').addEventListener('input', renderExplore);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeSheet();
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-event-id]')) openEvent(event.target.dataset.eventId);
});

renderHome();
renderExplore();
syncThemeButtons();
