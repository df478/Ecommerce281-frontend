import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "@/components/footer";
import ProductCard from "../components/ProductCard"; // Asegúrate de que la ruta es correcta

// Definimos la interfaz para un producto
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
}

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [cart, setCart] = useState<Product[]>([]);

  // Simulación de obtener productos desde una API
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://fakestoreapi.com/products");
      const data: Product[] = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 pt-56">
        <h1 className="text-2xl font-bold mb-4">Productos</h1>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded mb-4 w-full"
        />

        {/* Grid responsive para las tarjetas de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              price={product.price}
              imageUrl={product.image}
              onAddToCart={() => handleAddToCart(product)}
              onViewDetail={() => console.log(`View details for product with id ${product.id}`)} // Cambia esto según sea necesario
            />
          ))}
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold">Carrito</h2>
          <ul>
            {cart.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item.title} - ${item.price}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
