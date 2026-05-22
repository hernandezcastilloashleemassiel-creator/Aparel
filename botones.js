document.addEventListener("DOMContentLoaded", function(){

    let productos = [];

    // AGREGAR PRODUCTO
    document.getElementById("btnagregarproducto").addEventListener("click", function(){

        const nombre = document.getElementById("nombreProducto").value;
        const categoria = document.getElementById("CategoriaProducto").value;
        const cantidad = document.getElementById("cantidadProducto").value;
        const preciound = document.getElementById("precioundProducto").value;

        if(nombre === "" || categoria === "" || cantidad === "" || preciound === ""){
            alert("Completa todos los campos");
            return;
        }

        const total = cantidad * preciound;

        productos.push({nombre, categoria ,cantidad, preciound, total});

        mostrarProductos();

        document.getElementById("nombreProducto").value = "";
        document.getElementById("CategoriaProducto").value = "";
        document.getElementById("cantidadProducto").value = "";
        document.getElementById("precioundProducto").value = "";
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
                <td>${p.categoria}</td>
                <td>${p.cantidad}</td>
                <td>${p.preciound}</td>
                <td>${p.total}</td>
                <td><button onclick="eliminarProducto(${index})"> <i class="fi fi-rs-trash"></i></button>
                <button onclick="editarProducto(${index})"> <i class="fi fi-rs-edit"></i></button></td>
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
     // EDITAR
    window.editarProducto = function(index){
        let productos = productos(index);
        let nuevacantidad = perseInt(prompt("", productos.cantidad));
        if (nuevacantidad) {
            productos[index].cantidad = nuevacantidad;
        mostrarProductos();
        }
    }

});