// ProductCarousel.tsx
"use client";
import React from "react";
import Carousel from "./Carousel";
import { Vortex } from "./ui/vortex";

const DATA = [
  { image: "/images/producto1.jpg" },
  { image: "/images/producto2.jpg" },
  { image: "/images/producto3.jpg" },
];

const ProductCarousel = () => {
  return (
    <section className="w-full flex items-center justify-center bg-black py-12">
      <div className="text-center w-full max-w-4xl px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Productos</h2>
        <p className="text-base sm:text-lg mb-8 text-white">
          En nuestra tienda, encontrarás una variedad de productos
          artesanales, cada uno con su propia historia y tradición. Desde
          cerámica y textiles hasta joyería, cada artículo ha sido creado por
          artesanos locales con materiales de alta calidad. Nos enorgullece
          ofrecer productos que promueven la sostenibilidad y la inclusión. Al
          comprar, contribuyes al desarrollo de las comunidades y apoyas
          prácticas que mantienen vivas las tradiciones artesanales. Ya sea un
          regalo especial o algo único para ti, seguro encontrarás lo que
          necesitas en nuestra selección.
        </p>
        <div className="relative w-full h-64 sm:h-80 md:h-[400px] lg:h-[500px]">
          <Carousel data={DATA} />
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
