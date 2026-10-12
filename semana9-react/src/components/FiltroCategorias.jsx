function FiltroCategorias({
  categorias,
  categoriaSeleccionada,
  onCambiarCategoria,
}) {
  return (
    <div className="filtro-categorias mb-4">
      <label
        htmlFor="categoria"
        className="form-label fw-semibold"
      >
        Filtrar por categoría
      </label>

      <select
        id="categoria"
        className="form-select"
        value={categoriaSeleccionada}
        onChange={(evento) =>
          onCambiarCategoria(evento.target.value)
        }
      >
        <option value="Todas">
          Todas las categorías
        </option>

        {categorias.map((categoria) => (
          <option
            key={categoria}
            value={categoria}
          >
            {categoria}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FiltroCategorias