function Carrito({ carrito, eliminarDelCarrito }) {
  // Calcula el valor total considerando la cantidad de cada producto.
  const total = carrito.reduce(
    (acumulador, producto) =>
      acumulador + producto.precioOferta * producto.cantidad,
    0
  )

  // Calcula la cantidad total de unidades agregadas.
  const cantidadTotal = carrito.reduce(
    (acumulador, producto) =>
      acumulador + producto.cantidad,
    0
  )

  return (
    <section className="carrito">
      <h2>Carrito de compras</h2>

      <p>
        Productos en el carrito: <strong>{cantidadTotal}</strong>
      </p>

      {carrito.length === 0 ? (
        <p className="carrito-vacio">
          Tu carrito está vacío.
        </p>
      ) : (
        <>
          <div className="carrito-lista">
            {carrito.map((producto) => (
              <div className="carrito-item" key={producto.id}>
                <div>
                  <strong>{producto.nombre}</strong>

                  <p>
                    Precio: ${producto.precioOferta.toLocaleString("es-CL")}
                  </p>

                  <p>
                    Cantidad: <strong>{producto.cantidad}</strong>
                  </p>

                  <p>
                    Subtotal: $
                    {(
                      producto.precioOferta * producto.cantidad
                    ).toLocaleString("es-CL")}
                  </p>
                </div>

                <button
                  className="btn-eliminar"
                  onClick={() => eliminarDelCarrito(producto.id)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          <p className="carrito-total">
            Total: ${total.toLocaleString("es-CL")}
          </p>
        </>
      )}
    </section>
  )
}

export default Carrito