import React, { act, useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import { FirebaseContext } from "@/firebase";
import { useRouter } from "next/router";
const Barra = styled.div`
  background-color: black;
  z-index: 100;
  width: 30%;
  height: 100vh;
  position: fixed;
  margin-top: -10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  display: none;
  @media (min-width: 1000px) {
    width: 300px;
    display: block;
  }
  a {
    font-size: 1.8rem;
    margin-left: 2rem;
    color: white;
    font-family: "PT Sans", sans-serif;
    &:first-of-type {
      margin-left: 0rem;
    }
    &:last-of-type {
      margin-right: 0rem;
    }
    @media (max-width: 1000px) {
      display: none;
    }
  }
`;
const Logo = styled.div`
  margin-bottom: 20px;
  .iconoEscritorio {
    width: 100%;
  }
  .iconoCelular {
    display: none;
  }
  @media (max-width: 800px) {
    .iconoEscritorio {
      display: none;
    }
    .iconoCelular {
      display: block;
      width: 30px;
      margin-right: 40px;
      margin-left: 5px;
    }
  }
`;
const ContenedorEnlaces = styled.div`
  color: white;
  font-size: 20px;
  .bx {
    font-size: 30px;
    margin-right: 5px;
  }
  div {
    display: flex;
    margin-bottom: 15px;
    padding: 10px 30px;

    :hover {
      cursor: pointer;
      background-color: var(--botones);
    }
  }
`;
const BarraLateral = () => {
  const [active, setActive] = useState("/");
  const { firebase, usuario } = useContext(FirebaseContext);
  const router = useRouter();
  const path = router.pathname;
  useEffect(() => {
    setActive(path);
    console.log(path);
  }, [path]);

  return (
    <Barra>
      <Link
        href="/"
        onClick={() => {
          localStorage.clear();
        }}
      >
        <Logo>
          <img src="/static/img/logo.png" className="iconoCelular" />
          <img src="/static/img/future.png" className="iconoEscritorio" />
        </Logo>
      </Link>
      <ContenedorEnlaces>
        <Link
          href="/"
          onClick={() => {
            localStorage.clear();
            setActive("/");
          }}
        >
          <div
            style={{
              backgroundColor: `${active == "/" ? "var(--botones)" : ""}`,
            }}
          >
            <i class="bx bx-home"></i>
            <span>Inicio</span>
          </div>
        </Link>

        <Link
          href="/populares"
          onClick={() => {
            localStorage.clear();
            setActive("/populares");
          }}
        >
          <div
            style={{
              backgroundColor: `${active == "/populares" && "var(--botones)"}`,
            }}
          >
            <i class="bx bx-star"></i> <span>Populares</span>
          </div>
        </Link>

        {usuario && (
          <>
            <Link
              href="/nuevoProducto"
              onClick={() => {
                localStorage.clear();
                setActive("/nuevoProducto");
              }}
            >
              <div
                style={{
                  backgroundColor: `${
                    active == "/nuevoProducto" && "var(--botones)"
                  }`,
                }}
              >
                <i class="bx bx-folder-plus"></i> <span>Nuevo Producto</span>
              </div>
            </Link>
            <Link
              href="/misInversiones"
              onClick={() => {
                localStorage.clear();
                setActive("/misInversiones");
              }}
            >
              <div
                style={{
                  backgroundColor: `${
                    active == "/misInversiones" && "var(--botones)"
                  }`,
                }}
              >
                <i class="bx bx-objects-vertical-bottom"></i>
                <span>Mis Inversiones</span>
              </div>
            </Link>
            <Link
              href="/billetera"
              onClick={() => {
                localStorage.clear();
                setActive("/billetera");
              }}
            >
              <div
                style={{
                  backgroundColor: `${
                    active == "/billetera" && "var(--botones)"
                  }`,
                }}
              >
                <i class="bx bx-checkbox-minus"></i> <span>Billetera</span>
              </div>
            </Link>
          </>
        )}
      </ContenedorEnlaces>
    </Barra>
  );
};

export default BarraLateral;
