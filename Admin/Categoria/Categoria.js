const baseUrl = "https://localhost:7180/api";

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
                    <button>Editar</button>
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

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(DatosCategoria)
        });

        const data = await response.json();
        console.log("Respuesta API:", data);
        if (response.ok) {
            console.log('Categoria creada:', data);
            alert('Categoria creada exitosamente');
            event.target.reset();
            // Recarga la tabla desde la BD
            cargarCategorias();

        } else {

            alert(
                'Error al crear la categoria: ' +
                (data.message || 'No se pudo crear la categoria')
            );

        }

    } catch (error) {

        console.error('Error de conexión:', error);

        alert('No se pudo conectar con el servidor.');
    }
}
document
    .getElementById('formCategoria')
    .addEventListener('submit', handleLoginSubmit);
document.addEventListener("DOMContentLoaded", cargarCategorias);
window.eliminarCategoria = eliminarCategoria;