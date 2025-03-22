import React from 'react';
import styled from 'styled-components';

// Styled components for styling
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 50px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
  }
`;

const TextSection = styled.div`
  max-width: 50%;
  
  @media (max-width: 768px) {
    max-width: 100%;
    text-align: center;
    margin-bottom: 30px;
  }
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #2b2d42;
  margin-bottom: 30px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const SubTitle = styled.p`
  font-size: 18px;
  color: #5f6368;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Button = styled.a`
  background-color: white;
  color: #365486; 
  padding: 10px 20px;
  border: 2px solid #365486; 
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: #365486; 
    color: white; // Cambiar el color del texto a blanco al hacer hover
  }

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;


const Illustration = styled.div`
max-width: 50%;
img {
    max-width: 100%;
    height: auto;
    margin: o center;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    text-align: center;
  }
`;

const LandingPage = () => {
  return (
    <Container>
      <TextSection>
        <Title>Sistema de Gestión de Eventos con Planificación Automática</Title>
        <SubTitle>
        Organiza tus eventos de manera eficiente con nuestra plataforma que automatiza la planificación, <strong>optimiza tiempos</strong> y asegura el éxito en cada evento.
        </SubTitle>
        <Button href='/register'>Registrate</Button>
        <Button href='/login'>Iniciar sesion</Button>
      </TextSection>
      <Illustration>
        <img
          src="img/event_management.webp" // Replace with your own image URL
          alt="Illustration"

        />
      </Illustration>
    </Container>
  );
};

export default LandingPage;
