import { Cliente } from "/Modelos/MClientes.js";
import { ClienteService } from "/Service/SCliente.js";

let ClienteEditandoId = null;
/* Cargar clientes */
async function cargarCliente() {
    try {
        const clientes = await ClienteService.obtenerTodos();
        const tabla = document.getElementById("tabla-Clientes");
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
                    <button class="btn-editar" onclick="editarCliente(${cliente.id})">
                        <i class="fi fi-rs-edit"></i>
                    </button>

                    <button class="btn-eliminar" onclick="eliminarCliente(${cliente.id})">
                        <i class="fi fi-rs-trash"></i>
                    </button>
                </td>
            `;

            tabla.appendChild(fila);

        });

    }
    catch (error) {
        console.error(error);
    }
}

/* Eliminar */
async function eliminarCliente(id) {
    if (!confirm("¿Deseas eliminar este Cliente?"))
        return;
    const response = await ClienteService.eliminar(id);
    if (response.ok) {
        alert("Cliente eliminado correctamente");
        cargarCliente();
    }
    else {
        alert("No se pudo eliminar el cliente");
    }
}
/* Guardar */
async function handleLoginSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const DatosCliente = new Cliente(
        formData.get("NombreCliente"),
        formData.get("ApellidoCliente"),
        formData.get("CorreoCliente"),
        formData.get("TelefonoCliente"),
        formData.get("EstadoCliente") === "true"
    );
    const response = await ClienteService.guardar(DatosCliente, ClienteEditandoId);
    if (response.ok) {
        alert(ClienteEditandoId ? "Cliente editado exitosamente" : "Cliente creado exitosamente");
        event.target.reset();
        ClienteEditandoId = null;
        document.getElementById("Modal").checked = false;
        cargarCliente();
    }
    else {
        alert(await response.text());
    }
}
/* Editar */
async function editarCliente(id) {
    try {
        const cliente = await ClienteService.obtenerPorId(id);
        ClienteEditandoId = id;
        document.getElementById("NombreCliente").value = cliente.nombre;
        document.getElementById("ApellidoCliente").value = cliente.apellido;
        document.getElementById("TelefonoCliente").value = cliente.telefono;
        document.getElementById("CorreoCliente").value = cliente.email;
        document.getElementById("EstadoCliente").value = cliente.activo ? "true" : "false";
        document.getElementById("Modal").checked = true;
    }
    catch (error) {
        console.error(error);
        alert("Error al obtener el cliente");
    }
}
document
    .getElementById("formCliente")
    .addEventListener("submit", handleLoginSubmit);
document.addEventListener("DOMContentLoaded", cargarCliente);
window.editarCliente = editarCliente;
window.eliminarCliente = eliminarCliente;