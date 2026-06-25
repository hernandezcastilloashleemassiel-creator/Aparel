const baseUrl = "https://localhost:7180/api";
let ProductoEditandoId = null;

/* CARGAR PRODUCTOS */
async function cargarProducto() {
    try {
        const response = await fetch(`${baseUrl}/Producto`);

        if (!response.ok) {
            throw new Error("Error al obtener productos");
        }
        const productos = await response.json();
        const tabla = document.getElementById("tabla-Producto");

        if (!tabla) return;

        tabla.innerHTML = "";

        productos.forEach(producto => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.precio}</td>
                <td>${producto.nombreCategoria ? producto.nombreCategoria : "Sin categoría"}</td>
                <td>${producto.stock}</td>
                <td>${producto.activo ? 'Activo' : 'Inactivo'}</td>
                <td>
                    <button class="btn-editar" onclick="editarProducto(${producto.id})"><i class="fi fi-rs-pencil"></i></button>
                    <button class="btn-eliminar" onclick="eliminarProductos(${producto.id})"><i class="fi fi-rs-trash"></i></button>
                </td>
            `;

            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar productos", error);
    }
}

/* CARGAR CATEGORÍAS EN EL SELECT */
async function cargarCategorias() {
    try {
        const response = await fetch(`${baseUrl}/Categoria`);

        if (!response.ok) {
            throw new Error("Error al obtener las categorías");
        }

        const categorias = await response.json();
        const selectCategoria = document.getElementById("Categoria");

        if (!selectCategoria) return;

        // Opción por defecto
        selectCategoria.innerHTML = '<option value="">-- Seleccione una categoría --</option>';

        // Llenar el select con los datos de la API
      categorias.forEach(categoria => {
    const option = document.createElement("option");
    option.value = categoria.id;
    option.textContent = categoria.nombreCategoria;
    selectCategoria.appendChild(option);
});

    } catch (error) {
        console.error("Error al cargar categorías", error);
    }
}

/* ELIMINAR */
async function eliminarProductos(id) {
    if (!confirm("¿Deseas eliminar el producto?")) return;

    try {
        const response = await fetch(`${baseUrl}/Producto/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Producto eliminado correctamente");
            cargarProducto();
        } else {
            alert("No se pudo eliminar el producto");
        }

    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
}

/* AGREGAR */
async function handleLoginSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

   const datosProducto = {
        categoriaId: parseInt(formData.get('Categoria')), 
        nombre: formData.get('NombreProducto'),
        descripcion: formData.get('DescripcionProducto'),
        precio: parseFloat(formData.get('PrecioProducto')),
        Stock: parseInt(formData.get('Stock')), 
        activo: formData.get('EstadoCategoria') === 'true'
    };

    try {
        let response;

        if (ProductoEditandoId) {
            response = await fetch(`${baseUrl}/Producto/${ProductoEditandoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosProducto)
            });
        } else {
            response = await fetch(`${baseUrl}/Producto`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosProducto)
            });
        }

        if (response.ok) {
            alert(ProductoEditandoId ? "Producto editado Correctamente" : "Producto creado Correctamente");

            event.target.reset();
            ProductoEditandoId = null;

            document.getElementById("Modal").checked = false;

            cargarProducto();
        } else {
            const error = await response.text();
            alert(error);
        }

    } catch (error) {
        console.error(error);
        alert("No se pudo conectar con el servidor.");
    }
}

/* EDITAR */
async function editarProducto(id) {
    try {
        const response = await fetch(`${baseUrl}/Producto/${id}`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        const producto = await response.json();

        ProductoEditandoId = id;

        document.getElementById("NombreProducto").value = producto.nombre;
        document.getElementById("DescripcionProducto").value = producto.descripcion;
        document.getElementById("Categoria").value = producto.categoriaId;
        document.getElementById("PrecioProducto").value = producto.precio;
        document.getElementById("Stock").value = producto.stock;

        document.getElementById("Modal").checked = true;

    } catch (error) {
        console.error(error);
        alert("Error al obtener el producto");
    }
}

/* EVENTOS */
document.getElementById('formProducto')
    .addEventListener('submit', handleLoginSubmit);

document.addEventListener("DOMContentLoaded", () => {
    cargarProducto();
    cargarCategorias(); 
});

window.eliminarProductos = eliminarProductos;
window.editarProducto = editarProducto;