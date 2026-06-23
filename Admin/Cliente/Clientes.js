const baseUrl = "https://localhost:7180/api";
let ClienteEditandoId = null;
/* informacion de basededatos*/
    async function cargarCliente() {
    try {
        const response = await fetch(`${baseUrl}/Cliente`);
        if (!response.ok) {
            throw new Error("Error al obtener los clientes");
        }
        const clientes = await response.json();
        const tabla = document.getElementById("tabla-Clientes");

        // Limpia la tabla antes de volver a llenarla
        tabla.innerHTML = "";
        
         clientes.forEach(cliente => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.email ?? ''}</td>
                <td>${cliente.telefono ?? ''}</td>
                <td>${cliente.activo ? 'Activo' : 'Inactivo'}</td>
            <td>
                <button onclick="editarCliente(${cliente.id})"><i class="fi fi-rs-edit"></i></button>
                <button onclick="eliminarCliente(${cliente.id})"><i class="fi fi-rs-trash"></i></button>
            </td>
            `;

            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar los clientes:", error);
    }
}
 /*ELIMINAR CLIENTES*/
async function eliminarCliente(id) {
    if (!confirm("¿Deseas eliminar este Cliente?")) {
        return;
    }
    try {
        const response = await fetch(`${baseUrl}/Cliente/${id}`, {
            method: "DELETE"
        });
    if (response.ok) {alert("Cliente eliminado correctamente");
            // Recarga la tabla
            cargarCliente();
        } else {
            alert("No se pudo eliminar el cliente");
        }

    } catch (error) {

        console.error(error);
        alert("Error de conexión");

    }
}

/*AGREGAR CLIENTE*/
async function handleLoginSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const DatosCliente = {
        nombre: formData.get('NombreCliente'),
        apellido: formData.get('ApellidoCliente'),
        email: formData.get('CorreoCliente'),
        telefono: formData.get('TelefonoCliente'),
        activo: formData.get('EstadoCliente') === 'true' 
    };
         console.log('Cliente:', DatosCliente);
         const endpoint = `${baseUrl}/Cliente`;

    try {
        let response;
    if (ClienteEditandoId) {
            response = await fetch(
                `${baseUrl}/Cliente/${ClienteEditandoId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(DatosCliente)
                }
            );
    } else {
            response = await fetch(
                `${baseUrl}/Cliente`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(DatosCliente)
                }
            );
        }

        if (response.ok) {

            if (ClienteEditandoId) {
                alert("Cliente editado exitosamente");
            } else {
                alert("Cliente creado exitosamente");
            }

            event.target.reset();
            ClienteEditandoId = null;
            document.getElementById("Modal").checked = false;
            cargarCliente();
        }
        else {
            const error = await response.text();
            alert(error);
        }

    } catch (error) {
        console.error(error);
        alert("No se pudo conectar con el servidor.");
    }
}
/*Editar Cliente*/
async function editarCliente(id) {
    try {
        const response = await fetch(`${baseUrl}/Cliente/${id}`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        const Cliente = await response.json();
        console.log(Cliente);

        ClienteEditandoId = id; 

        document.getElementById("NombreCliente").value = Cliente.nombre;
        document.getElementById("ApellidoCliente").value = Cliente.apellido;
        document.getElementById("TelefonoCliente").value = Cliente.telefono;
        document.getElementById("CorreoCliente").value = Cliente.email;
        document.getElementById("Modal").checked = true;

    } catch (error) {
        console.error(error);
        alert("Error al obtener categoria");
    }
}

document
    .getElementById('formCliente')
    .addEventListener('submit', handleLoginSubmit);
document.addEventListener("DOMContentLoaded", cargarCliente);
window.eliminarCliente = eliminarCliente;
window.editarCliente = editarCliente;