const API_URL = "https://tu-api.com/pedidos";

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Error al crear el pedido");
    }

    const data = await response.json();
    return data; // Puedes devolver la respuesta si es necesario
  } catch (error) {
    console.error("Error en createOrder:", error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};