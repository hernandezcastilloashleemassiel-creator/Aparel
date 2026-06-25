const baseUrl = "https://localhost:7180/api";

export const ProveedorService = {

    // Obtener todos los proveedores
    async obtenerTodos() {

        const response = await fetch(`${baseUrl}/Proveedor`);

        if (!response.ok) {
            throw new Error("Error al obtener los Proveedores");
        }

        return await response.json();

    },

    // Obtener proveedor por Id
    async obtenerPorId(id) {

        const response = await fetch(`${baseUrl}/Proveedor/${id}`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        return await response.json();

    },

    // Eliminar proveedor
    async eliminar(id) {

        return await fetch(`${baseUrl}/Proveedor/${id}`, {

            method: "DELETE"

        });

    },

    // Guardar (Insertar o Editar)
    async guardar(proveedor, id = null) {

        if (id) {

            return await fetch(`${baseUrl}/Proveedor/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(proveedor)

            });

        }

        return await fetch(`${baseUrl}/Proveedor`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(proveedor)

        });

    }

};