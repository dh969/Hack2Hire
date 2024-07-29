import { React, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Flights from "./Components/Flights";
import FlightResults from "./Components/FlightResults";
import Signup from "./Components/signup";
import Login from "./Components/login";
import Watchlist from "./Components/watchlist";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token") && !!localStorage.getItem("email")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(
        !!localStorage.getItem("token") && !!localStorage.getItem("email")
      );
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">
              Flight Search
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
                {isLoggedIn && (
                  <Nav.Link as={Link} to="/watchlist">
                    Watchlist
                  </Nav.Link>
                )}
              </Nav>
              <Nav className="ms-auto">
                {" "}
                {/* Use ms-auto for right alignment */}
                {!isLoggedIn && (
                  <>
                    <Nav.Link as={Link} to="/signup">
                      Signup
                    </Nav.Link>
                    <Nav.Link as={Link} to="/login">
                      Login
                    </Nav.Link>
                  </>
                )}
                {isLoggedIn && (
                  <Nav.Link
                    as={Link}
                    to="/"
                    onClick={handleLogout}
                    className="text-danger"
                  >
                    Logout
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mb-3">
          <Routes>
            <Route path="/" element={<Flights />} />
            <Route path="/results" element={<FlightResults />} />
            <Route
              path="/signup"
              element={<Signup setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route
              path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/watchlist" element={<Watchlist />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
};

export default App;
