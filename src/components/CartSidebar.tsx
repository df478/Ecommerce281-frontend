// @ts-ignore
"use client";
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context";
import { useRouter } from "next/navigation";
import { RemoveProductFromCartService } from "../services/RemoveProductFromCartService";
import { API_URL } from "@/libs/constants";

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, setCart, setNumberOfProductsInCart } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const storedUserData: any = localStorage.getItem("userData");
      const userData = JSON.parse(storedUserData);

      const response = await fetch(
        `${API_URL}/carrito/cliente/${userData.id_usuario}`
      );
      const data = await response.json();
      const productsList = data.producto.map((item) => {
        return {
          ...item.producto,
          cantidad: item.cantidad,
          stock: item.producto.stock_producto, // Añadir stock
        };
      });
      setNumberOfProductsInCart(productsList.length);
      setCart(productsList);
    };

    fetchProducts();
  }, []);

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
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      setCart((prevCart) => {
        const updatedCart = prevCart.filter(
          (item) => item.id_producto !== id_producto
        );
        setNumberOfProductsInCart(updatedCart.length);
        return updatedCart;
      });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const handleBuy = () => {
    router.push("/cart");
  };

  const groupedCart = cart.reduce((acc: any, item: any) => {
    const existingItem = acc.find(
      (i: any) => i.id_producto === item.id_producto
    );

    if (existingItem) {
      existingItem.cantidad += item.cantidad;
    } else {
      acc.push({ ...item });
    }

    return acc;
  }, []);

  const updateProductQuantity = async (id_producto: number, nuevaCantidad: number) => {
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
    <div
      className={`fixed top-0 right-0 w-72 bg-white text-white bg-gradient-to-r from-buttonpagecolor2 to-gray-900 shadow-lg transition-transform transform ${isOpen ? "translate-x-0" : "translate-x-full"} h-full z-50`}
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
              <>
                <li key={index} className="flex justify-evenly items-center my-2">
                  <img
                    src={item.imagen[0].url_imagen}
                    alt={item.nombre_producto}
                    className="w-16 h-16 object-cover mr-2 border border-black"
                  />
                  <div className="flex-grow w-1/3">
                    <p>{item.nombre_producto}</p>
                    <p>Cantidad: {item.cantidad}</p>
                    <p>
                      Precio: Bs {(parseFloat(item.precio_producto) * item.cantidad).toFixed(2)}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      {/* Botón para decrementar */}
                      <button
                        onClick={async () => {
                          if (item.cantidad > 1) {
                            await updateProductQuantity(item.id_producto, -1);
                          } else {
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
                          console.log(item.cantidad)
                          if (item.cantidad < item.stock) {
                            await updateProductQuantity(item.id_producto, 1);
                          }
                        }}
                        className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.id_producto)}
                    className="w-7 bg-buttonpagecolor border border-buttonpagecolor text-buttonpagecolor2 hover:bg-buttonpagecolor2 hover:text-bgpagecolor p-1 rounded-full ml-2 font-semibold"
                  >
                    x
                  </button>
                </li>
                <div className="w-full bg-bgpagecolor h-[0.1px]"></div>
              </>
            ))
          )}
        </ul>
        <button
          onClick={handleBuy}
          className="w-full bg-extrapagecolor border border-buttonpagecolor2 hover:bg-buttonpagecolor text-buttonpagecolor2 p-2 mt-4 rounded"
        >
          Comprar
        </button>
      </div>
    </div>
  );
};

export default CartSidebar;
