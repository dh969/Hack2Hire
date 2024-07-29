import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const FlightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flights, filters } = location.state || { flights: [], filters: {} };

  // Ensure flights is an array before filtering
  const safeFlights = Array.isArray(flights) ? flights : [];

  // Filter flights based on the selected date
  const filteredFlights = safeFlights.filter((flight) => {
    const departureDate = new Date(flight.departure.scheduled)
      .toISOString()
      .split("T")[0];
    return departureDate === filters.date;
  });

  const addToWatchlist = async (flight) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }
    console.log(flight);
    const response = await fetch("http://localhost:5000/api/watchlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        flight_iata: flight.flight.iata,
        current_status: flight.flight_status,
        arrival_time: flight.arrival.scheduled,
        arrival_airport: flight.arrival.airport,
        departure_time: flight.departure.scheduled,
        departure_airport: flight.departure.airport,
        airline_name: flight.airline.name,
        arr_iata: flight.arrival.iata,
        dep_iata: flight.departure.iata,
        departure_gate: flight.departure.gate,
        arrival_gate: flight.arrival.gate,
      }),
    });

    if (response.ok) {
      console.log("Flight added to watchlist");
    } else {
      console.log("Failed to add flight to watchlist");
    }
  };

  return (
    <div>
      <h2>Flight Results</h2>
      <p>
        From: {filters.from || "N/A"} To: {filters.to || "N/A"} Date:{" "}
        {filters.date || "N/A"}
      </p>
      {filteredFlights.length === 0 ? (
        <p>No flights found for the selected criteria</p>
      ) : (
        filteredFlights.map((flight, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Card.Title>
                {flight.airline.name} Flight {flight.flight.number}
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Status: {flight.flight_status}
              </Card.Subtitle>
              <Row>
                <Col md={6}>
                  <h5>Departure</h5>
                  <p>
                    Airport: {flight.departure.airport} ({flight.departure.iata}
                    )
                  </p>
                  <p>Terminal: {flight.departure.terminal}</p>
                  <p>Gate: {flight.departure.gate}</p>
                  <p>
                    Scheduled:{" "}
                    {new Date(flight.departure.scheduled).toLocaleString()}
                  </p>
                  <p>
                    Actual:{" "}
                    {flight.departure.actual
                      ? new Date(flight.departure.actual).toLocaleString()
                      : "N/A"}
                  </p>
                  <p>Delay: {flight.departure.delay || "No delay"}</p>
                </Col>
                <Col md={6}>
                  <h5>Arrival</h5>
                  <p>
                    Airport: {flight.arrival.airport} ({flight.arrival.iata})
                  </p>
                  <p>Terminal: {flight.arrival.terminal}</p>
                  <p>Gate: {flight.arrival.gate}</p>
                  <p>
                    Scheduled:{" "}
                    {new Date(flight.arrival.scheduled).toLocaleString()}
                  </p>
                  <p>
                    Actual:{" "}
                    {flight.arrival.actual
                      ? new Date(flight.arrival.actual).toLocaleString()
                      : "N/A"}
                  </p>
                  <p>Delay: {flight.arrival.delay || "No delay"}</p>
                </Col>
              </Row>
              <Button className="mt-3" onClick={() => addToWatchlist(flight)}>
                Add to Watchlist
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default FlightResults;
