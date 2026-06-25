import { Proveedor } from "/Modelos/MProveedor.js";
import { ProveedorService } from "/Service/SProveedor.js";

let ProveedoresEditandoId = null;

/* INFORMACIÓN DE BASE DE DATOS */
async function cargarProveedores() {

    try {

        const Proveedores = await ProveedorService.obtenerTodos();

        const tabla = document.getElementById("tabla-Proveedor");

        tabla.innerHTML = "";

        Proveedores.forEach(Proveedores => {

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${Proveedores.empresa}</td>
                <td>${Proveedores.vendedor}</td>
                <td>${Proveedores.telefono ?? ''}</td>
                <td>${Proveedores.correo ?? ''}</td>
                <td>${Proveedores.direccion ?? ''}</td>
                <td>${Proveedores.activo ? 'Activo' : 'Inactivo'}</td>
                <td>
                    <button class="btn-editar" onclick="editarProveedor(${Proveedores.id})">
                        <i class="fi fi-rs-edit"></i>
                    </button>

                    <button class="btn-eliminar" onclick="eliminarProveedores(${Proveedores.id})">
                        <i class="fi fi-rs-trash"></i>
                    </button>
                </td>
            `;

            tabla.appendChild(fila);

        });

    } catch (error) {

        console.error("Error al cargar los proveedores:", error);

    }
}

/* ELIMINAR PROVEEDOR */
async function eliminarProveedores(id) {

    if (!confirm("¿Deseas eliminar este Proveedor?")) {
        return;
    }

    try {

        const response = await ProveedorService.eliminar(id);

        if (response.ok) {

            alert("Proveedor eliminado correctamente");

            cargarProveedores();

        } else {

            alert("No se pudo eliminar el proveedor");

        }

    } catch (error) {

        console.error(error);

        alert("Error de conexión");

    }

}

/* AGREGAR O EDITAR PROVEEDOR */
async function handleLoginSubmit(event) {

    event.preventDefault();

    const formData = new FormData(event.target);

    const DatosProveedor = new Proveedor(

        formData.get('NombreEmpresa'),
        formData.get('Vendedor'),
        formData.get('Telefono'),
        formData.get('Correo'),
        formData.get('Direccion'),
        formData.get('Estado') === 'true'

    );

    console.log("Proveedor:", DatosProveedor);

    try {

        const response = await ProveedorService.guardar(
            DatosProveedor,
            ProveedoresEditandoId
        );

        if (response.ok) {

            if (ProveedoresEditandoId) {

                alert("Proveedor editado exitosamente");

            } else {

                alert("Proveedor creado exitosamente");

            }

            event.target.reset();

            ProveedoresEditandoId = null;

            document.getElementById("Modal").checked = false;

            cargarProveedores();

        } else {

            const error = await response.text();

            alert(error);

        }

    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor.");

    }

}

/* EDITAR PROVEEDOR */
async function editarProveedor(id) {

    try {

        const Proveedor = await ProveedorService.obtenerPorId(id);

        console.log(Proveedor);

        ProveedoresEditandoId = id;

        document.getElementById("NombreEmpresa").value = Proveedor.empresa;
        document.getElementById("Vendedor").value = Proveedor.vendedor;
        document.getElementById("Telefono").value = Proveedor.telefono;
        document.getElementById("Correo").value = Proveedor.correo;
        document.getElementById("Direccion").value = Proveedor.direccion;
        document.getElementById("Estado").value = Proveedor.activo ? "true" : "false";

        document.getElementById("Modal").checked = true;

    } catch (error) {

        console.error(error);

        alert("Error al obtener proveedor");

    }

}

/* EVENTOS */
document
    .getElementById("formProveedor")
    .addEventListener("submit", handleLoginSubmit);

document.addEventListener("DOMContentLoaded", cargarProveedores);

/* FUNCIONES GLOBALES */
window.eliminarProveedores = eliminarProveedores;
window.editarProveedor = editarProveedor;