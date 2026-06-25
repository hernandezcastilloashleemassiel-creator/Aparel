const baseUrl = "https://localhost:7180/api";

export const CategoriaService = {

    // Obtener todas las categorías
    async obtenerTodas() {
        const response = await fetch(`${baseUrl}/Categoria`);
        if (!response.ok) {
            throw new Error("Error al obtener categorías");
        }
        return await response.json();
    },

    // Obtener categoría por id
    async obtenerPorId(id) {
        const response = await fetch(`${baseUrl}/Categoria/${id}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }
        return await response.json();
    },

    // Eliminar
    async eliminar(id) {
        return await fetch(`${baseUrl}/Categoria/${id}`, {
            method: "DELETE"
        });
    },

    // Guardar (Insertar o Editar)
    async guardar(categoria, id = null) {
        if (id) {
            return await fetch(`${baseUrl}/Categoria/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(categoria)
            });
        }

        return await fetch(`${baseUrl}/Categoria`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(categoria)
        });
    }
};