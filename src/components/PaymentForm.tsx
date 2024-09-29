import { useState } from 'react';
import { createOrder } from '../services/OrderService';

const PaymentForm = ({ onClose, cartItems }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const totalAmount = cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        //TODO: Reemplazar el id_carrito con el id real de carrito cuando lotengamos en global
        const orderData = {
            id_carrito: 1, // Aquí puedes reemplazar con el ID real del carrito
            fecha_pedido: new Date().toISOString(),
            estado_pedido: 'Pendiente',
            monto_pago: totalAmount,
        };

        try {
            await createOrder(orderData);
            setMessage('Pago procesado con éxito. ¡Gracias por tu compra!');
            setTimeout(onClose, 3000);
        } catch (error) {
            setMessage('Error al procesar el pedido. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4">Formulario de Pago</h2>
                {message ? (
                    <div className="text-green-500 font-semibold text-center mb-4">{message}</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Número de Tarjeta</label>
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                required
                                className="border rounded w-full px-3 py-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Nombre en la Tarjeta</label>
                            <input
                                type="text"
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value)}
                                required
                                className="border rounded w-full px-3 py-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Fecha de Expiración</label>
                            <input
                                type="text"
                                placeholder="MM/AA"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                required
                                className="border rounded w-full px-3 py-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">CVC</label>
                            <input
                                type="text"
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value)}
                                required
                                className="border rounded w-full px-3 py-2"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                            Pagar
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-2 w-full text-red-500 hover:underline"
                        >
                            Cancelar
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PaymentForm;