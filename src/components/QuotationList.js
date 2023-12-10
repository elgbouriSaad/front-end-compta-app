import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import { useTranslation } from "react-i18next";
import { makeApiGetRequest, makeApiPutRequest, makeApiDeleteRequest } from "./ApiUtils";
import Modals from "./Modals";
import Pagination from "./Pagination";

export default function QuotationList() {
  const [quotations, setQuotations] = useState([]);
  const [clients, setClients] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteQuotationId, setDeleteQuotationId] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const quotationsData = await makeApiGetRequest("/api/v1/quotations");
        setQuotations(quotationsData);

        const clientsData = await makeApiGetRequest("/api/v1/clients");
        const clientsMap = clientsData.reduce((acc, client) => {
          acc[client.id] = client.companyName;
          return acc;
        }, {});
        setClients(clientsMap);

        setLoading(false);
      } catch (fetchError) {
        console.error("Error fetching quotations:", fetchError);
        setError(true);
        setLoading(false);
      }
    };

    fetchQuotations();
  }, []);

  const handleViewClick = (quotationId) => {
    navigate(`/quotation/${quotationId}`);
  };

  const handleDeleteClick = (quotationId) => {
    setShowModal(true);
    setDeleteQuotationId(quotationId);
  };

  const handleDelete = async () => {
    try {
      await makeApiDeleteRequest(`/api/v1/quotations/${deleteQuotationId}`);
      setShowModal(false);
      setDeleteQuotationId(null);
      window.location.reload();
    } catch (deleteError) {
      console.error("Error deleting quotation:", deleteError);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDeleteQuotationId(null);
  };

  const toggleDropdown = (index) => {
    if (openDropdown === index) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(index);
    }
  };

  const isTransformButtonDisabled = (status) => {
    return status !== "VALIDATED";
  };

  const handleTransformClick = (quotationId) => {
    navigate(`/quotation-transform/${quotationId}`);
  };

  const isValidateButtonDisabled = (status) => {
    return status !== "SAVED";
  };

  const handleValidateClick = async (quotationId) => {
    try {
      await makeApiPutRequest(`/api/v1/quotations/validate/${quotationId}`);
      const refreshedQuotations = await makeApiGetRequest("/api/v1/quotations");
      setQuotations(refreshedQuotations);
    } catch (validationError) {
      console.error("Error validating quotation:", validationError);
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

  const totalPages = Math.ceil(quotations.length / itemsPerPage);

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
          <h4 className="card-title">{t("quotationList.title")}</h4>
          <Button variant="primary" onClick={() => navigate("/quotation")}>
            {t("add")}
          </Button>
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
                    <th>{t("validationDelay")}</th>
                    <th>{t("clientCompanyName")}</th>
                    <th>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {quotations.slice(startIndex, endIndex).map((quotation, index) => (
                    <tr
                      key={quotation.id}
                      onClick={() => handleViewClick(quotation.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{quotation.status}</td>
                      <td>{quotation.validationDelay}</td>
                      <td>{clients[quotation.clientId]}</td>
                      <td>
                        <div className="d-flex justify-content-center" ref={dropdownRef}>
                          <button
                            role="button"
                            type="button"
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
                                handleViewClick(quotation.id);
                              }}
                            >
                              {t("view")}
                            </button>
                            <button
                              role="button"
                              type="button"
                              className="dropdown-item text-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(quotation.id);
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
                                handleTransformClick(quotation.id);
                              }}
                              hidden={isTransformButtonDisabled(quotation.status)}
                            >
                              {t("transform")}
                            </button>
                            <button
                              role="button"
                              type="button"
                              className="dropdown-item text-success"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleValidateClick(quotation.id);
                              }}
                              hidden={isValidateButtonDisabled(quotation.status)}
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
