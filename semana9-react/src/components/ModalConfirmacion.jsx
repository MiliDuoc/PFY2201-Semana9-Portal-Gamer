import { useEffect, useRef } from "react"

function ModalConfirmacion({
  producto,
  onConfirmar,
  onCancelar,
}) {
  const botonCancelarRef = useRef(null)

  // Lleva el foco al modal cuando se abre.
  useEffect(() => {
    botonCancelarRef.current?.focus()
  }, [])

  // Permite cerrar el modal con la tecla Escape.
  useEffect(() => {
    const manejarTeclado = (evento) => {
      if (evento.key === "Escape") {
        onCancelar()
      }
    }

    document.addEventListener("keydown", manejarTeclado)

    return () => {
      document.removeEventListener(
        "keydown",
        manejarTeclado
      )
    }
  }, [onCancelar])

  return (
    <div
      className="modal-confirmacion-fondo"
      role="presentation"
    >
      <div
        className="modal-confirmacion"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalEliminar"
        aria-describedby="descripcionModalEliminar"
      >
        <h2
          id="tituloModalEliminar"
          className="h4 mb-3"
        >
          Confirmar eliminación
        </h2>

        <p
          id="descripcionModalEliminar"
          className="mb-4"
        >
          ¿Deseas eliminar{" "}
          <strong>{producto.nombre}</strong>{" "}
          del carrito?
        </p>

        <div className="d-flex justify-content-end gap-2">
          <button
            ref={botonCancelarRef}
            type="button"
            className="btn btn-secondary"
            onClick={onCancelar}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirmar}
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirmacion