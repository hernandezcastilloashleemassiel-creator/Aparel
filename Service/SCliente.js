const baseUrl = "https://localhost:7180/api";

export const ClienteService = {

    // Obtener todos los clientes
    async obtenerTodos() {
        const response = await fetch(`${baseUrl}/Cliente`);
        if (!response.ok) {
            throw new Error("Error al obtener los clientes");
        }
        return await response.json();
    },

    // Obtener cliente por Id
    async obtenerPorId(id) {
        const response = await fetch(`${baseUrl}/Cliente/${id}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }
        return await response.json();
    },

    // Eliminar cliente
    async eliminar(id) {
        return await fetch(`${baseUrl}/Cliente/${id}`, {
            method: "DELETE"
        });

    },

    // Guardar (Insertar o Editar)
    async guardar(cliente, id = null) {
        if (id) {
            return await fetch(`${baseUrl}/Cliente/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cliente)
            });
        }

        return await fetch(`${baseUrl}/Cliente`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });
    }
};