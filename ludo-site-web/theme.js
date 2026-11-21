// Modo escuro compartilhado por todas as páginas.
// Aplica o tema salvo o quanto antes (script no <head>) para evitar "flash" branco.
(function () {
    var KEY = 'theme';
    var root = document.documentElement;

    try {
        if (localStorage.getItem(KEY) === 'dark') root.classList.add('dark-theme');
    } catch (e) { /* localStorage indisponível: segue no tema claro */ }

    function isDark() {
        return root.classList.contains('dark-theme');
    }

    function updateButton() {
        var btn = document.getElementById('themeBtn');
        if (!btn) return;
        btn.textContent = isDark() ? '☀️' : '🌙';
        btn.setAttribute('aria-label', isDark() ? 'Ativar modo claro' : 'Ativar modo escuro');
        btn.title = btn.getAttribute('aria-label');
    }

    window.toggleTheme = function () {
        root.classList.toggle('dark-theme');
        try { localStorage.setItem(KEY, isDark() ? 'dark' : 'light'); } catch (e) {}
        updateButton();
    };

    document.addEventListener('DOMContentLoaded', function () {
        // Páginas sem header com botão (login, registro, eventos, comunidade): botão flutuante.
        if (!document.getElementById('themeBtn')) {
            var btn = document.createElement('button');
            btn.id = 'themeBtn';
            btn.type = 'button';
            btn.className = 'theme-button theme-floating';
            btn.addEventListener('click', window.toggleTheme);
            document.body.appendChild(btn);
        }
        updateButton();
    });
})();
