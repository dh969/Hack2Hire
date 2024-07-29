import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import Form from "react-bootstrap/Form";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
const airports = [
  { name: "Hartsfield-Jackson Atlanta International Airport", iata: "ATL" },
  { name: "Los Angeles International Airport", iata: "LAX" },
  { name: "O'Hare International Airport", iata: "ORD" },
  { name: "Dallas/Fort Worth International Airport", iata: "DFW" },
  { name: "Denver International Airport", iata: "DEN" },
  { name: "John F. Kennedy International Airport", iata: "JFK" },
  { name: "San Francisco International Airport", iata: "SFO" },
  { name: "Seattle-Tacoma International Airport", iata: "SEA" },
  { name: "McCarran International Airport", iata: "LAS" },
  { name: "Orlando International Airport", iata: "MCO" },
  { name: "London Heathrow Airport", iata: "LHR" },
  { name: "Tokyo Haneda Airport", iata: "HND" },
  { name: "Paris Charles de Gaulle Airport", iata: "CDG" },
  { name: "Dubai International Airport", iata: "DXB" },
  { name: "Amsterdam Airport Schiphol", iata: "AMS" },
  { name: "Frankfurt Airport", iata: "FRA" },
  { name: "Hong Kong International Airport", iata: "HKG" },
  { name: "Singapore Changi Airport", iata: "SIN" },
  { name: "Sydney Airport", iata: "SYD" },
  { name: "Toronto Pearson International Airport", iata: "YYZ" },
  { name: "Indira Gandhi International Airport, Delhi", iata: "DEL" },
  {
    name: "Chhatrapati Shivaji Maharaj International Airport, Mumbai",
    iata: "BOM",
  },
  { name: "Kempegowda International Airport, Bengaluru", iata: "BLR" },
  { name: "Chennai International Airport", iata: "MAA" },
  {
    name: "Netaji Subhas Chandra Bose International Airport, Kolkata",
    iata: "CCU",
  },
  {
    name: "Dubai World Central - Al Maktoum International Airport",
    iata: "DWC",
  },
  { name: "Narita International Airport", iata: "NRT" },
  { name: "Kansai International Airport", iata: "KIX" },
  { name: "Chubu Centrair International Airport", iata: "NGO" },
  { name: "Fukuoka Airport", iata: "FUK" },
];

const Flights = () => {
  const [filters, setFilters] = useState({ from: "", to: "", date: "" });
  const [availableDestinations, setAvailableDestinations] = useState(airports);
  const navigate = useNavigate();

  useEffect(() => {
    if (filters.from) {
      setAvailableDestinations(
        airports.filter((airport) => airport.iata !== filters.from)
      );
    } else {
      setAvailableDestinations(airports);
    }
  }, [filters.from]);

  const fetchFlights = async () => {
    try {
      const response = await fetch(
        `http://api.aviationstack.com/v1/flights?access_key=6a63215c70c13db6172bbddade2921b9&dep_iata=${filters.from}&arr_iata=${filters.to}`
      );
      const data = await response.json();
      console.log("API response:", data); // Log the API response
      navigate("/results", { state: { flights: data.data, filters } });
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  const handleFromChange = (e) => {
    const newFrom = e.target.value;
    setFilters((prev) => ({
      ...prev,
      from: newFrom,
      to: prev.to === newFrom ? "" : prev.to,
    }));
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100"
    >
      <Row className="w-100">
        <Col md={8} lg={6} className="mx-auto">
          <div className="form-container border p-4 rounded shadow bg-light">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Departure Airport</Form.Label>
                <Form.Select onChange={handleFromChange} value={filters.from}>
                  <option value="">Select Departure Airport</option>
                  {airports.map((airport) => (
                    <option key={airport.iata} value={airport.iata}>
                      {airport.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Arrival Airport</Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setFilters({ ...filters, to: e.target.value })
                  }
                  value={filters.to}
                  disabled={!filters.from}
                >
                  <option value="">Select Destination Airport</option>
                  {availableDestinations.map((airport) => (
                    <option key={airport.iata} value={airport.iata}>
                      {airport.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) =>
                    setFilters({ ...filters, date: e.target.value })
                  }
                  value={filters.date}
                />
              </Form.Group>

              <Button
                onClick={fetchFlights}
                disabled={!filters.from || !filters.to || !filters.date}
                className="w-100"
              >
                Search
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Flights;
