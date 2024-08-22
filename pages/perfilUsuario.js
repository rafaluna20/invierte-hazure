import Layout from "@/components/layout/Layout";
import { Campo, InputSubmit } from "@/components/ui/Formulario";
import { FirebaseContext } from "@/firebase";
import { signInUser } from "@/Validacion/autenticarContraseña";
import obtenerPhone from "@/Validacion/obtenerPhone";
import styled from "@emotion/styled";
import React, { useContext, useEffect, useState } from "react";
import { css } from "@emotion/react";
import Mensaje from "@/components/ui/Mensaje";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  sendEmailVerification,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import Router from "next/router";
import actualizarPhone from "@/Validacion/actualizarPhone";

const ContenedorInversiones = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  h1 {
    text-align: center;
    text-transform: uppercase;
    font-size: 3.5rem;
    margin-top: 20px;
  }
  @media (min-width: 1000px) {
    margin-left: 300px;
  }
  .campos {
    width: 50%;
  }
`;

const Contenedor = styled.div`
  position: fixed;
  z-index: 200;
  background-color: rgb(0 0 0 / 0.92);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .cerrar-modal {
    position: absolute;
    right: 3rem;
    top: 3rem;
    width: 2rem;
    height: 2rem;
    z-index: 2;
    img {
      width: 100%;
    }
  }
  form {
    width: 400px;
    margin: 0 auto;
    padding: 3rem 0;
    legend {
      font-size: 3.5rem;
      text-align: center;
      display: block;
      text-transform: uppercase;
      color: white;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #3b82f6;
    }
    .campo {
      display: grid;
      margin-bottom: 2rem;
    }
    label {
      color: white;
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    input[type="text"],
    input[type="number"],
    input[type="email"],
    input[type="password"] {
      background-color: white;
      border-radius: 1rem;
      padding: 1rem;
      border: none;
      flex: 1;
      font-size: 1.5rem;
    }
    input[type="submit"] {
      background-color: #1048a4;
      border: none;
      padding: 1rem;
      text-align: center;
      color: white;
      font-weight: 900;
      text-transform: uppercase;
      font-size: 1.5rem;
      width: 100%;
      transition: background-color 300ms ease;
      :hover {
        background-color: #042a67;
        cursor: pointer;
      }
    }
    select {
      flex: 1;
      padding: 0.8rem;
      border: none;
      border-radius: 1rem;
      text-align: center;
      background-color: white;
    }
  }
  label {
    color: white;
    text-align: left;
  }
  .formulario.animar {
    position: relative;
    opacity: 1;
    z-index: 1;
  }
  .formulario.cerrar {
    opacity: 0;
  }
`;
const perfilUsuario = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [paseModalDatos, setPaseModalDatos] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { usuario, firebase } = useContext(FirebaseContext);
  const [mensaje, setMensaje] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [datosUser, setDatosUser] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });
  useEffect(() => {
    const obtenerDatos = async () => {
      if (usuario) {
        const numberPhone = await obtenerPhone(usuario.uid);

        setDatosUser({
          nombre: usuario.displayName,
          email: usuario.email,
          telefono: numberPhone,
        });
      }
    };
    obtenerDatos();
  }, [usuario, paseModalDatos]);
  const isNumeric = (str) => {
    return /^\d+$/.test(str);
  };
  const regex = /^9\d{8}$/;
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name !== "password" && name !== "newPassword") {
      if (name === "telefono" && name === "newPassword") {
        if (!isNumeric(value) && value !== "") {
          return;
        }
      }
      setDatosUser({
        ...datosUser,
        [name]: value,
      });
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    }
  };
  const handleSumit = async (e) => {
    e.preventDefault();
    const comprobarPassword = await signInUser(usuario?.email, password);

    if (Object.values(datosUser).includes("") || password === "") {
      setMensaje("Todos los campos son obligatorios");
      return;
    }
    if (isChecked && newPassword === "") {
      setMensaje("Todos los campos son obligatorios");
      return;
    }
    if (isChecked && newPassword.length < 6) {
      setMensaje("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (datosUser.telefono.length < 9) {
      setMensaje("El número de celular debe tener 9 dígitos");
      return;
    }

    if (!regex.test(datosUser.telefono)) {
      setMensaje("Número de celular no válido. Debe empezar con 9");
      return;
    }

    if (!comprobarPassword) {
      setMensaje("Contraseña incorrecta");
      return;
    }

    await updateProfile(user, {
      displayName: datosUser.nombre,
    });
    await actualizarPhone(usuario.uid, datosUser.telefono);
    await updateEmail(user, datosUser.email);
    await sendEmailVerification(user);
    if (isChecked) {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      await firebase.login(datosUser.email, newPassword);
    } else {
      await firebase.login(datosUser.email, password);
    }
    setPaseModalDatos(false);
    Router.push("/perfilUsuario");
  };
  useEffect(() => {
    setTimeout(() => {
      setMensaje("");
    }, 2000);
  }, [mensaje]);

  useEffect(() => {
    setDatosUser({
      nombre: "",
      email: "",
      telefono: "",
    });
    setPassword("");
  }, [paseModalDatos]);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  return (
    <>
      {paseModalDatos && (
        <Contenedor className="modal">
          <div
            className="cerrar-modal"
            css={css`
              cursor: pointer;
            `}
          >
            <img
              src="/static/img/cerrar.svg"
              alt="cerrar modal"
              onClick={() => {
                setPaseModalDatos(false);
              }}
            />
          </div>
          <form className="formulario" onSubmit={handleSumit}>
            <legend>Actualizar Datos</legend>

            {mensaje && <Mensaje tipo="error">{mensaje}</Mensaje>}

            <div>
              <label for="check1">
                <input
                  type="checkbox"
                  id="check1"
                  name="opcion1"
                  value="valor1"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                Modificar Contraseña Actual
              </label>
            </div>
            <div className="campo">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                placeholder="Ingrese el nuevo nombre"
                autocomplete="off"
                value={datosUser.nombre}
                onChange={handleChange}
              />
            </div>
            <div className="campo">
              <label htmlFor="email">Email</label>
              <input
                autocomplete="off"
                id="email"
                type="email"
                name="email"
                placeholder="Ingrese el nuevo email"
                value={datosUser.email}
                onChange={handleChange}
              />
            </div>
            <div className="campo">
              <label htmlFor="email">Telefono</label>
              <input
                autocomplete="off"
                id="telefono"
                type="text"
                name="telefono"
                placeholder="Ingrese el nuevo telefono"
                value={datosUser.telefono}
                onChange={handleChange}
                maxLength={9}
              />
            </div>
            {isChecked && (
              <div className="campo">
                <label htmlFor="newPassword">Nueva Contraseña</label>
                <input
                  autocomplete="off"
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  placeholder="Ingrese la nueva contraseña"
                  value={newPassword}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="campo">
              <label htmlFor="password">Contraseña Actual</label>
              <input
                autocomplete="off"
                id="password"
                type="password"
                name="password"
                placeholder="Ingrese la contraseña actual para confirmar"
                value={password}
                onChange={handleChange}
              />
            </div>
            <input type="submit" value="Actualizar Datos" />
          </form>
        </Contenedor>
      )}
      <div>
        <Layout>
          <ContenedorInversiones>
            <h1>Perfil de Usuario</h1>
            <div className="campos">
              <Campo>
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Tu Nombre"
                  value={datosUser.nombre}
                  readOnly
                />
              </Campo>
              <Campo>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Tu Email"
                  value={datosUser.email}
                  readOnly
                />
              </Campo>

              <Campo>
                <label htmlFor="telefono">Telefono</label>
                <input
                  type="telefono"
                  id="telefono"
                  name="telefono"
                  placeholder="Tu telefono"
                  value={datosUser.telefono}
                  readOnly
                />
              </Campo>
              <InputSubmit
                type="submit"
                value="Actualizar Campos"
                onClick={() => {
                  setPaseModalDatos(true);
                }}
              />
            </div>
          </ContenedorInversiones>
        </Layout>
      </div>
    </>
  );
};

export default perfilUsuario;
