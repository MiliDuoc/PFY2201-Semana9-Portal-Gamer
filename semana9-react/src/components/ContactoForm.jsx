import { useState } from "react"

function ContactoForm() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  })

  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)

  // Actualiza los datos del formulario mientras el usuario escribe.
  const manejarCambio = (evento) => {
    const { name, value } = evento.target

    setFormulario((datosActuales) => ({
      ...datosActuales,
      [name]: value,
    }))

    setErrores((erroresActuales) => ({
      ...erroresActuales,
      [name]: "",
    }))

    setEnviado(false)
  }

  // Valida los campos antes de permitir el envío.
  const validarFormulario = () => {
    const nuevosErrores = {}

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre =
        "Ingresa tu nombre."
    }

    if (!formulario.email.trim()) {
      nuevosErrores.email =
        "Ingresa tu correo electrónico."
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formulario.email
      )
    ) {
      nuevosErrores.email =
        "Ingresa un correo electrónico válido."
    }

    if (!formulario.mensaje.trim()) {
      nuevosErrores.mensaje =
        "Escribe un mensaje."
    } else if (formulario.mensaje.trim().length < 10) {
      nuevosErrores.mensaje =
        "El mensaje debe contener al menos 10 caracteres."
    }

    return nuevosErrores
  }

  const manejarEnvio = (evento) => {
    evento.preventDefault()

    const nuevosErrores = validarFormulario()

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      setEnviado(false)
      return
    }

    setErrores({})
    setEnviado(true)

    setFormulario({
      nombre: "",
      email: "",
      mensaje: "",
    })
  }

  return (
    <section
      id="contacto"
      className="contacto py-5"
      aria-labelledby="tituloContacto"
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 p-md-5">
                <h2
                  id="tituloContacto"
                  className="mb-3"
                >
                  Contacto
                </h2>

                <p className="text-secondary mb-4">
                  ¿Tienes alguna consulta? Escríbenos y
                  nos pondremos en contacto contigo.
                </p>

                {enviado && (
                  <div
                    className="alert alert-success"
                    role="status"
                  >
                    Tu mensaje fue enviado correctamente.
                  </div>
                )}

                <form
                  onSubmit={manejarEnvio}
                  noValidate
                >
                  <div className="mb-3">
                    <label
                      htmlFor="nombre"
                      className="form-label"
                    >
                      Nombre
                    </label>

                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      className={`form-control ${
                        errores.nombre
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formulario.nombre}
                      onChange={manejarCambio}
                      placeholder="Ejemplo: Militza"
                    />

                    {errores.nombre && (
                      <div className="invalid-feedback">
                        {errores.nombre}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="form-label"
                    >
                      Correo electrónico
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`form-control ${
                        errores.email
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formulario.email}
                      onChange={manejarCambio}
                      placeholder="nombre@correo.cl"
                    />

                    {errores.email && (
                      <div className="invalid-feedback">
                        {errores.email}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="mensaje"
                      className="form-label"
                    >
                      Mensaje
                    </label>

                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows="5"
                      className={`form-control ${
                        errores.mensaje
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formulario.mensaje}
                      onChange={manejarCambio}
                      placeholder="Escribe tu consulta..."
                    />

                    {errores.mensaje && (
                      <div className="invalid-feedback">
                        {errores.mensaje}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                  >
                    Enviar mensaje
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactoForm