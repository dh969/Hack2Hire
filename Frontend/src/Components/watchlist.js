import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Ensure your CSS file is imported

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchWatchlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/watchlist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setWatchlist(data);
      setLoading(false);
    } catch (e) {
      console.error("Error fetching watchlist:", e);
      setError("Failed to fetch watchlist. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();

    // Set up polling to refresh data every 60 seconds
    const pollInterval = setInterval(() => {
      fetchWatchlist();
    }, 60000);

    return () => clearInterval(pollInterval); // Clean up on component unmount
  }, [navigate]);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <h2 className="my-4">Error</h2>
        <p>{error}</p>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="my-4">Watchlist</h2>
      {watchlist.length === 0 ? (
        <p>No watchlist items found</p>
      ) : (
        watchlist.map((item) => (
          <Card key={item.id} className="mb-3">
            <Card.Body>
              <Card.Title>
                {item.airline_name} Flight {item.flight_iata}{" "}
                <span className="blinking">Live</span>
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Status: {item.current_status}
              </Card.Subtitle>
              <Row>
                <Col md={6}>
                  <h5>Departure</h5>
                  <p>Gate: {item.departure_gate || "N/A"}</p>
                  <p>Airport: {item.departure_airport}</p>
                  <p>Time: {new Date(item.departure_time).toLocaleString()}</p>
                </Col>
                <Col md={6}>
                  <h5>Arrival</h5>
                  <p>Gate: {item.arrival_gate || "N/A"}</p>
                  <p>Airport: {item.arrival_airport}</p>
                  <p>Time: {new Date(item.arrival_time).toLocaleString()}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Watchlist;
