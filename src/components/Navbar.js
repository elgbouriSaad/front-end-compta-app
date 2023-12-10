import React, { useState } from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function NavBar({ toggleSidebar }) {
  const { i18n } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <Navbar expand="lg" bg="light" variant="light">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setVisible(!visible)} />
        <a variant="secondary" onClick={toggleSidebar} className="ms-2">
          <i className="fa fa-bars text-dark"></i>
        </a>
        <Navbar.Collapse id="basic-navbar-nav" className={visible ? "show" : ""}>
          <Nav className="ms-auto">
            <Dropdown>
              <Dropdown.Toggle variant="secondary">
                {i18n.language === "fr" ? "FR" : "EN"}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-end">
                <Dropdown.Item
                  onClick={() => i18n.changeLanguage(i18n.language === "fr" ? "en" : "fr")}
                >
                  {i18n.language === "fr" ? "EN" : "FR"}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
