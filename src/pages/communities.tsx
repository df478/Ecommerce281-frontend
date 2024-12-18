import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { API_URL } from "@/libs/constants";

// Define the type for a community
interface Municipio {
  id_municipio: number;
  nombre_municipio: string;
  provincia: {
    id_provincia: number;
    nombre_provincia: string;
    departamento: {
      id_departamento: number;
      nombre_departamento: string;
    };
  };
}

interface Community {
  id_comunidad: number;
  nombre_comunidad: string;
  id_municipio: number;
  municipio: Municipio;
}

const CommunitiesPage: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const departments = [
    "La Paz",
    "Cochabamba",
    "Santa Cruz",
    "Oruro",
    "Potosi",
    "Chuquisaca",
    "Tarija",
    "Beni",
    "Pando",
  ];

  // Function to fetch community data
  const fetchCommunities = async () => {
    try {
      const response = await fetch(`${API_URL}/comunidad`);
      const data = await response.json();
      setCommunities(data);
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  // Filtered and sorted communities
  const filteredCommunities = communities
    .filter((community) => {
      const matchesSearch = community.nombre_comunidad
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment
        ? community.municipio.provincia.departamento.nombre_departamento ===
          selectedDepartment
        : true;
      return matchesSearch && matchesDepartment;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.nombre_comunidad.localeCompare(b.nombre_comunidad);
      } else {
        return b.nombre_comunidad.localeCompare(a.nombre_comunidad);
      }
    });

  // Clear filters function
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("");
    setSortOrder("asc");
  };

  return (
    <>
      <Navbar />
      <div className="mt-16 pb-20">
        <AuroraBackground className="w-full mx-0 px-0 py-10 flex flex-col items-center">
          <h1 className="text-6xl font-bold mb-4 text-buttonpagecolor2">
            Comunidades
          </h1>
          <p className="text-lg text-center font-bold mb-6 text-buttonpagecolor2">
            Descubre las comunidades de Bolivia donde puedes comprar productos
            locales. Conecta con artesanos y productores de diversas regiones, y
            apoya la economía local al adquirir productos auténticos y únicos de
            cada comunidad.
          </p>
        </AuroraBackground>

        {/* Search Bar and Filters Section */}
        <div className="mx-10 p-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Buscar comunidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-tertiarypagecolor bg-buttonpagecolor2 rounded mb-4 w-full focus:text-bgpagecolor"
            
          />

          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border p-2 rounded mb-4 w-full bg-buttonpagecolor2 text-bgpagecolor"
          >
            <option value="">Todos Los Departamentos</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>

          {/* Sort Order Filter */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border p-2 rounded mb-4 w-full bg-buttonpagecolor2 text-bgpagecolor"
          >
            <option value="asc">Ordenar A a la Z</option>
            <option value="desc">Ordenar Z a la A</option>
          </select>

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="bg-buttonpagecolor2 text-white px-4 py-2 rounded hover:opacity-90 transition duration-200"
          >
            Limpiar Filtros
          </button>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-10">
          {filteredCommunities.map((community) => (
            <Link
              className="hover:no-underline"
              key={community.id_comunidad}
              href={`/community/${community.id_comunidad}`}
            >
              <div className="bg-buttonpagecolor2 border rounded-lg p-4 shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-pointer no-underline">
                <h2 className="text-xl font-semibold text-buttonpagecolor">
                  {community.nombre_comunidad}
                </h2>
                <p className="text-bgpagecolor">
                  {community.municipio.nombre_municipio}
                </p>
                <p className="text-bgpagecolor">
                  {community.municipio.provincia.nombre_provincia}
                </p>
                <p className="text-bgpagecolor">
                  {
                    community.municipio.provincia.departamento
                      .nombre_departamento
                  }
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CommunitiesPage;
