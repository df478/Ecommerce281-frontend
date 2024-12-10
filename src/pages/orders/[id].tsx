import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import { API_URL } from "@/libs/constants";

interface Producto {
    id_producto: number;
    nombre_producto: string;
    precio_producto: string; // Mantener como string para coincidir con el formato JSON
}

interface Pedido {
    id_pedido: number;
    estado_pedido: string; // Agregar esta propiedad
    carrito: {
        aniade: {
            id_aniade: number;
            cantidad: number;
            producto: Producto;
        }[];
    };
}

const OrderDetails = () => {
    const router = useRouter();
    const { id } = router.query;

    const [orderDetails, setOrderDetails] = useState<Pedido | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showReviewForm, setShowReviewForm] = useState<number | null>(null); // Almacena el id del producto con formulario abierto
    const [reviewDescription, setReviewDescription] = useState("");
    const [reviewRating, setReviewRating] = useState(1); // Calificación inicial de 1 estrella

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!id) return;

            try {
                const response = await fetch(`${API_URL}/pedido/${id}`);
                if (!response.ok) {
                    throw new Error("Error al obtener los detalles del pedido");
                }

                const data: Pedido = await response.json();
                console.log("Datos del pedido:", data); // Aquí
                setOrderDetails(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrderDetails();
        }
    }, [id]);

    const handleReviewSubmit = async () => {
        if (!showReviewForm || !reviewDescription.trim()) {
            alert("Por favor, complete todos los campos de la reseña.");
            return;
        }

        const reviewData = {
            id_producto: showReviewForm,
            id_usuario: 30, // ID del usuario, aquí puedes ajustar según tu lógica de autenticación
            descripcion_resenia: reviewDescription,
            fecha_resenia: new Date().toISOString().split("T")[0],
            calificacion_resenia: reviewRating,
        };

        try {
            const response = await fetch(`${API_URL}/resenia`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) {
                throw new Error("Error al enviar la reseña.");
            }

            alert("Reseña enviada con éxito.");
            setShowReviewForm(null);
            setReviewDescription("");
            setReviewRating(1);
        } catch (error: any) {
            alert(error.message);
        }
    };

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => (
            <span
                key={index}
                className={`cursor-pointer text-2xl ${
                    index < reviewRating ? "text-yellow-500" : "text-gray-400"
                }`}
                onClick={() => setReviewRating(index + 1)}
            >
                ★
            </span>
        ));
    };

    if (loading) return <p className="text-center">Cargando...</p>;
    if (error) return <p className="text-red-600 text-center">{error}</p>;
    if (!orderDetails) return <p className="text-center">No se encontraron detalles del pedido.</p>;

    const productBackgroundColors = [
        "bg-blue-200",
        "bg-green-200",
        "bg-yellow-200",
        "bg-red-200",
        "bg-purple-200",
    ];

    return (
        <>
            <Navbar />
            <div className="max-w-4xl w-3/4 mx-auto mt-10 p-4 pt-28">
                <h1 className="text-3xl font-bold mb-4 text-cyan-600">
                    Detalle del Pedido #{orderDetails.id_pedido}
                </h1>
                <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
                    <h2 className="text-2xl font-bold mt-4 mb-2 text-center">Productos del Pedido</h2>
                    <ul className="space-y-4">
                        {orderDetails.carrito.aniade.map((item, index) => (
                            <li
                                key={item.id_aniade}
                                className={`flex flex-col p-4 border border-gray-300 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 ${productBackgroundColors[index % productBackgroundColors.length]}`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-800">{item.producto.nombre_producto}</h4>
                                        <p className="text-gray-600">Cantidad: {item.cantidad}</p>
                                    </div>
                                    <span className="text-lg font-bold text-green-600">Bs {parseFloat(item.producto.precio_producto).toFixed(2)}</span>
                                </div>
                                <div className="mt-4 flex space-x-4">
                                    <button
                                        onClick={() => router.push(`/product/${item.producto.id_producto}`)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                                    >
                                        Ver Producto
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (orderDetails?.estado_pedido === "entregado") {
                                                setShowReviewForm(item.producto.id_producto);
                                            } else {
                                                alert("El pedido debe estar en estado 'entregado' para poder dejar una reseña.");
                                            }
                                        }}
                                        className={`px-4 py-2 rounded transition ${
                                            orderDetails?.estado_pedido === "entregado"
                                                ? "bg-yellow-500 text-white hover:bg-yellow-700"
                                                : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                        }`}
                                        disabled={orderDetails?.estado_pedido !== "entregado"}
                                    >
                                        Poner Reseña
                                    </button>

                                </div>
                                {showReviewForm === item.producto.id_producto && (
                                    <div className="mt-6 p-4 border rounded-lg bg-gray-100 shadow-md">
                                        <h3 className="text-xl font-bold mb-4">Escribir una Reseña</h3>
                                        <textarea
                                            className="w-full p-2 border rounded mb-4"
                                            placeholder="Escribe tu reseña aquí..."
                                            value={reviewDescription}
                                            onChange={(e) => setReviewDescription(e.target.value)}
                                        />
                                        <div className="flex items-center mb-4">{renderStars()}</div>
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                onClick={handleReviewSubmit}
                                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition"
                                            >
                                                Enviar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowReviewForm(null);
                                                    setReviewDescription("");
                                                    setReviewRating(1);
                                                }}
                                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default OrderDetails;
