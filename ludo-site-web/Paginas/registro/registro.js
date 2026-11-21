function showMessage(message, type) {
    const existingMessage = document.querySelector('.success-message, .error-message');
    if (existingMessage) existingMessage.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type + '-message';
    messageDiv.textContent = message;
    
    const form = document.querySelector('.auth-form');
    form.insertBefore(messageDiv, form.firstChild);
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const cpf = document.getElementById('registerCpf').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === email)) {
        showMessage('E-mail já cadastrado!', 'error');
        return;
    }
    
    if (users.find(u => u.cpf === cpf)) {
        showMessage('CPF já cadastrado!', 'error');
        return;
    }
    
    users.push({ name, email, phone, cpf });
    localStorage.setItem('users', JSON.stringify(users));
    
    showMessage('Cadastro realizado com sucesso!', 'success');
    setTimeout(() => {
        window.location.href = '../login/login.html';
    }, 1500);
}