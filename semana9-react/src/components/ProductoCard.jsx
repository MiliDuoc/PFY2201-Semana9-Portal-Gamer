function ProductoCard({
  producto,
  agregarAlCarrito,
  estaEnCarrito,
}) {
  return (
    <div className="card h-100 shadow-sm border-0 producto-card">
      <img
        src={`${import.meta.env.BASE_URL}${producto.imagen}`}
        alt={producto.nombre}
        className="card-img-top producto-imagen"
      />

      <div className="card-body d-flex flex-column">
        <span className="badge text-bg-secondary align-self-start mb-2">
          {producto.categoria}
        </span>

        <h3 className="card-title h5">
          {producto.nombre}
        </h3>

        <p className="card-text producto-descripcion">
          {producto.descripcion}
        </p>

        <div className="mt-auto">
          <p className="precio-normal mb-1">
            Precio normal: $
            {producto.precioNormal.toLocaleString("es-CL")}
          </p>

          <p className="precio-oferta mb-3">
            Oferta: $
            {producto.precioOferta.toLocaleString("es-CL")}
          </p>

          <button
            type="button"
            className={
              estaEnCarrito
                ? "btn btn-success w-100"
                : "btn btn-primary w-100"
            }
            onClick={() => agregarAlCarrito(producto)}
          >
            {estaEnCarrito
              ? "En el carrito ✓"
              : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductoCard