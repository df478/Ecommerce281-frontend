import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { CreateProductService } from "@/services/CreateProductService";

interface ProductFormData {
  id_artesano: number;
  nombre_producto: string;
  precio_producto: number;
  categoria_producto: string;
  descripcion_producto: string;
  ancho_producto: number;
  peso_producto: number;
  largo_producto: number;
  alto_producto: number;
  envio_gratuito: number;
  stock_producto: number;
  images: {
    image1?: string;
    image2?: string;
    image3?: string;
  };
}

export default function ProductForm() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [freeShipping, setFreeShipping] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    id_artesano: 1,
    nombre_producto: "",
    precio_producto: 0,
    descripcion_producto: "",
    stock_producto: 0,
    categoria_producto: "",
    peso_producto: 0,
    largo_producto: 0,
    ancho_producto: 0,
    alto_producto: 0,
    envio_gratuito: 0,
    images: {},
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUploadSuccess = (result: any) => {
    // Obtener las URLs de las imágenes subidas
    const newImageUrls = result?.info?.url ? [...imageUrls, result.info.url] : imageUrls;

    if (newImageUrls.length <= 3) {
      setImageUrls(newImageUrls);
    } else {
      alert("No puedes subir más de 3 imágenes.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updatedFormData = {
        ...formData,
        images: {
          image1: imageUrls[0] || undefined,
          image2: imageUrls[1] || undefined,
          image3: imageUrls[2] || undefined,
        },
        envio_gratuito: freeShipping ? 1 : 0,
      };

      // Enviar el producto
      const productResponse = await CreateProductService(updatedFormData);

      if (productResponse) {
        setSuccessMessage("El producto ha sido subido exitosamente.");
        setErrorMessage(null);
      } else {
        setErrorMessage("Ha ocurrido un error al subir el producto.");
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error("Error durante la subida:", error);
      setErrorMessage("Error de servidor. Inténtalo de nuevo más tarde.");
      setSuccessMessage(null);
    }

    // Reiniciar formulario
    setFormData({
      id_artesano: 1,
      nombre_producto: "",
      precio_producto: 0,
      descripcion_producto: "",
      stock_producto: 0,
      categoria_producto: "",
      peso_producto: 0,
      largo_producto: 0,
      ancho_producto: 0,
      alto_producto: 0,
      envio_gratuito: 0,
      images: {},
    });
    setImageUrls([]);
  };

  return (
    <form
      className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-buttonpagecolor2 to-gray-800 text-white shadow-lg rounded-lg space-y-6"
      onSubmit={handleSubmit}
    >
      <h2 className="text-3xl font-semibold text-center text-tertiarypagecolor">
        Añadir Producto
      </h2>

      {/* Nombre */}
      <div>
        <label className="block text-white font-medium">
          Nombre del Producto
        </label>
        <input
          type="text"
          name="nombre_producto"
          value={formData.nombre_producto}
          onChange={handleChange}
          className="w-full bg-extrapagecolor2 text-buttonpagecolor2 mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          minLength={2}
          maxLength={50}
        />
      </div>

      {/* Precio */}
      <div>
        <label className="block text-white font-medium">Precio</label>
        <input
          type="number"
          name="precio_producto"
          value={formData.precio_producto}
          onChange={handleChange}
          className="w-full bg-extrapagecolor2 text-buttonpagecolor2 mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          min={1}
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-white font-medium">Descripción</label>
        <textarea
          name="descripcion_producto"
          value={formData.descripcion_producto}
          onChange={handleChange}
          className="w-full bg-extrapagecolor2 text-buttonpagecolor2 mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          rows={4}
          minLength={10}
          maxLength={100}
        ></textarea>
      </div>

      {/* Stock */}
      <div>
        <label className="block text-white font-medium">Stock</label>
        <input
          type="number"
          name="stock_producto"
          value={formData.stock_producto}
          onChange={handleChange}
          className="w-full bg-extrapagecolor2 text-buttonpagecolor2 mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-white font-medium">Categoría</label>
        <input
          type="text"
          name="categoria_producto"
          value={formData.categoria_producto}
          onChange={handleChange}
          className="w-full bg-extrapagecolor2 text-buttonpagecolor2 mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          minLength={2}
          maxLength={50}
        />
      </div>

      {/* Peso */}
      <div>
        <label className="block text-white font-medium">Peso (kg)</label>
        <input
          type="number"
          name="peso_producto"
          value={formData.peso_producto}
          onChange={handleChange}
          className="w-full bg-extrapagecolor2 text-buttonpagecolor2 mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          min={1}
        />
      </div>

      {/* Imágenes */}
      <div className="mb-4">
        <label className="block text-white">Imágenes</label>
        <CldUploadWidget
          onUpload={handleUploadSuccess}
          uploadPreset="your_cloudinary_upload_preset"
          options={{ maxFiles: 3 }}
        >
          {({ open }) => (
            <button
              type="button"// Aquí no es necesario envolver open con una función anónima.
              className="w-full bg-extrapagecolor2 text-buttonpagecolor2 mt-1 p-2 border border-gray-300 rounded-md"
            >
              Subir Imágenes
            </button>
          )}
        </CldUploadWidget>

        {imageUrls.length > 0 && (
          <div className="mt-4">
            <h3 className="text-white">Imágenes seleccionadas:</h3>
            <div className="flex flex-wrap mt-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative w-24 h-24 m-2">
                  <img
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Envío gratuito */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="envio_gratuito"
          checked={freeShipping}
          onChange={() => setFreeShipping(!freeShipping)}
          className="mr-2"
        />
        <label className="text-white">¿Envio gratuito?</label>
      </div>

      {/* Mensajes de éxito o error */}
      {successMessage && (
        <div className="mt-4 p-4 bg-green-500 text-white rounded-md">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-500 text-white rounded-md">
          {errorMessage}
        </div>
      )}

      {/* Botón para enviar */}
      <button
        type="submit"
        className="w-full bg-buttonpagecolor2 text-white py-3 rounded-md mt-6 hover:bg-buttonpagecolor1 transition"
      >
        Subir Producto
      </button>
    </form>
  );
}
