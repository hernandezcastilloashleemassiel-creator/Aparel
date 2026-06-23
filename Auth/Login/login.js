const baseUrl = "https://localhost:7180/api";

    function handlechangetitle(event) {
        if (event.key === 'Enter') {
            document.querySelector('.subtitle').textContent = 'Bienvenido, admin';
        }
    }

async function handleLoginSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const login = Object.fromEntries(formData.entries());

    console.log(login);

    console.log('Login data:', login);
    const endpoint = `${baseUrl}/Usuario/Login`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(login)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Login successful:', data);
            localStorage.setItem('token', data.token); 
            window.location.href = "../../Dashboard/Panel.html"; 
        } else {
            alert('Login failed: ' + (data.message || 'Credenciales incorrectas'));
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        alert('No se pudo conectar con el servidor.');
    }
}

document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);