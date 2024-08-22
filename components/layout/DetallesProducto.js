import React, { useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import Link from "next/link";
import obtenerPhone from "@/Validacion/obtenerPhone";
import { FirebaseContext } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import MapPage from "../ui/MapaPrueba";
import { css } from "@emotion/react";
const Producto = styled.li`
  padding: 1.2rem;
  border-radius: 20px;
  border: 0.2px solid #4b4b4b;
  margin-bottom: 7px;
  background-color: var(--contBoton);
  display: flex;
  flex-direction: column;
  align-items: center;
  :hover {
    background-color: #000000;
    cursor: pointer;
  }
`;
const DescripcionProducto = styled.div`
  flex: 0 1;
  color: #e1e1e1;
  column-gap: 2rem;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, 1fr); /* Dos columnas de igual ancho */
  }
`;
const Titulo = styled.a`
  font-size: 1.8rem;
  font-weight: bold;
  color: #e1e1e1;
  margin: 0;
  :hover {
    cursor: pointer;
    color: blue;
  }
  @media (max-width: 550px) {
    font-size: 1.5rem;
  }
`;
const Precio = styled.p`
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 5px;
  @media (max-width: 550px) {
    font-size: 15px;
    span {
      font-size: 12px;
    }
  }
`;

const TextoDescripcion = styled.p`
  font-size: 1.6rem;
  margin: 0;
  color: #888;
  @media (max-width: 550px) {
    font-size: 1.2rem;
  }
`;
const Comentarios = styled.div`
  font-size: 20px;
  margin-top: rem;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    border: 0.2px solid #4e4f50;
    padding: 0.3rem 1rem;
    margin-right: 2rem;
    height: 30px;
    border-radius: 5px;
    background-color: var(--grisBotones);
  }

  img {
    width: 2rem;
    margin-right: 2rem;
    @media (max-width: 550px) {
      width: 1.5rem;
    }
  }

  p {
    font-size: 1.6rem;
    margin-right: 1rem;
    font-weight: 700;
    &:last-of-type {
      margin: 0;
    }
    @media (max-width: 550px) {
      font-size: 1.2rem;
    }
  }

  .corazon {
    cursor: pointer;
  }
  .bx {
    margin-right: 5px;
    cursor: pointer;
  }
  .bx-map {
    color: #dc2626;
    cursor: pointer;
  }
  .bxl-whatsapp {
    color: #3ff71a;
  }
`;

// npm i date-fns
const Imagen = styled.img`
  width: 100%;
  height: 100%;
  object-fit: fill;
  border-radius: 15px;
`;

const Votos = styled.div`
  flex: 0 0 auto;
  text-align: center;
  border: 1px solid #e1e1e1;
  padding: 1rem 3rem;
  div {
    font-size: 2rem;
  }
  p {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
  }
  @media (max-width: 550px) {
    padding: 5px;
    div {
      font-size: 1.3rem;
    }
    p {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 700;
    }
  }
`;
const ContenedorImagen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  width: 100%;
  height: 200px;
`;

const Publicado = styled.p`
  @media (max-width: 550px) {
    font-size: 12px;
  }
`;
const ContenedorDatos = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;
const RedesSociales = styled.div`
  display: flex;
  div {
    display: flex;
    align-items: center;
    border: 1px solid #e1e1e1;
    padding: 0.3rem 1rem;
    height: 30px;
    border-radius: 5px;
    font-size: 30px;
    height: 40px;
    :first-child {
      margin-right: 1rem;
    }
  }
  .bx-map {
    color: #dc2626;
  }
  .bxl-whatsapp {
    color: #3ff71a;
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
    cursor: pointer;
    img {
      width: 100%;
    }
  }
`;
const Mapa = styled.div`
  z-index: 1;
  width: 80%;
  height: 60%;
  border: 1px solid #e1e1e1;
  margin-bottom: 20px;
`;
const DetallesProducto = ({ producto }) => {
  const {
    id,
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlimagen,
    votos,
    precio,
    creador,
    cordenadas,
  } = producto;
  console.log(cordenadas);
  const [paseModalMapa, setPaseModalMapa] = useState(false);
  const { usuario, firebase } = useContext(FirebaseContext);
  const [phone, setPhone] = useState();

  const recuperarPhone = async () => {
    if (creador) {
      const phoneUsuario = await obtenerPhone(creador.id);
      setPhone(phoneUsuario);
    }
  };
  const formatearPresupuesto = (cantidad) => {
    return cantidad.toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
    });
  };
  useEffect(() => {
    if (usuario) {
      const usuarioDocRef = doc(firebase.db, "usuarios", creador.id);

      const unsuscribeUsuario = onSnapshot(usuarioDocRef, (usuarioDoc) => {
        if (usuarioDoc.exists() && usuarioDoc.data().phone !== undefined) {
          recuperarPhone();
        }
      });
      return () => {
        unsuscribeUsuario();
      };
    }
  }, [usuario, creador]);
  recuperarPhone();

  return (
    <>
      {paseModalMapa && (
        <Contenedor className="modal">
          <div className="cerrar-modal">
            <img
              src="/static/img/cerrar.svg"
              alt="cerrar modal"
              onClick={() => {
                setPaseModalMapa(false);
              }}
            />
          </div>
          <div
            css={css`
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            `}
          >
            <Mapa id="mapaProducto">
              <MapPage cordenadas={cordenadas} />
            </Mapa>
          </div>
        </Contenedor>
      )}
      <Producto>
        <ContenedorImagen>
          <Imagen src={urlimagen[0]} />
        </ContenedorImagen>
        <DescripcionProducto>
          <ContenedorDatos>
            <Link href="/productos/[id]" as={`/productos/${id}`}>
              <Titulo>{nombre}</Titulo>
            </Link>
            {/* <TextoDescripcion>{descripcion}</TextoDescripcion> */}
            <Precio>{formatearPresupuesto(parseInt(precio))}</Precio>
            <Comentarios>
              <div>
                <i class="bx bx-message-rounded-dots"></i>{" "}
                <p>{comentarios.length}</p>
              </div>
              <div className="corazon">
                <i className="bx bx-heart"></i>
                <p>{votos}</p>
              </div>
              <div
                className="ubicacion"
                onClick={() => {
                  setPaseModalMapa(true);
                }}
              >
                <i class="bx bx-map"></i>
              </div>
              <a href={`https://wa.me/${phone}`} target="_blank">
                <div className="whatsapp">
                  <i class="bx bxl-whatsapp"></i>
                </div>
              </a>
            </Comentarios>
            <Publicado>
              Publicado hace{" "}
              {formatDistanceToNow(new Date(creado), { locale: es })}
            </Publicado>
          </ContenedorDatos>
        </DescripcionProducto>

        {/* <Votos>
          <div>&#9650;</div>
          <p>{votos}</p>
        </Votos> */}
      </Producto>
      {/* <style jsx>
        {`
          .prueba {
            color: red;
            
          }
        `}
      </style> */}
    </>
  );
};

export default DetallesProducto;
