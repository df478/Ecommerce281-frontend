// @ts-ignore
"use client";
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context";
import { useRouter } from 'next/navigation';
import { RemoveProductFromCartService } from "../services/RemoveProductFromCartService";

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, setCart, setNumberOfProductsInCart } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const storedUserData: any = localStorage.getItem("userData");
      const userData = JSON.parse(storedUserData);

      //TODO hacer get del carrito del cliente con data de localstorage
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/carrito/cliente/${userData.id_usuario}`
      );
      const data = await response.json();
      const productsList = data.producto.map((item) => {
        return {
          ...item.producto,
          cantidad: item.cantidad,
        };
      });
      setNumberOfProductsInCart(productsList.length);
      setCart(productsList);
    };

    fetchProducts();

  }, []);

  // Función para eliminar un producto del carrito
  // Función para eliminar un producto del carrito
const handleRemoveFromCart = async (id_producto) => {
  const storedUserData:any = localStorage.getItem("userData");
  const userData = JSON.parse(storedUserData);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/carrito/producto/${userData.id_carrito}/${id_producto}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Agrega más encabezados si es necesario, como tokens de autorización
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error al eliminar el producto');
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

  // Función para manejar la compra (puedes personalizar esto)
  const handleBuy = () => {
    router.push("/cart");
  };


  const groupedCart = cart.reduce((acc:any, item:any) => {
    const existingItem = acc.find((i:any) => i.id_producto === item.id_producto);
  
    if (existingItem) {
      // Incrementa la cantidad si el producto ya existe en el acumulador
      existingItem.cantidad += item.cantidad; // Asegúrate de que `item.cantidad` es la cantidad correcta
    } else {
      // Agrega el nuevo producto al acumulador
      acc.push({ ...item });
    }
  
    return acc;
  }, []);
  
  

  return (
    <div
      className={`fixed top-0 right-0 w-64 bg-white shadow-lg transition-transform transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } h-full z-50`}
    >
      <button onClick={onClose} className="p-2 pl-5 pt-5 text-red-500">
        X
      </button>
      <h2 className="text-lg font-semibold p-4">Carrito</h2>
      <div className="h-4/6 overflow-y-scroll">
        <ul className="p-4">
          {groupedCart.length === 0 ? (
            <li className="text-gray-700">Tu carrito está vacío.</li>
          ) : (
            groupedCart.map((item, index) => (
              <li key={index} className="flex items-center mb-2">
                <img
                  src={item.imagen[0].url_imagen}
                  alt={item.nombre_producto}
                  className="w-16 h-16 object-cover mr-2"
                />
                <div className="flex-grow">
                  <p>{item.nombre_producto}</p>
                  <p>Cantidad: {item.cantidad}</p> {/* Muestra la cantidad */}
                  <p>
                    Precio: $
                    {(parseFloat(item.precio_producto) * item.cantidad).toFixed(
                      2
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.id_producto)}
                  className="bg-red-500 text-white p-1 rounded ml-2"
                >
                  -
                </button>
              </li>
            ))
          )}
        </ul>
        <button
          onClick={handleBuy}
          className="w-full bg-blue-500 text-white p-2 mt-4 rounded"
        >
          Comprar
        </button>
      </div>
    </div>
  );
};

export default CartSidebar;
