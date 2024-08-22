import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/css";

const Contenedor = styled.div`
  width: 100%;
  height: 300px;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 20px;
  @media (max-width: 500px) {
    height: 200px;
  }
  @media (min-width: 1000px) {
    width: calc(100% - 300px);
  }
`;
const Image = styled.img`
  width: 100%;
  height: 280px;
  cursor: pointer;
  border-radius: 20px;
  @media (max-width: 500px) {
    height: 180px;
  }
`;

const SliderProducto = ({ images }) => {
  return (
    <>
      <Contenedor className="container">
        <Splide
          aria-label="My Favorite Images"
          options={{
            rewind: true,
            gap: "1rem",
            autoplay: true,
            interval: "1000",
          }}
        >
          {images.map((imagen, i) => (
            <SplideSlide key={i}>
              <Image src={imagen} alt="Picture of the author" />
            </SplideSlide>
          ))}
        </Splide>
      </Contenedor>
    </>
  );
};

export default SliderProducto;
