import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useTranslation } from "react-i18next";
import { makeApiGetRequest, makeApiPutRequest, makeApiDeleteRequest } from "./ApiUtils";
import Modals from "./Modals";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Pagination from "./Pagination";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const invoicesData = await makeApiGetRequest("/api/v1/invoices");
        setInvoices(invoicesData);

        const clientsData = await makeApiGetRequest("/api/v1/clients");
        const clientsMap = clientsData.reduce((acc, client) => {
          acc[client.id] = client.companyName;
          return acc;
        }, {});
        setClients(clientsMap);

        setLoading(false);
      } catch (fetchError) {
        console.error("Error fetching invoices:", fetchError);
        setError(true);
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleViewClick = (invoiceId) => {
    navigate(`/invoice/${invoiceId}`);
  };

  const handleEditClick = (invoiceId) => {
    navigate(`/invoice/${invoiceId}?editMode=true`);
  };

  const handleDeleteClick = (invoiceId) => {
    setShowModal(true);
    setDeleteInvoiceId(invoiceId);
  };

  const handleDelete = async () => {
    try {
      await makeApiDeleteRequest(`/api/v1/invoices/${deleteInvoiceId}`);
      setShowModal(false);
      setDeleteInvoiceId(null);
      window.location.reload();
    } catch (deleteError) {
      console.error("Error deleting invoice:", deleteError);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDeleteInvoiceId(null);
  };

  const toggleDropdown = (index) => {
    if (openDropdown === index) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(index);
    }
  };

  const isValidateButtonDisabled = (status) => {
    return status !== "SAVED";
  };

  const handleValidateClick = async (invoiceId) => {
    try {
      await makeApiPutRequest(`/api/v1/invoices/validate/${invoiceId}`);
      const refreshedInvoices = await makeApiGetRequest("/api/v1/invoices");
      setInvoices(refreshedInvoices);
    } catch (validationError) {
      console.error("Error validating invoice:", validationError);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.classList.contains("dropdown-item")
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="container">
      <div className="card mt-5">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title">{t("invoiceList.title")}</h4>
          <div>
            <Button variant="primary" onClick={() => navigate("/invoice")}>
              {t("add")}
            </Button>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <p>{t("loading")}</p>
          ) : error ? (
            <p>{t("error")}</p>
          ) : (
            <div className="table-responsive rounded-2">
              <Table bordered hover>
                <thead className="table-secondary">
                  <tr>
                    <th>{t("status")}</th>
                    <th>{t("paymentDelay")}</th>
                    <th>{t("clientCompanyName")}</th>
                    <th>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.slice(startIndex, endIndex).map((invoice, index) => (
                    <tr
                      key={invoice.id}
                      onClick={() => handleViewClick(invoice.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{invoice.status}</td>
                      <td>{invoice.paymentDelay}</td>
                      <td>{clients[invoice.clientId]}</td>
                      <td>
                        <div className="d-flex justify-content-center" ref={dropdownRef}>
                          <button
                            role="button"
                            type="button"
                            data-testid="dropdown-button"
                            className="btn"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded={openDropdown === index}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(index);
                            }}
                          >
                            <i className="fas fa-ellipsis-v"></i>
                          </button>
                          <div className={`dropdown-menu ${openDropdown === index ? "show" : ""}`}>
                            <button
                              role="button"
                              type="button"
                              className="dropdown-item text-info"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewClick(invoice.id);
                              }}
                            >
                              {t("view")}
                            </button>
                            <button
                              role="button"
                              type="button"
                              className="dropdown-item text-warning"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(invoice.id);
                              }}
                            >
                              {t("edit")}
                            </button>
                            <button
                              role="button"
                              type="button"
                              className="dropdown-item text-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(invoice.id);
                              }}
                            >
                              {t("delete")}
                            </button>
                            <button
                              role="button"
                              type="button"
                              className="dropdown-item text-success"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleValidateClick(invoice.id);
                              }}
                              hidden={isValidateButtonDisabled(invoice.status)}
                            >
                              {t("validate")}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          <Row>
            <Col xs="6">
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="itemsPerPageDropdown">
                  {t("itemsPerPage")}: {itemsPerPage}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleItemsPerPageChange(5)}>5</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleItemsPerPageChange(10)}>10</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleItemsPerPageChange(20)}>20</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col xs="6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
              />
            </Col>
          </Row>
        </div>
      </div>
      <Modals
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handleDelete={handleDelete}
        t={t}
      />
    </div>
  );
}
