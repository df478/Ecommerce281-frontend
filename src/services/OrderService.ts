import OrderDetails from "@/pages/orders/[id]";
import { API_URL } from "../libs/constants";

export const createOrder = async (orderData) => {
  console.log(orderData)
  try {
    const response = await fetch(`${API_URL}/pedido`, {
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
    const storedUserData: any = localStorage.getItem("userData");
    const userData = JSON.parse(storedUserData);
    const newUserData = {
      ...userData,
      id_carrito: data.nuevoCliente.id_carrito,
    };
    
    localStorage.setItem("userData", JSON.stringify(newUserData));

    return data; // Puedes devolver la respuesta si es necesario
  } catch (error) {
    console.error("Error en createOrder:", error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};