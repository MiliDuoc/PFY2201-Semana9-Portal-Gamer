import { useEffect, useState } from "react"
import Navbar from "./components/Navbar"
import ListaProductos from "./components/ListaProductos"
import Carrito from "./components/Carrito"
import ContactoForm from "./components/ContactoForm"
import ModalConfirmacion from "./components/ModalConfirmacion"
import FiltroCategorias from "./components/FiltroCategorias"
import "./App.css"

// Configuración de reintentos para la carga de productos.
const CONFIG_CARGA = {
  intentosMaximos: 3,
  esperaMs: 800,
}

// Espera un tiempo determinado antes de realizar otro intento.
const esperar = (milisegundos) =>
  new Promise((resolver) =>
    setTimeout(resolver, milisegundos)
  )

// Obtiene y valida los productos desde el archivo JSON.
const obtenerProductos = async () => {
  let ultimoError = null

  for (
    let intento = 1;
    intento <= CONFIG_CARGA.intentosMaximos;
    intento += 1
  ) {
    try {
      const respuesta = await fetch(
        `${import.meta.env.BASE_URL}productos.json`
      )

      if (!respuesta.ok) {
        const errorHttp = new Error(
          `HTTP ${respuesta.status}: ${respuesta.statusText}`
        )

        errorHttp.codigo = respuesta.status

        throw errorHttp
      }

      const datos = await respuesta.json()

      if (!Array.isArray(datos)) {
        throw new Error(
          "El archivo de productos no contiene una lista válida."
        )
      }

      console.info(
        `Productos cargados correctamente en el intento ${intento}.`
      )

      return datos
    } catch (errorCarga) {
      ultimoError = errorCarga

      console.error(
        `Intento ${intento} de ${CONFIG_CARGA.intentosMaximos} falló:`,
        errorCarga
      )

      const esErrorCliente =
        errorCarga.codigo >= 400 &&
        errorCarga.codigo < 500

      const esUltimoIntento =
        intento === CONFIG_CARGA.intentosMaximos

      // Los errores 4xx normalmente no mejoran con nuevos intentos.
      if (esErrorCliente || esUltimoIntento) {
        break
      }

      console.info(
        `Nuevo intento en ${CONFIG_CARGA.esperaMs} ms...`
      )

      await esperar(CONFIG_CARGA.esperaMs)
    }
  }

  throw ultimoError
}

