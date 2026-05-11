document.addEventListener("DOMContentLoaded", function(){

    let productos = [];

    // AGREGAR PRODUCTO
    document.getElementById("btnagregarproducto").addEventListener("click", function(){

        const nombre = document.getElementById("nombreProducto").value;
        const cantidad = document.getElementById("cantidadProducto").value;
        const precio = document.getElementById("precioProducto").value;

        if(nombre === "" || cantidad === "" || precio === ""){
            alert("Completa todos los campos");
            return;
        }

        const total = cantidad * precio;

        productos.push({nombre, cantidad, precio, total});

        mostrarProductos();

        document.getElementById("nombreProducto").value = "";
        document.getElementById("cantidadProducto").value = "";
        document.getElementById("precioProducto").value = "";
    });

    // MOSTRAR PRODUCTOS
    function mostrarProductos(){
        const tabla = document.getElementById("tabla-productos");
        tabla.innerHTML = "";
        let totalGeneral = 0;

        productos.forEach((p, index) => {
            const fila = document.createElement("tr");
            totalGeneral += p.total;

            fila.innerHTML = `
                <td>${p.nombre}</td>
                <td>${p.cantidad}</td>
                <td>${p.precio}</td>
                <td>${p.total}</td>
                <td><button onclick="eliminarProducto(${index})">Eliminar</button></td>
            `;

            tabla.appendChild(fila);
        });
        document.getElementById("totalGeneral").textContent = totalGeneral;
    }

    // ELIMINAR
    window.eliminarProducto = function(index){
        productos.splice(index, 1);
        mostrarProductos();
    }
});