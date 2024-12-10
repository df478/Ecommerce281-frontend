import Link from 'next/link';
import React, { useEffect,useState } from 'react';
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { API_URL } from '@/libs/constants';
import DeliveryDetail from '@/pages/deliveriesDelivery/[id]';
import DeliveryDetails from '@/pages/deliveries/[id]';

// Definimos la interfaz para los contactos de delivery
interface DeliveryContact {
    nombre_usuario: string;
    celular: number; // Cambiamos a number
    email_usuario: string;
}

interface Comunidad {
    id_comunidad: number;
    nombre_comunidad: string;
    id_municipio: number;
    municipio: {
        id_municipio: number;
        nombre_municipio: string;
        id_provincia: number;
    };
}

interface Artesano {
    nombre_usuario: string;
    celular: number;
    email_usuario: string;
    comunidad: Comunidad;
}

interface Producto {
    nombre_producto: string;
    artesano: Artesano;
}

interface Cliente {
    nombre_usuario: string;
    celular: number;
    email_usuario: string;
}

interface Delivery {
    id_entrega: number;
    id_pedido: number;
    id_cliente: number;
    id_delivery: number;
    estado_entrega: string;
    fecha_entrega: string | null;
    delivery_confirm: boolean;
    cliente_confirm: boolean;
    cliente: Cliente;
    pedido: {
        id_pedido: number;
        id_carrito: number;
        fecha_pedido: string;
        estado_pedido: string;
        monto_pago: number;
        tipo_de_pedido: string;
        carrito: {
            id_carrito: number;
            id_usuario: number;
            aniade: {
                id_aniade: number;
                producto: Producto; // Fixed this line
                cantidad: number;
                artesano_confirm: boolean;
                delivery_confirm: boolean;
            }[];
        };
    };
}