function App() {
  // Estado que almacena los productos cargados desde el archivo JSON.
  const [productos, setProductos] = useState([])

  // Estado para mostrar un mensaje mientras se cargan los productos.
  const [cargando, setCargando] = useState(true)

  // Estado para controlar posibles errores durante la carga.
  const [error, setError] = useState("")

  // Estado para mostrar mensajes después de las acciones del usuario.
  const [mensaje, setMensaje] = useState("")

  // Estado del buscador.
  const [busqueda, setBusqueda] = useState("")

  // Estado del filtro por categoría.
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState("Todas")

  // Producto seleccionado para confirmar su eliminación.
  const [productoAEliminar, setProductoAEliminar] =
    useState(null)

  // Recupera el carrito guardado en localStorage.
  const [carrito, setCarrito] = useState(() => {
    try {
      const carritoGuardado =
        localStorage.getItem("carrito")

      return carritoGuardado
        ? JSON.parse(carritoGuardado)
        : []
    } catch {
      return []
    }
  })

  // Carga los productos automáticamente al iniciar la aplicación.
  useEffect(() => {
    let componenteActivo = true

    const cargarProductosIniciales = async () => {
      try {
        const datos = await obtenerProductos()

        if (componenteActivo) {
          setProductos(datos)
        }
      } catch (errorCarga) {
        console.error(
          "Error durante la carga de productos:",
          errorCarga
        )

        if (componenteActivo) {
          setError(
            "No fue posible cargar los videojuegos. Intenta nuevamente."
          )
        }
      } finally {
        if (componenteActivo) {
          setCargando(false)
        }
      }
    }

    cargarProductosIniciales()

    return () => {
      componenteActivo = false
    }
  }, [])

  // Guarda automáticamente el carrito cada vez que cambia.
  useEffect(() => {
    localStorage.setItem(
      "carrito",
      JSON.stringify(carrito)
    )
  }, [carrito])

  // Oculta automáticamente las notificaciones.
  useEffect(() => {
    if (!mensaje) return

    const temporizador = setTimeout(() => {
      setMensaje("")
    }, 2500)

    return () => clearTimeout(temporizador)
  }, [mensaje])

  // Permite volver a intentar la carga después de un error.
  const reintentarCarga = async () => {
    try {
      setCargando(true)
      setError("")

      const datos = await obtenerProductos()

      setProductos(datos)
    } catch (errorCarga) {
      console.error(
        "Error durante el reintento:",
        errorCarga
      )

      setError(
        "No fue posible cargar los videojuegos. Intenta nuevamente."
      )
    } finally {
      setCargando(false)
    }
  }

  // Agrega un producto al carrito.
  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {
      const productoExistente = carritoActual.find(
        (item) => item.id === producto.id
      )

      if (productoExistente) {
        return carritoActual.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
              }
            : item
        )
      }

      return [
        ...carritoActual,
        {
          ...producto,
          cantidad: 1,
        },
      ]
    })

    setMensaje(
      `${producto.nombre} fue agregado al carrito.`
    )
  }

  // Abre el modal de confirmación.
  const solicitarEliminacion = (id) => {
    const productoSeleccionado = carrito.find(
      (producto) => producto.id === id
    )

    if (!productoSeleccionado) return

    setProductoAEliminar(productoSeleccionado)
  }

  // Cancela la eliminación.
  const cancelarEliminacion = () => {
    setProductoAEliminar(null)
  }

  // Confirma la eliminación.
  const confirmarEliminacion = () => {
    if (!productoAEliminar) return

    const nombreProducto =
      productoAEliminar.nombre

    setCarrito((carritoActual) =>
      carritoActual.filter(
        (producto) =>
          producto.id !== productoAEliminar.id
      )
    )

    setProductoAEliminar(null)

    setMensaje(
      `${nombreProducto} fue eliminado del carrito.`
    )
  }

  // Obtiene las categorías únicas disponibles.
  const categorias = [
    ...new Set(
      productos.map((producto) => producto.categoria)
    ),
  ]

  // Filtra por nombre y categoría.
  const productosFiltrados = productos.filter(
    (producto) => {
      const coincideBusqueda = producto.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase())

      const coincideCategoria =
        categoriaSeleccionada === "Todas" ||
        producto.categoria === categoriaSeleccionada

      return coincideBusqueda && coincideCategoria
    }
  )

  // Calcula la cantidad total de productos del carrito.
  const cantidadTotal = carrito.reduce(
    (total, producto) =>
      total + producto.cantidad,
    0
  )

  return (
    <>
      <Navbar />

      <header
        className="header"
        id="inicio"
      >
        <div className="header-contenido">
          <h1>Portal Gamer</h1>

          <p>Tu tienda de videojuegos</p>

          <div className="contador-carrito">
            Carrito: {cantidadTotal} producto(s)
          </div>
        </div>
      </header>

      <main>
        <div className="contenedor">
          {mensaje && (
            <div
              className="notificacion"
              role="status"
            >
              {mensaje}
            </div>
          )}

          <section id="productos">
            <div className="buscador">
              <label htmlFor="buscarProducto">
                Buscar videojuego
              </label>

              <input
                id="buscarProducto"
                type="text"
                placeholder="Ejemplo: Minecraft"
                value={busqueda}
                onChange={(evento) =>
                  setBusqueda(evento.target.value)
                }
              />
            </div>

            <FiltroCategorias
              categorias={categorias}
              categoriaSeleccionada={
                categoriaSeleccionada
              }
              onCambiarCategoria={
                setCategoriaSeleccionada
              }
            />

            {cargando ? (
              <p className="estado-carga">
                Cargando videojuegos...
              </p>
            ) : error ? (
              <div className="estado-error">
                <p>{error}</p>

                <button
                  className="btn-reintentar"
                  onClick={reintentarCarga}
                >
                  Reintentar
                </button>
              </div>
            ) : productosFiltrados.length > 0 ? (
              <ListaProductos
                productos={productosFiltrados}
                agregarAlCarrito={
                  agregarAlCarrito
                }
                carrito={carrito}
              />
            ) : (
              <p className="sin-resultados">
                No se encontraron videojuegos para los
                filtros seleccionados.
              </p>
            )}
          </section>

          <Carrito
            carrito={carrito}
            eliminarDelCarrito={
              solicitarEliminacion
            }
          />
        </div>

        <ContactoForm />
      </main>

      <footer className="footer">
        <p>
          Portal Gamer - Desarrollo Frontend I
        </p>
      </footer>

      {productoAEliminar && (
        <ModalConfirmacion
          producto={productoAEliminar}
          onConfirmar={confirmarEliminacion}
          onCancelar={cancelarEliminacion}
        />
      )}
    </>
  )
}

export default App