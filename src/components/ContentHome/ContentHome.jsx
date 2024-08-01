import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, useLocation,  useNavigate  } from "react-router-dom";
import './ContentHome.css';

const ContentHome = () => {
    const navigate = useNavigate();
  return (
    <Container className="home-content">
      <Row className="align-items-center">
        <Col md={6}>
          <h1 className="home-title">Welcome to Our Barbershop</h1>
          <p className="home-description">
            Experience the best haircut and grooming services with our professional barbers.
          </p>
          <Button onClick={()=>navigate("/pick_date")} className="cta-button" variant="primary">Schedule your appointment</Button>
        </Col>
        <Col md={6} className="image-col">
          <div className="home-image">
            <img src="https://insights.ibx.com/wp-content/uploads/2023/06/kym-barbershop.jpg" alt="Barbershop" />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ContentHome;
