const baseUrl = "https://localhost:7180/api";
let usuarioEditandoId = null;
/* informacion de basededatos*/
    async function cargarUsuarios() {
    try {
        const response = await fetch(`${baseUrl}/Usuario/Lista`);
        if (!response.ok) {
            throw new Error("Error al obtener usuarios");
        }
        const usuarios = await response.json();
        console.log("Usuarios recibidos:", usuarios);
        const tabla = document.getElementById("tabla-usuarios");
            if (!tabla) return; 
            {
        // Limpia la tabla antes de volver a llenarla
        tabla.innerHTML = "";
        usuarios.forEach(usuario => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${usuario.nombreUsuario}</td>
                <td>${usuario.correoUsuario}</td>
                <td>${usuario.cargoUsuario ?? ''}</td>
                <td>
                <button class="btn-editar" onclick="editarUsuario('${usuario.id}')"><i class="fi fi-rs-pencil"></i></button>
                <button class="btn-eliminar" onclick="eliminarUsuario('${usuario.id}')"><i class="fi fi-rs-trash"></i></button>
                </td>
            `;

            tabla.appendChild(fila);
        });
        };

    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}
 /*ELIMINAR USUARIO*/
async function eliminarUsuario(id) {
    if (!confirm("¿Deseas eliminar este usuario?")) {
        return;
    }
    try {
        const response = await fetch(`${baseUrl}/Usuario/Eliminar/${id}`, {
            method: "DELETE"
        });
    if (response.ok) {alert("Usuario eliminado correctamente");
            // Recarga la tabla
            cargarUsuarios();
        } else {
            alert("No se pudo eliminar el usuario");
        }

    } catch (error) {

        console.error(error);
        alert("Error de conexión");

    }
}
/*AGREGAR USUARIO*/
async function handleLoginSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const DatosUsuario = {
        NombreUsuario: formData.get('NombreUsuario'),
        CorreoUsuario: formData.get('CorreoUsuario'),
        CargoUsuario: formData.get('CargoUsuario'),
        ContraseñaUsuario: formData.get('ContraseñaUsuario')
    };
    try {
        let response;
    if (usuarioEditandoId) {
            response = await fetch(
                `${baseUrl}/Usuario/Actualizar/${usuarioEditandoId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(DatosUsuario)
                }
            );
    } else {
            response = await fetch(
                `${baseUrl}/Usuario/Registrar`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(DatosUsuario)
                }
            );
        }

        if (response.ok) {

            if (usuarioEditandoId) {
                alert("Usuario editado exitosamente");
            } else {
                alert("Usuario creado exitosamente");
            }

            event.target.reset();
            usuarioEditandoId = null;
            document.getElementById("Modal").checked = false;
            cargarUsuarios();
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
/*Editar Usuario*/
async function editarUsuario(id) {
    try {
        const response = await fetch(`${baseUrl}/Usuario/Obtener/${id}`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        const usuario = await response.json();

        usuarioEditandoId = id; 

        document.getElementById("NombreUsuario").value = usuario.nombreUsuario;
        document.getElementById("CorreoUsuario").value = usuario.correoUsuario;
        document.getElementById("CargoUsuario").value = usuario.cargoUsuario;

        document.getElementById("Modal").checked = true;

    } catch (error) {
        console.error(error);
        alert("Error al obtener usuario");
    }
}

document
    .getElementById("formUsuario")
    .addEventListener("submit", handleLoginSubmit);
document.addEventListener("DOMContentLoaded", cargarUsuarios);
window.eliminarUsuario = eliminarUsuario;
window.editarUsuario = editarUsuario;