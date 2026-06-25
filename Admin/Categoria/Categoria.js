const baseUrl = "https://localhost:7180/api";
let categoriaEditandoId = null;

/* informacion de basededatos*/
async function cargarTablaCategorias() {

    try {

        const response = await fetch(`${baseUrl}/Categoria`);

        if (!response.ok) {
            throw new Error("Error al obtener categorías");
        }

        const categorias = await response.json();

        const tabla = document.getElementById("tabla-categorias");

        tabla.innerHTML = "";

        categorias.forEach(categoria => {

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${categoria.nombreCategoria}</td>
                <td>${categoria.descripcion}</td>
                <td>${categoria.estado == 1 ? 'Activo' : 'Inactivo'}</td>
                <td>
                    <button class="btn-editar" onclick="editarCategoria(${categoria.id})">
                        <i class="fi fi-rs-pencil"></i>
                    </button>

                    <button class="btn-eliminar" onclick="eliminarCategoria(${categoria.id})">
                        <i class="fi fi-rs-trash"></i>
                    </button>
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

        if (response.ok) {

            alert("Categoría eliminada correctamente");

            cargarTablaCategorias();

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

        nombreCategoria: formData.get('NombreCategoria'),
        descripcion: formData.get('DescripcionCategoria'),
        estado: formData.get('EstadoCategoria') === 'true' ? 1 : 0

    };

    console.log('Categoria:', DatosCategoria);

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

            cargarTablaCategorias();

            cargarSelectCategorias();

        } else {

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

        const categoria = await response.json();

        console.log(categoria);

        categoriaEditandoId = id;

        document.getElementById("NombreCategoria").value =
            categoria.nombreCategoria;

        document.getElementById("DescripcionCategoria").value =
            categoria.descripcion;

        document.getElementById("EstadoCategoria").value =
            categoria.estado == 1 ? "true" : "false";

        document.getElementById("Modal").checked = true;

    } catch (error) {

        console.error(error);

        alert("Error al obtener categoria");

    }
}

/*CARGAR CATEGORIAS EN SELECT*/
async function cargarSelectCategorias() {

    try {

        const response = await fetch(`${baseUrl}/Categoria`);

        if (!response.ok) {
            throw new Error();
        }

        const categorias = await response.json();

        const select =
            document.getElementById("CategoriaProducto");

        if (!select) return;

        select.innerHTML =
            '<option value="">Seleccione una categoría</option>';

        categorias.forEach(categoria => {

            select.innerHTML += `
                <option value="${categoria.id}">
                    ${categoria.nombreCategoria}
                </option>
            `;
        });

    } catch (error) {

        console.error(error);

    }
}

/*CARGAR INFORMACION AL INICIAR*/
document.addEventListener("DOMContentLoaded", () => {

    if (typeof cargarProducto === "function") {
        cargarProducto();
    }

    cargarTablaCategorias();

    cargarSelectCategorias();

});

/*EVENTO DEL FORMULARIO*/
document
    .getElementById('formCategoria')
    .addEventListener('submit', handleLoginSubmit);

/*FUNCIONES GLOBALES*/
window.eliminarCategoria = eliminarCategoria;
window.editarCategoria = editarCategoria;