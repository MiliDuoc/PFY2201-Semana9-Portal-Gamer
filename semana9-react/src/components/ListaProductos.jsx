import ProductoCard from "./ProductoCard"

function ListaProductos({
  productos,
  agregarAlCarrito,
  carrito,
}) {
  return (
    <section className="productos">
      <h2 className="mb-3">
        Nuestros videojuegos
      </h2>

      <div className="row g-4">
        {productos.map((producto) => (
          <div
            className="col-12 col-md-6 col-lg-4"
            key={producto.id}
          >
            <ProductoCard
              producto={producto}
              agregarAlCarrito={
                agregarAlCarrito
              }
              estaEnCarrito={carrito.some(
                (item) => item.id === producto.id
              )}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default ListaProductos