import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Product } from "../types/types";
import Swal from "sweetalert2";

interface Pedido {
  id_pedido: number;
  id_carrito: number;
  fecha_pedido: Date;
  estado_pedido: string;
  monto_pago: number;
  tipo_de_pedido: string;
  entrega: entregas[];
}

interface entregas {
  id_entrega: number;
  id_pedido: number;
  id_cliente: number;
  id_delivery: number | null;
  estado_entrega: string;
  fecha_entrega: Date | null;
  cliente_confirm: boolean;
  delivery_confirm: boolean;
}

interface Delivery {
  id_usuario: number;
  nombre_usuario: string;
  email_usuario: string;
  celular: number;
}

interface Aniade {
  id_aniade: number;
  id_producto: number;
  id_carrito: number;
  cantidad: number;
  artesano_confirm: boolean;
  delivery_confirm: boolean;
}

const ConfirmacionArtesano = () => {
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [aniade, setAniade] = useState<Aniade[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const id = userData ? JSON.parse(userData).id_usuario : null;
    setUserId(id);

    if (!id) return;

    const fetchData = async () => {
      try {
        const productsResponse = await fetch(
          "http://localhost:5000/api/v1/producto/"
        );
        const productsData = await productsResponse.json();
        const userProducts = productsData.filter(
          (product: Product) => product.id_artesano === id
        );
        setProducts(userProducts);

        const pedidosResponse = await fetch(
          "http://localhost:5000/api/v1/pedido/"
        );
        const pedidosData = await pedidosResponse.json();
        setOrders(pedidosData);

        const aniadeResponse = await fetch(
          "http://localhost:5000/api/v1/aniade/"
        );
        const aniadeData = await aniadeResponse.json();
        const filteredAniade = aniadeData.filter((aniade: Aniade) =>
          userProducts.some(
            (product) => aniade.id_producto === product.id_producto
          )
        );
        const filteredAniade2 = filteredAniade.filter((aniade: Aniade) =>
          pedidosData.some((order) => order.id_carrito === aniade.id_carrito)
        );
        setAniade(filteredAniade2);

        const deliveriesResponse = await fetch(
          "http://localhost:5000/api/v1/delivery/"
        );
        const deliveriesData = await deliveriesResponse.json();
        setDeliveries(deliveriesData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  const showDeliveryContact = (cellphone: number) => {
    Swal.fire({
      title: "Contacto de Delivery",
      text: `Celular del delivery: ${cellphone}`,
      icon: "info",
      confirmButtonText: "Cerrar",
    });
  };

  const handleConfirm = async (idAniade: number) => {
    const confirmed = await Swal.fire({
      title: "¿Confirmar Pedido?",
      text: "¿Estás seguro de que deseas confirmar este pedido?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "No, cancelar",
    });

    if (confirmed.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/aniade/${idAniade}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ artesano_confirm: true }),
        });

        if (!response.ok) {
          throw new Error("Error al confirmar el pedido");
        }

        const updatedAniade = aniade.map((item) =>
          item.id_aniade === idAniade
            ? { ...item, artesano_confirm: true }
            : item
        );
        setAniade(updatedAniade);

        Swal.fire({
          title: "Confirmación exitosa",
          text: "El pedido ha sido confirmado correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      } catch (error) {
        console.error("Error al confirmar el pedido:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un error al confirmar el pedido. Intenta de nuevo.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    }
  };

  const handleCancelConfirmation = async (idAniade: number) => {
    const canceled = await Swal.fire({
      title: "¿Cancelar Confirmación?",
      text: "¿Estás seguro de que deseas cancelar la confirmación de este pedido?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, volver",
    });

    if (canceled.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/aniade/${idAniade}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ artesano_confirm: false }),
        });

        if (!response.ok) {
          throw new Error("Error al cancelar la confirmación");
        }

        const updatedAniade = aniade.map((item) =>
          item.id_aniade === idAniade
            ? { ...item, artesano_confirm: false }
            : item
        );
        setAniade(updatedAniade);

        Swal.fire({
          title: "Cancelación exitosa",
          text: "La confirmación del pedido ha sido cancelada.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      } catch (error) {
        console.error("Error al cancelar la confirmación:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un error al cancelar la confirmación. Intenta de nuevo.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-5/6 container mx-auto mt-24 p-6 bg-buttonpagecolor2  shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold text-buttonpagecolor mb-6">Confirmación Artesano</h1>

        {aniade.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Artículos Añadidos</h2>
            {aniade.map((item) => {
              const producto = products.find(
                (product) => product.id_producto === item.id_producto
              );
              const pedido = orders.find(
                (order) => order.id_carrito === item.id_carrito
              );
              const delivery = deliveries.find(
                (delivery) =>
                  delivery.id_usuario === pedido?.entrega[0].id_delivery
              );

              return (
                <div key={item.id_aniade} className="border-b pb-4">
                  <h3 className="text-xl font-medium text-gray-800">
                    Producto: {producto ? producto.nombre_producto : "Desconocido"}
                  </h3>
                  <p className="text-white">Cantidad: {item.cantidad}</p>
                  <p className={`text-lg ${item.artesano_confirm ? "text-green-500" : "text-red-500"}`}>
                    Estado: {item.artesano_confirm ? "Confirmado" : "No confirmado"}
                  </p>

                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() => handleConfirm(item.id_aniade)}
                      disabled={item.artesano_confirm}
                      className={`${
                        item.artesano_confirm
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white py-2 px-4 rounded-lg transition duration-300`}
                    >
                      {item.artesano_confirm ? "Confirmado" : "Confirmar Pedido"}
                    </button>

                    {item.artesano_confirm && (
                      <button
                        onClick={() => handleCancelConfirmation(item.id_aniade)}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-300"
                      >
                        Cancelar Confirmación
                      </button>
                    )}

                    {delivery && delivery.celular && (
                      <button
                        onClick={() => showDeliveryContact(delivery.celular)}
                        className="text-blue-500 hover:underline mt-2"
                      >
                        Ver Contacto Delivery
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No hay artículos añadidos a los pedidos para este artesano.</p>
        )}
      </div>
    </>
  );
};

export default ConfirmacionArtesano;
