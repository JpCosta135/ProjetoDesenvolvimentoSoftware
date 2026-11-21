function showMessage(message, type) {
    const existingMessage = document.querySelector('.success-message, .error-message');
    if (existingMessage) existingMessage.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type + '-message';
    messageDiv.textContent = message;
    
    const form = document.querySelector('.auth-form');
    form.insertBefore(messageDiv, form.firstChild);
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const cpf = document.getElementById('loginCpf').value;
    
    if (email && cpf) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.cpf === cpf);
        
        if (user) {
            showMessage('Login realizado com sucesso!', 'success');
            setTimeout(() => {
                localStorage.setItem('loggedUser', JSON.stringify(user));
                window.location.href = '../../index.html';
            }, 1500);
        } else {
            showMessage('E-mail ou CPF incorretos!', 'error');
        }
    }
}