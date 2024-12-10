import { useEffect, useState } from "react";
import CartItem from "@/components/CartItem";
import Navbar from "@/components/Navbar";
import PaymentForm from "@/components/PaymentForm";
import { useAppContext } from "@/context";
import { API_URL } from "@/libs/constants";

const calculateShippingCost = (cart) => {
  // Calcula el peso total del carrito
  const totalWeight = cart.reduce((total, item) => {
    const weight = parseFloat(item.peso_producto); // Peso real
    const cantidad = item.cantidad || 1;
    return total + (weight * cantidad);
  }, 0);

  // Calcula el peso volumétrico
  const totalVolume = cart.reduce((total, item) => {
    const largo = parseFloat(item.largo_producto); // Largo en cm
    const ancho = parseFloat(item.ancho_producto); // Ancho en cm
    const alto = parseFloat(item.alto_producto); // Alto en cm
    const cantidad = item.cantidad || 1;

    const volumetricWeight = (largo * ancho * alto) / 5000; // Asumiendo 5000 cm³/kg
    return total + (volumetricWeight * cantidad);
  }, 0);

  // Usar el mayor entre peso total y peso volumétrico
  const finalWeight = Math.max(totalWeight, totalVolume);

  // Definir tarifas de envío
  const baseShippingCost = 5.00; // Tarifa base
  const costPerKg = 2.00; // Costo por kg adicional

  // Cálculo del costo de envío
  return baseShippingCost + (costPerKg * finalWeight);
};

const Cart = () => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(true); // Estado para la carga
  const { cart, setCart, setNumberOfProductsInCart } = useAppContext();
  useEffect(() => {
    const fetchProducts = async () => {
      const storedUserData: any = localStorage.getItem("userData");
      const userData = JSON.parse(storedUserData);

      //TODO hacer get del carrito del cliente con data de localstorage
      const response = await fetch(
        `${API_URL}/carrito/cliente/${userData.id_usuario}`
      );
      const data = await response.json();
      
      const productsList = data.producto.map((item:any) => {
        return {
          ...item.producto,
          cantidad: item.cantidad, // Aquí usamos item.cantidad
        };
      });

      setNumberOfProductsInCart(productsList.length);
      setCart(productsList);
      setLoading(false);
    };

    fetchProducts();
  }, [setCart, setNumberOfProductsInCart]);


  const totalPrice = cart.reduce((acumulador, producto) => {
    const precio = parseFloat(producto.precio_producto); // Asegúrate de convertirlo a un número
    const cantidad = producto.cantidad || 1; // Asegúrate de que cantidad tenga un valor
    return acumulador + (precio * cantidad);
  }, 0);

  const shippingCost = calculateShippingCost(cart);
  const finalTotal = totalPrice + shippingCost;

  return (
    <>
      <Navbar />
      <div className="max-w-2xl w-3/4 mx-auto mt-10 p-4 pt-28">
        <h1 className="text-2xl font-bold mb-4">Carrito de Compras</h1>
        <div className="bg-buttonpagecolor2 shadow-md rounded-lg p-4 text-white">
          {loading ? (
            <p className="text-center text-gray-600">Cargando...</p>
          ) : cart.length === 0 ? (
            <p className="text-center text-gray-600">Tu carrito está vacío</p>
          ) : (
            cart.map((item, index) => <CartItem key={index} item={item} />)
          )}
          <div className="mt-4 flex justify-between font-semibold">
            <span>Total Productos:</span>
            <span>Bs {totalPrice.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex justify-between font-semibold">
            <span>Costo de Envío:</span>
            <span>Bs {shippingCost.toFixed(2)}</span>
          </div>
          <div className="mt-4 flex justify-between font-semibold">
            <span>Total Final:</span>
            <span>Bs {finalTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={() => setShowPaymentForm(true)}
            className="mt-4 w-full bg-buttonpagecolor text-white py-2 rounded hover:bg-bgpagecolor hover:text-buttonpagecolor2"
          >
            Finalizar Compra
          </button>
        </div>
      </div>

      {showPaymentForm && (
        <PaymentForm
          onClose={() => setShowPaymentForm(false)}
          cartItems={cart}
          totalPrice={finalTotal}
        />
      )}
    </>
  );
};

export default Cart;
