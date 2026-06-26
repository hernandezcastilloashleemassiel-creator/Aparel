const baseUrl = "https://localhost:7180/api";

const selectProducto = document.getElementById("Producto");
const descInput = document.getElementById("DescripcionProducto");
const catInput = document.getElementById("CategoriaProducto");
const precioInput = document.getElementById("precioundProducto");
const cantidadInput = document.getElementById("cantidadProducto");
const btnAgregar = document.getElementById("btnagregarproducto");
const tbodyTabla = document.getElementById("tabla-productos");
const detalleFactura = document.getElementById("detalleFactura");

let listaProductosFactura = [];

/* 1. CARGAR PRODUCTOS */
async function cargarProducto() {
    try {
        const response = await fetch(`${baseUrl}/Producto`);
        if (!response.ok) throw new Error("Error al obtener productos");

        const productos = await response.json();
        selectProducto.innerHTML = '<option value="">-- Seleccione un producto --</option>';

        productos.forEach(p => {
            const option = document.createElement("option");
            option.value = p.id;
            option.textContent = p.nombre;
            option.dataset.info = JSON.stringify(p);
            selectProducto.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}

/* 2. AUTOCOMPLETAR AL SELECCIONAR */
selectProducto.addEventListener("change", (e) => {
    const opt = e.target.options[e.target.selectedIndex];
    if (!opt.value) {
        descInput.value = ""; catInput.value = ""; precioInput.value = "";
        return;
    }
    
    const p = JSON.parse(opt.dataset.info);
    console.log("Datos del producto:", p);
    descInput.value = p.descripcion || "";
    catInput.value = p.nombreCategoria ?? "";
    precioInput.value = p.precio || 0;
});

/* 3. AGREGAR PRODUCTO A TABLA */
btnAgregar.addEventListener("click", () => {
    const id = parseInt(selectProducto.value);
    const nombre = selectProducto.options[selectProducto.selectedIndex].text;
    const precio = parseFloat(precioInput.value);
    const cantidad = parseInt(cantidadInput.value);
    const opt = selectProducto.options[selectProducto.selectedIndex];
    const producto = JSON.parse(opt.dataset.info);

    if (!id || !cantidad || cantidad <= 0) {
        alert("Seleccione un producto y cantidad válida");
        return;
    }

    if 
    (cantidad > producto.stock) {
    alert(`Solo hay ${producto.stock} unidades disponibles`);
    return;
    }

    const existe = listaProductosFactura.find(x => x.productoId === id);
    if (existe) {
    alert("Este producto ya fue agregado a la factura");
    return;
    }

    const nuevoDetalle = {
        productoId: id,
        descripcion: nombre,
        cantidad: cantidad,
        precioUnitario: precio,
        descuento: 0,
        stock: producto.stock,
        nombreCategoria: producto.nombreCategoria
    };

    listaProductosFactura.push(nuevoDetalle);
    
    renderizarTabla();
    limpiarCampos();
});

/* EDITAR CANTIDADES */
function renderizarTabla() {
    tbodyTabla.innerHTML = "";
    listaProductosFactura.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.descripcion}</td>
            <td>${item.nombreCategoria}</td>
        <td> <input
        type="number"
        value="${item.cantidad}"
        min="1"
        max="${item.stock}"
        onchange="actualizarCantidad(${index}, this.value)">
        </td>
            <td>C$ ${item.precioUnitario.toFixed(2)}</td>
            <td>C$ ${(item.precioUnitario * item.cantidad).toFixed(2)}</td>
            <td><button class="btn-eliminar" onclick="eliminarFila(${index})"><i class="fi fi-rs-trash"></i></button></td>
        `;
        tbodyTabla.appendChild(row);
    });
}

window.actualizarCantidad = (index, nuevaCantidad) => {

    nuevaCantidad = parseInt(nuevaCantidad);

    if (nuevaCantidad > listaProductosFactura[index].stock) {
        alert(`Solo hay ${listaProductosFactura[index].stock} unidades disponibles`);

        nuevaCantidad = listaProductosFactura[index].stock;
    }

    if (nuevaCantidad < 1) {
        nuevaCantidad = 1;
    }

    listaProductosFactura[index].cantidad = nuevaCantidad;

    renderizarTabla();
};

window.eliminarFila = (index) => {
    listaProductosFactura.splice(index, 1);
    renderizarTabla();
};

function limpiarCampos() {
    selectProducto.value = ""; descInput.value = "";
    catInput.value = ""; precioInput.value = ""; cantidadInput.value = "";
}

function mostrarFactura() {

    let total = 0;

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
    `;

    listaProductosFactura.forEach(item => {

        const subtotal = item.cantidad * item.precioUnitario;
        total += subtotal;

        html += `
            <tr>
                <td>${item.descripcion}</td>
                <td>${item.cantidad}</td>
                <td>C$ ${item.precioUnitario.toFixed(2)}</td>
                <td>C$ ${subtotal.toFixed(2)}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>

        <h3>Total: C$ ${total.toFixed(2)}</h3>
    `;

    detalleFactura.innerHTML = html;
}

function imprimirFacturaPDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20;
    let total = 0;

    doc.setFontSize(18);
    doc.text("APPAREL", 80, y);

    y += 10;
    doc.setFontSize(14);
    doc.text("FACTURA", 85, y);

    y += 15;
    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 15, y);

    y += 15;

    doc.text("Producto", 15, y);
    doc.text("Cant.", 90, y);
    doc.text("Precio", 120, y);
    doc.text("Subtotal", 160, y);

    y += 8;

    listaProductosFactura.forEach(item => {

        const subtotal = item.cantidad * item.precioUnitario;
        total += subtotal;

        doc.text(item.descripcion, 15, y);
        doc.text(item.cantidad.toString(), 90, y);
        doc.text(`C$ ${item.precioUnitario.toFixed(2)}`, 120, y);
        doc.text(`C$ ${subtotal.toFixed(2)}`, 160, y);

        y += 8;
    });

    y += 10;

    doc.setFontSize(14);
    doc.text(`TOTAL: C$ ${total.toFixed(2)}`, 130, y);

    doc.save("Factura.pdf");
}

window.generarFactura = async () => {
    if (listaProductosFactura.length === 0) return alert("Agregue productos primero");

mostrarFactura();

    const facturaData = {
        clienteId: null,
        fecha: new Date().toISOString(),
        detalleFacturaDTOs: listaProductosFactura
    };

   try {
    const response = await fetch(`${baseUrl}/Factura`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(facturaData)
    });

    const resultado = await response.json();

    console.log("Respuesta backend factura:", resultado);

    if (!response.ok) {
        alert(resultado.message.join("\n"));
        return;
    }

    alert("Factura generada con éxito");
imprimirFacturaPDF();
    listaProductosFactura = [];
    renderizarTabla();
    detalleFactura.innerHTML = "";

} catch (error) {
    console.error("Error:", error);
}
};

document.addEventListener("DOMContentLoaded", cargarProducto);
document.getElementById("Factura").addEventListener("change", function () {

    if (this.checked) {
        mostrarFactura();
    }

});