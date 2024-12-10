import { useState } from "react";
import { createOrder } from "../services/OrderService";
import { useAppContext } from "@/context";
import { QRCodeCanvas } from "qrcode.react";
import { useRouter } from "next/router"; // Asegúrate de importar useRouter si no lo tienes ya

const PaymentForm = ({ onClose, cartItems, totalPrice }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [message, setMessage] = useState("");
  const { setCart } = useAppContext();
  const [paymentLink, setPaymentLink] = useState(""); // Estado para el enlace de pago
  const [showQRCode, setShowQRCode] = useState(false); // Estado para controlar la visualización del QR
  const [showForm, setShowForm] = useState(true); // Estado para alternar entre el formulario y el QR
  const router = useRouter(); // Hook para redireccionar

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalAmount = totalPrice;

    const storedUserData = localStorage.getItem("userData");
    const userData = storedUserData ? JSON.parse(storedUserData) : {};

    const orderData = {
      id_carrito: userData.id_carrito,
      fecha_pedido: new Date().toISOString(),
      estado_pedido: "Pendiente",
      monto_pago: parseInt(totalAmount),
      tipo_de_pedido: "rapido",
      items: cartItems // Aquí agregamos los productos del carrito
    };
    

    try {
      console.log("orderData antes de crear el pedido:", orderData); // Log de los datos del pedido
      await createOrder(orderData);
      setMessage("Pago procesado con éxito. ¡Gracias por tu compra!");
      setCart([]);
      setTimeout(() => {
        router.push("/orders"); // Redirige a la página de pedidos
      }, 3000);

      // Generar enlace de pago para el QR
      const generatedPaymentLink = `https://pago-ejemplo.com/pagar?monto=${totalAmount}`;
      setPaymentLink(generatedPaymentLink);
    } catch (error) {
      setMessage("Error al procesar el pedido. Inténtalo de nuevo.");
    }
  };

  const handleGenerateQRCode = () => {
    const generatedPaymentLink = `https://pago-ejemplo.com/pagar?monto=${totalPrice}`;
    setPaymentLink(generatedPaymentLink);
    setShowQRCode(true); // Mostrar el QR
    setShowForm(false); // Ocultar el formulario
  };

  const handleReturnToForm = () => {
    setShowForm(true); // Volver a mostrar el formulario
    setShowQRCode(false); // Ocultar el QR
  };

  const handleConfirmPayment = async () => {
    // Procesar el pago de la misma forma que el botón "Pagar"
    await handleSubmit({ preventDefault: () => {} });
  };

  return (
    <div className="mt-20 fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-buttonpagecolor2 text-white p-6 rounded-lg shadow-lg max-w-2xl w-full flex">
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4">Formulario de Pago</h2>
          {message ? (
            <div className="text-green-500 font-semibold text-center mb-4">
              {message}
            </div>
          ) : showForm ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Número de Tarjeta
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                  className="border rounded w-full px-3 py-2 text-buttonpagecolor2 bg-extrapagecolor2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Nombre en la Tarjeta
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  required
                  className="border rounded w-full px-3 py-2 text-buttonpagecolor2 bg-extrapagecolor2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Fecha de Expiración
                </label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                  className="border rounded w-full px-3 py-2 text-buttonpagecolor2 bg-extrapagecolor2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">CVC</label>
                <input
                  type="text"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  required
                  className="border rounded w-full px-3 py-2 text-buttonpagecolor2 bg-extrapagecolor2"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="w-full bg-buttonpagecolor text-buttonpagecolor2 py-2 rounded hover:bg-blue-600 mr-2"
                >
                  Pagar
                </button>
                <button
                  type="button"
                  onClick={handleGenerateQRCode}
                  className="w-full bg-buttonpagecolor text-buttonpagecolor2 py-2 rounded hover:bg-green-600"
                >
                  Generar QR
                </button>
              </div>
              <div className="flex justify-center  my-4" >
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-red-800 text-white px-20 py-2 rounded hover:bg-red-500"
                >
                  Cancelar
                </button>
              </div>
              
            </form>
          ) : (
            <div className="text-center w-full">
              <h3 className="font-semibold mb-2">Código QR para el pago:</h3>
              <div className="w-full flex justify-center">
                <QRCodeCanvas value={paymentLink} size={128} />
              </div>
              <p className="mt-2 text-sm text-white">
                Escanea el código QR para pagar.
              </p>
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleReturnToForm}
                  className="w-1/3 bg-buttonpagecolor text-buttonpagecolor2 py-2 mr-1 rounded hover:bg-red-600"
                >
                  Volver a Tarjeta
                </button>
                <button
                  onClick={handleConfirmPayment}
                  className="w-1/3 bg-buttonpagecolor text-buttonpagecolor2 py-2 ml-1 rounded hover:bg-green-600"
                >
                  Confirmar Pago QR
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