const OrderItem = ({ order, orderNumber }) => {
    const router = useRouter(); // Usamos el hook useRouter para navegar
    const { id } = order;
    const [showModal, setShowModal] = useState(false);
    const [deliveryContacts, setDeliveryContacts] = useState<DeliveryContact | null>(null);
    const [deliveryDetails, setDeliveryDetails] = useState<Delivery | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeliveryDetails = async () => {
            if (!id) return;

            try {
                const response = await fetch(`${API_URL}/entrega/${id}`);
                if (!response.ok) {
                    throw new Error("Error al obtener los detalles de la entrega");
                }
                const data: Delivery = await response.json();
                console.log(data)
                setDeliveryDetails(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDeliveryDetails();
        }
    }, [id]);
    const fetchDeliveryContacts = async () => {
        try {
            const response = await fetch(`${API_URL}/pedido/${order.id}`);
            if (!response.ok) {
                throw new Error('Error al obtener contactos del delivery');
            }

            const data = await response.json();
            console.log(data); // Para verificar la respuesta

            // Accediendo a la información de delivery desde el primer elemento de entrega
            if (data.entrega && data.entrega.length > 0) {
                setDeliveryContacts(data.entrega[0].delivery); // Acceder a la información de delivery
            } else {
                setDeliveryContacts(null); // No hay entregas
            }
        } catch (error) {
            console.error('Error fetching delivery contacts:', error);
        }
    };

    const handleShowModal = () => {
        fetchDeliveryContacts();
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };const confirmDelivery = async () => {
        if (!deliveryDetails) return;
    
        try {
            console.log(deliveryDetails);
    
            // Verificar si la entrega ya está confirmada por ambas partes
            if (deliveryDetails.delivery_confirm && deliveryDetails.cliente_confirm) {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "La entrega ya fue confirmada por ambas partes y no se puede modificar.",
                    confirmButtonText: "Aceptar",
                });
                return;
            }
    
            // Si el cliente ya confirmó, preguntar si desea cancelar la confirmación
            if (!deliveryDetails.delivery_confirm && deliveryDetails.cliente_confirm) {
                const confirmCancel = window.confirm("¿Deseas cancelar la confirmación de la entrega?");
                if (confirmCancel) {
                    const response = await fetch(`${API_URL}/entrega/${deliveryDetails.id_entrega}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            cliente_confirm: false,
                            fecha_entrega: null, // Opcional: Si se requiere anular la fecha
                        }),
                    });
    
                    if (!response.ok) {
                        throw new Error("Error al cancelar la confirmación de la entrega.");
                    }
    
                    setDeliveryDetails(prev => (prev ? {
                        ...prev,
                        cliente_confirm: false,
                        fecha_entrega: null, // Actualiza según tu lógica
                    } : prev));
    
                    Swal.fire({
                        icon: "success",
                        title: "Éxito",
                        text: "Confirmación cancelada con éxito.",
                        confirmButtonText: "Aceptar",
                    });
                }
                return;
            }
    
            // Confirmar entrega por parte del cliente
            const confirmDelivery = window.confirm("¿Deseas confirmar la entrega?");
            if (confirmDelivery) {
                const response = await fetch(`${API_URL}/entrega/${deliveryDetails.id_entrega}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        cliente_confirm: true,
                        fecha_entrega: new Date().toISOString(),
                    }),
                });
    
                if (!response.ok) {
                    throw new Error("Error al confirmar la entrega.");
                }
    
                // Actualizar estado localmente
                setDeliveryDetails(prev => (prev ? {
                    ...prev,
                    cliente_confirm: true,
                    fecha_entrega: new Date().toISOString(),
                } : prev));
    
                Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: "Entrega confirmada con éxito.",
                    confirmButtonText: "Aceptar",
                });
            }
    
            // Si ambas confirmaciones están activas, actualizar "Entregado"
            if (deliveryDetails.delivery_confirm && deliveryDetails.cliente_confirm) {
                const [responseEntrega, responsePedido] = await Promise.all([
                    fetch(`${API_URL}/entrega/${deliveryDetails.id_entrega}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            estado_entrega: "Entregado",
                        }),
                    }),
                    fetch(`${API_URL}/pedido/${deliveryDetails.pedido.id_pedido}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            estado_pedido: "Entregado",
                        }),
                    }),
                ]);
    
                if (!responseEntrega.ok || !responsePedido.ok) {
                    throw new Error("Error al actualizar el estado a 'Entregado'.");
                }
    
                // Actualizar estado localmente
                setDeliveryDetails(prev => (prev ? {
                    ...prev,
                    estado_entrega: "Entregado",
                    pedido: {
                        ...prev.pedido,
                        estado_pedido: "Entregado",
                    },
                } : prev));
    
                Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: "Estado actualizado a 'Entregado'.",
                    confirmButtonText: "Aceptar",
                });
            }
        } catch (error: any) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Ocurrió un error inesperado.",
                confirmButtonText: "Aceptar",
            });
        }
    };
    
    console.log(deliveryDetails)
    if (!deliveryDetails) return <p>No se encontraron detalles de la entrega.</p>;
    const cliente = deliveryDetails.cliente;

    // Función para redirigir al perfil de delivery
    const handleRedirectToProfile = () => {
        if (deliveryDetails && deliveryDetails.id_delivery) {
            router.push(`/delivery/${deliveryDetails.id_delivery}`);
        }
    };


    return (
        <div className="flex flex-col md:flex-row justify-between items-start border  border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-buttonpagecolor to-tertiarypagecolor">
            <div className="flex-1 mb-4 md:mb-0 ">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Pedido #{orderNumber}</h3>
                <div className="text-gray-600 mb-1">
                    <span className="font-medium">Fecha - Hora:</span> {order.fecha_pedido}
                </div>
                <div className="text-gray-600 mb-1">
                    <span className="font-medium">Estado:</span> <span className='capitalize'>{deliveryDetails.estado_entrega}</span> {/* Cambiado de `estado_pedido` a `status` */}
                </div>
                <div className="text-gray-600 mb-1">
                    <span className="font-medium">Total:</span> <span className="font-semibold">{order.monto_pago} Bs</span>
                </div>
                <div className="text-gray-600">
                    <span className="font-medium">Tipo:</span> <span className='capitalize'>{order.tipo_de_pedido}</span>
                </div>
            </div>
            <div className="flex flex-col items-end md:items-center ">
            <Link 
                href={`/orders/${order.id}`} 
                style={{ textDecoration: 'none' }}
                className="w-full text-center mt-2 inline-block bg-extrapagecolor2 text-black px-4 py-2 rounded-md shadow-md hover:bg-extrapagecolor transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Ver detalles del pedido ${orderNumber}`}
            >
                Ver Pedido
            </Link>


                <button 
                    onClick={handleShowModal} 
                    className="w-full text-center mt-2 inline-block bg-extrapagecolor2 text-black px-4 py-2 rounded-md shadow-md hover:bg-extrapagecolor transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label="Ver contactos del delivery"
                >
                    Ver Contacto
                </button>
                <button
                    onClick={confirmDelivery}
                    className={`w-full text-center mt-2 px-3 py-1 rounded-md ${
                        !deliveryDetails?.delivery_confirm && deliveryDetails?.cliente_confirm
                            ? "bg-red-600 hover:bg-red-700"
                            : deliveryDetails?.delivery_confirm && deliveryDetails?.cliente_confirm
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-orange-600 hover:bg-orange-700"
                    } text-white`}
                >
                    {!deliveryDetails?.delivery_confirm && deliveryDetails?.cliente_confirm
                        ? "Cancelar Confirmación"
                        : deliveryDetails?.delivery_confirm && deliveryDetails?.cliente_confirm
                        ? "Pedido Terminado"
                        : "Confirmar" }
                </button>
            </div>


            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 scale-100">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contacto del Delivery</h2>
                        {deliveryContacts ? (
                            <div>
                            <ul>
                                <li>Nombre: {deliveryContacts.nombre_usuario}</li>
                                <li>Celular: {deliveryContacts.celular}</li> {/* Se muestra como número */}
                                <li>Email: {deliveryContacts.email_usuario}</li>
                            </ul>
                            <button 
                                onClick={handleCloseModal} 
                                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md"
                            >
                                Cerrar
                            </button>
                            
                            <button 
                                onClick={handleRedirectToProfile}
                                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md"
                            >
                                Ver PERFIL
                            </button>
                            </div>
                        ) : (
                            <div><p>Cargando contactos del delivery...</p>
                            <button 
                                onClick={handleCloseModal} 
                                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md"
                            >
                                Cerrar
                            </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderItem;