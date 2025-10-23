document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            messageDiv.textContent = data.message;
            messageDiv.className = 'message success';
            
            
            localStorage.setItem('username', data.username);
            
            
            setTimeout(() => {
                window.location.href = '/welcome';
            }, 1000);
        } else {
            
            console.log('Error de autenticación: Credenciales incorrectas');
            console.log('Usuario intentado:', username);
            console.log('Mensaje del servidor:', data.message);
            
            
            alert(' Error: ' + data.message);
            
            messageDiv.textContent = data.message;
            messageDiv.className = 'message error';
            
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }
    } catch (error) {
        messageDiv.textContent = 'Error al conectar con el servidor';
        messageDiv.className = 'message error';
    }
});


document.getElementById('username').addEventListener('input', () => {
    document.getElementById('message').style.display = 'none';
});

document.getElementById('password').addEventListener('input', () => {
    document.getElementById('message').style.display = 'none';
});
