"use client";
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context";
import { useRouter } from "next/navigation";
import { API_URL } from "@/libs/constants";

const CartItem = ({ item }) => {
  const { cart, setCart, setNumberOfProductsInCart } = useAppContext();
  const router = useRouter();

  // Lógica para obtener el stock disponible del producto (asegúrate de que esté en 'item')
  const stock_producto = item.stock_producto; // Aquí se debe utilizar el stock del producto

  const handleRemoveFromCart = async (id_producto) => {
    const storedUserData: any = localStorage.getItem("userData");
    const userData = JSON.parse(storedUserData);

    try {
      const response = await fetch(
        `${API_URL}/carrito/producto/${userData.id_carrito}/${id_producto}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Agrega más encabezados si es necesario, como tokens de autorización
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      // Actualiza el carrito en el contexto después de eliminar el producto
      setCart((prevCart) => {
        const updatedCart = prevCart.filter(
          (item) => item.id_producto !== id_producto
        );
        setNumberOfProductsInCart(updatedCart.length); // Actualiza el contador
        return updatedCart;
      });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const updateProductQuantity = async (id_producto, nuevaCantidad) => {
    const storedUserData: any = localStorage.getItem("userData");
    const userData = JSON.parse(storedUserData);

    try {
      const response = await fetch(
        `${API_URL}/aniade/${userData.id_carrito}/${id_producto}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cantidad: nuevaCantidad }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar la cantidad del producto");
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      // Actualiza el estado del carrito en el frontend
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id_producto === id_producto
            ? { ...item, cantidad: item.cantidad + nuevaCantidad }
            : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-300 py-2">
      <div className="sm:w-3/4">
        <h3 className="text-lg font-semibold">{item.nombre_producto}</h3>
        <p className="text-tertiarypagecolor">Cantidad: {item.cantidad}</p>
      </div>
      <div className="text-lg font-semibold pr-2">
        Bs {item.precio_producto * item.cantidad}
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 mt-2">
          {/* Botón para decrementar */}
          <button
            onClick={async () => {
              if (item.cantidad > 1) {
                await updateProductQuantity(item.id_producto, -1);
              } else {
                // Lógica para eliminar si la cantidad llega a 0
                await handleRemoveFromCart(item.id_producto);
              }
            }}
            className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center"
          >
            -
          </button>
          {/* Botón para incrementar */}
          <button
            onClick={async () => {
              if (item.cantidad < stock_producto) {
                await updateProductQuantity(item.id_producto, 1);
              }
            }}
            className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center"
          >
            +
          </button>
        </div>
        <button
          onClick={() => handleRemoveFromCart(item.id_producto)}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default CartItem;

