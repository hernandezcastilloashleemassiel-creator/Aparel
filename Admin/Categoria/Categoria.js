import { Categoria } from "/Modelos/MCategoria.js";
import { CategoriaService } from "/Service/SCategoria.js";

let categoriaEditandoId = null;

/* INFORMACIÓN DE BASE DE DATOS */
async function cargarTablaCategorias() {
    try {
        const categorias = await CategoriaService.obtenerTodas();
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

/* ELIMINAR CATEGORÍA */
async function eliminarCategoria(id) {
    if (!confirm("¿Deseas eliminar esta categoría?")) {
        return;
    }
    try {
        const response = await CategoriaService.eliminar(id);
        if (response.ok) {
            alert("Categoría eliminada correctamente");
            cargarTablaCategorias();
            cargarSelectCategorias();
        } else {
            alert("No se pudo eliminar la categoría");
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
}

/* AGREGAR O EDITAR CATEGORÍA */
async function handleLoginSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const DatosCategoria = new Categoria(
        formData.get('NombreCategoria'),
        formData.get('DescripcionCategoria'),
        formData.get('EstadoCategoria') === 'true' ? 1 : 0
    );
    console.log("Categoria:", DatosCategoria);
    try {
        const response = await CategoriaService.guardar(
            DatosCategoria,
            categoriaEditandoId
        );
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

/* EDITAR CATEGORÍA */
async function editarCategoria(id) {
    try {
        const categoria = await CategoriaService.obtenerPorId(id);
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

/* CARGAR CATEGORÍAS EN EL SELECT */
async function cargarSelectCategorias() {
    try {
        const categorias = await CategoriaService.obtenerTodas();
        const select = document.getElementById("CategoriaProducto");

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

/* CARGAR INFORMACIÓN  */
document.addEventListener("DOMContentLoaded", () => {
    if (typeof cargarProducto === "function") {
        cargarProducto();
    }
    cargarTablaCategorias();
    cargarSelectCategorias();
});

document
    .getElementById("formCategoria")
    .addEventListener("submit", handleLoginSubmit);
window.eliminarCategoria = eliminarCategoria;
window.editarCategoria = editarCategoria;