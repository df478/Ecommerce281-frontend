"use client";
import { FaBell } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useAppContext } from "@/context";
import CartSidebar from "../components/CartSidebar";
import styles from "../styles/navbar.module.css";
import { toggleDeliveryStatus } from "../services/ChangeDeliveryStatusService"; // Asegúrate de tener la ruta correcta a tu archivo de servicio

import { useRouter } from "next/compat/router";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([
    {
      message: "Nuevos Pedidos",
      time: "hace 218 días 23 horas",
      link: "#",
    }
    // Agrega más notificaciones según sea necesario
  ]);
  const toggleNotificationsMenu = () => {
    setIsNotificationsOpen((prev) => {
      if (!prev) {
        setUnreadCount(0); // Restablece el conteo al abrir el menú
      }
      return !prev;
    });
  };
  
  console.log(isActive)
  

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedIsActive = localStorage.getItem("isActive");
    setIsLoggedIn(storedIsLoggedIn);
    if (storedIsLoggedIn) {
      const storedUserData: any = localStorage.getItem("userData");
      const userData = JSON.parse(storedUserData);
      setUsername(userData.nombre_usuario);
      setRole(userData.tipo_usuario);
    }
    if (storedIsActive) {
      setIsActive(storedIsActive === "true"); // Establecer el valor recuperado del localStorage
    }
  }, []);
  const {
    username,
    setUsername,
    setEmail,
    setRole,
    setPassword,
    isLoggedIn,
    setIsLoggedIn,
    numberOfProductsInCart,
    role,
    idUser,
    setIdUser,
  } = useAppContext();

  console.log(isLoggedIn)
  const handleLogout = async () => {
    if(role==="delivery"){

      try {
        await toggleDeliveryStatus(idUser, false);
        console.log("Estado actualizado correctamente");
      } catch (error) {
        console.error("Error al actualizar el estado:", error);
      }
    }
    setIsLoggedIn(false);
    setUsername("");
    setEmail("");
    setRole("");
    setPassword("");
    localStorage.clear();
    if (router) {
      router.push("/");
    }
  };

  const links = [
    { id: 1, text: "home", link: "/" },
    { id: 2, text: "productos", link: "/products" },
    { id: 3, text: "comunidades", link: "/communities" },
    { id: 4, text: "ofertas", link: "/offers" },
    { id: 5, text: "acerca de", link: "/about" },
  ];

  const handleCartToggle = () => {
    setCartOpen((prev) => !prev);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev);
  };

  const closeNav = () => {
    setNav(false);
    setUserMenuOpen(false);
  };

  const toggleActive = async () => {
    const newState = !isActive; // Invertir el estado actual
    setIsActive(newState);
    localStorage.setItem("isActive", newState.toString());
    try {
      await toggleDeliveryStatus(idUser, newState);
      console.log("Estado actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };
  // Nuevo: función para renderizar el menú basado en el rol
  const renderUserMenu = () => {
    console.log(isLoggedIn)
    switch (role) {
      case "cliente":
        return (
          <>
            <div>
              <Link  className="text-buttonpagecolor" href="/profile">Perfil</Link>
            </div>
            <div>
              <Link className="text-buttonpagecolor" href="/orders">Mis Pedidos</Link>
            </div>
            <div>
              <Link className="text-buttonpagecolor" href="/settings">Configuración</Link>
            </div>
            <div>
              <button className="text-extrapagecolor" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          </>
        );
      case "artesano":
        return (
          <>
            <div>
              <Link className="text-buttonpagecolor" href="/profile">Perfil</Link>
            </div>
            <div>
              <Link className="text-buttonpagecolor" href="/remove-product">Mis productos</Link>
            </div>
            <div>
              <Link className="text-buttonpagecolor" href="/productForm">Añadir Producto</Link>
            </div>
            <div>
              <Link className="text-buttonpagecolor" href="/confirmacionArtesano">Pedidos</Link>
            </div>
            <div>
              <Link className="text-buttonpagecolor" href="/settings">Configuración</Link>
            </div>
            <div>
              <button className="text-extrapagecolor" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          </>
        );
      case "delivery":
        return (
          <>
            <div>
              <Link className="text-buttonpagecolor" href="/profile">Perfil</Link>
            </div>
            <div>
              <Link className="text-buttonpagecolor" href="/deliveries">Mis Entregas</Link>
            </div>
            <div>
              <Link className="text-buttonpagecolor" href="/settings">Configuración</Link>
            </div>
            <div>
              <button className="text-extrapagecolor" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          </>
        );
      case null:
        return (
          <>
            <div>
              <Link className="text-buttonpagecolor" href="/AdminPanel">Administrar</Link>
            </div>
            <div>
              <Link className="text-buttonpagecolor" href="/settings">Configuración</Link>
            </div>
            <div>
              <button className="text-extrapagecolor" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          </>
        );
      default:
        return (
          <>
            <div>
              <Link href="/profile">Perfil</Link>
            </div>
            <div>
              <button onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          </>
        );
    }
  };

  
  return (
    <div className="flex justify-between items-center w-full h-20 px-4 text-white bg-black fixed nav z-10 shadow-lg">
      <div>
        <h1 className="text-5xl font-signature ml-2">
          <Link href="/" passHref>
            <div className="flex items-center space-x-2">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <Image
                  src="/images/Logo281.png"
                  alt="logo"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <span
                className="text-lg font-normal text-bgpagecolor "
                style={{
                  fontFamily: "Dancing-Script, cursive",
                  letterSpacing: "0.em",
                }}
              >
                ARTIISNINC
              </span>
            </div>
          </Link>
        </h1>
      </div>

      <ul className="hidden md:flex">
        {links.map(({ id, text, link }) => (
          <li
            key={id}
            className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline"
          >
            <Link href={link} className="text-buttonpagecolor">
              {text}
            </Link>
          </li>
        ))}
        {isLoggedIn && role === "delivery" && (
          <div className={styles.switchContainer}>
            <span>Estado: </span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={toggleActive}
              />
              <span
                className={`${styles.slider} ${isActive ? styles.active : ""}`}
              />
            </label>
            <div className="relative">
              {/* Icono de notificaciones */}
              <button onClick={toggleNotificationsMenu} className="relative">
                <FaBell size={24} className="text-white" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Menú desplegable */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50">
                  <div className="p-4 border-b text-lg font-bold text-gray-700">
                    Notificaciones
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <div
                          key={index}
                          className="p-4 text-sm text-gray-700 border-b last:border-none hover:bg-gray-100 cursor-pointer"
                        >
                          <div>{notification.message}</div>
                          <div className="text-xs text-gray-500">{notification.time}</div>
                          {/*puedo colocar link o algo*/}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-gray-500">
                        No tienes notificaciones nuevas.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
        )}
        {/* Icono del carrito y usuario */}
        <div className="flex items-center text-gray-600">
          {isLoggedIn ? (
            <>
              {/* Solo muestra el carrito si el rol es 'cliente' */}
              {role === "cliente" && (
                <button onClick={handleCartToggle} className="relative">
                  <FaShoppingCart className="text-white" size={24} />
                  {numberOfProductsInCart > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs">
                      {numberOfProductsInCart}
                    </span>
                  )}
                </button>
              )}

              {/* Botón de usuario */}
              <button onClick={toggleUserMenu} className="relative ml-4">
                <FaUserCircle className="text-white rounded-full" size={36} />
              </button>

              {/* Menú desplegable de usuario */}
              {isUserMenuOpen && (
                <div className="absolute top-16 right-0 mt-2 bg-buttonpagecolor2 text-black rounded shadow-md p-2">
                  <span className="block font-bold text-white">{username}</span>
                  {/* {renderUserMenu()} Renderiza el menú basado en el rol */}
                  {role === "cliente" && (
                    <>
                      <div>
                        <Link className="text-buttonpagecolor" href="/profile">Perfil</Link>
                      </div>
                      <div>
                        <Link className="text-buttonpagecolor" href="/orders">Mis Pedidos</Link>
                      </div>
                      <div>
                        <Link className="text-buttonpagecolor" href="/settings">Configuración</Link>
                      </div>
                      <div>
                        <button className="text-extrapagecolor" onClick={handleLogout}>Cerrar Sesión</button>
                      </div>
                    </>
                  )}
                  {role === "artesano" && (
                    <>
                      <div>
                        <Link className="text-buttonpagecolor" href="/profile">Perfil</Link>
                      </div>
                      <div>
                        <Link className="text-buttonpagecolor" href="/remove-product">Mis productos</Link>
                      </div>
                      <div>
                        <Link className="text-buttonpagecolor" href="/productForm">Añadir Producto</Link>
                      </div>
                      <div>
                        <Link className="text-buttonpagecolor" href="/confirmacionArtesano">Pedidos</Link>
                      </div>
                      <div>
                        <Link className="text-buttonpagecolor" href="/settings">Configuración</Link>
                      </div>
                      <div>
                        <button className="text-extrapagecolor" onClick={handleLogout}>Cerrar Sesión</button>
                      </div>
                    </>
                  )}
                  {role === "delivery" && (
                    <>
                      <div>
                        <Link className="text-buttonpagecolor" href="/profile">Perfil</Link>
                      </div>
                      <div>
                        <Link className="text-buttonpagecolor" href="/deliveries">Mis Entregas</Link>
                      </div>
                      <div>
                        <Link className="text-buttonpagecolor" href="/settings">Configuración</Link>
                      </div>
                      <div>
                        <button className="text-extrapagecolor" onClick={handleLogout}>Cerrar Sesión</button>
                      </div>
                    </>
                  )}
                  {role == null && (
                    <>
                      <div>
                        <Link className="text-buttonpagecolor" href="/AdminPanel">Administrar</Link>
                      </div>
                      <div>
                        <Link className="text-buttonpagecolor" href="/settings">Configuración</Link>
                      </div>
                      <div>
                        <button className="text-extrapagecolor" onClick={handleLogout}>Cerrar Sesión</button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Carrito solo si el rol es 'cliente' */}
              {role === "cliente" && (
                <CartSidebar
                  isOpen={isCartOpen}
                  onClose={() => setCartOpen(false)}
                />
              )}
            </>
          ) : (
            <>
              <Link href="/register" className="text-extrapagecolor2">
                Registrarse
              </Link>
              <p className="text-extrapagecolor2">&nbsp;|&nbsp;</p>
              <Link href="/login" className="text-extrapagecolor2">
                Iniciar Sesión
              </Link>
            </>
          )}
        </div>
      </ul>

      {/* Menú de navegación para móviles */}
      <div
        onClick={() => setNav(!nav)}
        className="cursor-pointer pr-4 z-10 text-gray-500 md:hidden"
      >
        {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>

      {nav && (
        <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-gray-800 text-gray-500 opacity-95">
          {links.map(({ id, text, link }) => (
            <li
              key={id}
              className="px-4 cursor-pointer capitalize py-2 text-2xl"
            >
              <Link onClick={closeNav} href={link} className="text-buttonpagecolor">
                {text}
              </Link>
            </li>
          ))}
          <div className="flex flex-col items-center">
            {isLoggedIn ? (
              <>
                {role === "cliente" && (
                  <Link href="/cart" className="relative" onClick={closeNav}>
                    <FaShoppingCart size={24} className="text-gray-100" />
                    {numberOfProductsInCart > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {numberOfProductsInCart}
                      </span>
                    )}
                  </Link>
                )}
                <span className="mt-2">{username}</span>
                {renderUserMenu()} {/* Renderiza el menú basado en el rol */}
              </>
            ) : (
              <>
                <Link href="/register" onClick={closeNav}>
                  Registrarse
                </Link>
                <p>&nbsp;|&nbsp;</p>
                <Link href="/login" onClick={closeNav}>
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        </ul>
      )}
    </div>
  );
};

export default Navbar;
