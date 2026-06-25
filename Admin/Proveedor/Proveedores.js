const baseUrl = "https://localhost:7180/api";
let ProveedoresEditandoId = null;
/* informacion de basededatos*/
    async function cargarProveedores() {
    try {
        const response = await fetch(`${baseUrl}/Proveedor`);
        if (!response.ok) {
            throw new Error("Error al obtener los Proveedores");
        }
        const Proveedores = await response.json();
        const tabla = document.getElementById("tabla-Proveedor");

        // Limpia la tabla antes de volver a llenarla
        tabla.innerHTML = "";
        
         Proveedores.forEach(Proveedores => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${Proveedores.empresa}</td>
                <td>${Proveedores.vendedor}</td>
                <td>${Proveedores.telefono ?? ''}</td>
                <td>${Proveedores.correo ?? ''}</td> 
                <td>${Proveedores.direccion ?? ''} </td>
                <td>${Proveedores.activo ? 'Activo' : 'Inactivo'}</td>
            <td>
                <button class="btn-editar" onclick="editarProveedor(${Proveedores.id})"><i class="fi fi-rs-edit"></i></button>
                <button class="btn-eliminar" onclick="eliminarProveedores(${Proveedores.id})"><i class="fi fi-rs-trash"></i></button>
            </td>
            `;

            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar los proveedores:", error);
    }
}
 /*ELIMINAR PROVEEDORES*/
async function eliminarProveedores(id) {
    if (!confirm("¿Deseas eliminar este Proveedor?")) {
        return;
    }
    try {
        const response = await fetch(`${baseUrl}/Proveedor/${id}`, {
            method: "DELETE"
        });
    if (response.ok) {alert("Proveedor eliminado correctamente");
            // Recarga la tabla
            cargarProveedores();
        } else {
            alert("No se pudo eliminar el proveedor");
        }

    } catch (error) {

        console.error(error);
        alert("Error de conexión");

    }
}

/*AGREGAR PROVEEDOR*/
async function handleLoginSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const DatosProveedor = {
        Empresa: formData.get('NombreEmpresa'),
        Vendedor: formData.get('Vendedor'),
        telefono: formData.get('Telefono'),
        Correo: formData.get('Correo'),
        Direccion: formData.get ('Direccion'),
      activo: formData.get('Estado') === 'true'
    };
         console.log('Proveedor:', DatosProveedor);
         const endpoint = `${baseUrl}/Proveedor`;

    try {
        let response;
    if (ProveedoresEditandoId) {
            response = await fetch(
                `${baseUrl}/Proveedor/${ProveedoresEditandoId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(DatosProveedor)
                }
            );
    } else {
            response = await fetch(
                `${baseUrl}/Proveedor`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(DatosProveedor)
                }
            );
        }

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
/*Editar proveedor*/
async function editarProveedor(id) {
    try {
        const response = await fetch(`${baseUrl}/Proveedor/${id}`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        const Proveedor = await response.json();
        console.log(Proveedor);

        ProveedorEditandoId = id; 

        document.getElementById("NombreEmpresa").value = Proveedor.Empresa;
        document.getElementById("Vendedor").value = Proveedor.Vendedor;
        document.getElementById("Telefono").value = Proveedor.telefono;
        document.getElementById("Correo").value = Proveedor.Correo;
        document.getElementById("Direccion").value = Proveedor.Direccion;
        document.getElementById("Modal").checked = true;

    } catch (error) {
        console.error(error);
        alert("Error al obtener proveedor");
    }
}

document
    .getElementById('formProveedor')
    .addEventListener('submit', handleLoginSubmit);
document.addEventListener("DOMContentLoaded", cargarProveedores);
window.eliminarProveedores = eliminarProveedores;
window.editarProveedor = editarProveedor;