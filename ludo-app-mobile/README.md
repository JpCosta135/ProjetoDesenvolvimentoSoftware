# Ludo — app mobile

```
ludo-app-mobile/
├── index.html          estrutura das telas
├── css/mobile.css      estilos (inclui o modo escuro)
├── js/
│   ├── mobile.js       lógica do app (perfis, cadastro, painéis)
│   └── theme.js        modo escuro compartilhado com o site (chave "theme")
└── assets/
    ├── logo.ico
    ├── logos/          logo usada no topo e no login
    └── images/         fotos de modalidades e espaços
```

## Como usar no repositório
1. Copie a pasta para a raiz do projeto como `mobile/`.
2. No `index.html` do site, troque o link do app: `mobile.html` → `mobile/index.html`.
3. Abra `mobile/index.html` (ou use Live Server). Os links "Voltar ao site web" apontam para `../index.html`.

## Onde mexer
- Trocar uma imagem: substitua o arquivo em `assets/` mantendo o nome, ou altere o caminho no bloco `IMG` no início de `js/mobile.js`.
- Cores e tema escuro: variáveis no início de `css/mobile.css` e bloco "Modo escuro" no final.
- Perfis e campos de cadastro: constantes `ROLES`, `REGISTER` e `SPACE_FIELDS` em `js/mobile.js`.
