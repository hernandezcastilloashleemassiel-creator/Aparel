const baseUrl = "https://localhost:7180/api";
let categoriaEditandoId = null;

/* informacion de basededatos*/
    async function cargarCategorias() {
    try {
        const response = await fetch(`${baseUrl}/Categoria`);
        if (!response.ok) {
            throw new Error("Error al obtener categorías");
        }
        const categorias = await response.json();
        const tabla = document.getElementById("tabla-categorias");

        // Limpia la tabla antes de volver a llenarla
        tabla.innerHTML = "";
        categorias.forEach(categoria => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${categoria.id}</td>
                <td>${categoria.nombreCategoria}</td>
                <td>${categoria.descripcion}</td>
                <td>${categoria.estado == 1 ? 'Activo' : 'Inactivo'}</td>
                <td>
                    <button onclick="editarCategoria('${categoria.id}')">Editar</button>
                    <button onclick="eliminarCategoria(${categoria.id})">Eliminar </button>
                </td>
            `;

            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }
}
 /*ELIMINAR CATEGORIA*/
async function eliminarCategoria(id) {
    if (!confirm("¿Deseas eliminar esta categoría?")) {
        return;
    }
    try {
        const response = await fetch(`${baseUrl}/Categoria/${id}`, {
            method: "DELETE"
        });
    if (response.ok) {alert("Categoría eliminada correctamente");
            // Recarga la tabla
            cargarCategorias();
        } else {
            alert("No se pudo eliminar la categoría");
        }

    } catch (error) {

        console.error(error);
        alert("Error de conexión");

    }
}

/*AGREGAR CATEGORIA*/
async function handleLoginSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const DatosCategoria = {
        NombreCategoria: formData.get('NombreCategoria'),
        Descripcion: formData.get('DescripcionCategoria'),
        Estado: formData.get('EstadoCategoria') === 'true' ? 1 : 0
    };
         console.log('Categoria:', DatosCategoria);
         const endpoint = `${baseUrl}/Categoria`;

    try {
        let response;
    if (categoriaEditandoId) {
            response = await fetch(
                `${baseUrl}/Categoria/${categoriaEditandoId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(DatosCategoria)
                }
            );
    } else {
            response = await fetch(
                `${baseUrl}/Categoria`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(DatosCategoria)
                }
            );
        }

        if (response.ok) {

            if (categoriaEditandoId) {
                alert("Categoria editada exitosamente");
            } else {
                alert("Categoria creada exitosamente");
            }

            event.target.reset();
            categoriaEditandoId = null;
            document.getElementById("Modal").checked = false;
            cargarCategorias();
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
/*Editar Categoria*/
async function editarCategoria(id) {
    try {
        const response = await fetch(`${baseUrl}/Categoria/${id}`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        const Categoria = await response.json();
        console.log(Categoria);

        categoriaEditandoId = id; 

        document.getElementById("NombreCategoria").value = Categoria.nombreCategoria;
        document.getElementById("DescripcionCategoria").value = Categoria.descripcion;

        document.getElementById("Modal").checked = true;

    } catch (error) {
        console.error(error);
        alert("Error al obtener categoria");
    }
}

document
    .getElementById('formCategoria')
    .addEventListener('submit', handleLoginSubmit);
document.addEventListener("DOMContentLoaded", cargarCategorias);
window.eliminarCategoria = eliminarCategoria;
window.editarCategoria = editarCategoria;