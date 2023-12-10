import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import { useTranslation } from "react-i18next";
import { makeApiGetRequest, makeApiDeleteRequest } from "./ApiUtils";
import Modals from "./Modals";
import Pagination from "./Pagination";

export default function ExpenseReportList() {
  const [expenseReports, setExpenseReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteExpenseReportId, setDeleteExpenseReportId] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dropdownRef = useRef(null);

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchExpenseReports = async () => {
      try {
        const data = await makeApiGetRequest("/api/v1/expense_reports");
        setExpenseReports(data);
        setLoading(false);
      } catch (fetchError) {
        console.error("Error fetching expense reports:", fetchError);
        setError(true);
        setLoading(false);
      }
    };

    fetchExpenseReports();
  }, []);

  const handleViewClick = (expenseReportId) => {
    navigate(`/expense-report/${expenseReportId}`);
  };

  const handleEditClick = (expenseReportId) => {
    navigate(`/expense-report/${expenseReportId}?editMode=true`);
  };

  const handleDeleteClick = (expenseReportId) => {
    setShowModal(true);
    setDeleteExpenseReportId(expenseReportId);
  };

  const handleDelete = async () => {
    try {
      await makeApiDeleteRequest(`/api/v1/expense_reports/${deleteExpenseReportId}`);
      setShowModal(false);
      setDeleteExpenseReportId(null);
      window.location.reload();
    } catch (deleteError) {
      console.error("Error deleting expense report:", deleteError);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDeleteExpenseReportId(null);
  };

  const toggleDropdown = (index) => {
    if (openDropdown === index) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(index);
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

  const totalPages = Math.ceil(expenseReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <div className="container">
      <div className="card mt-5">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title">{t("expenseReportList.title")}</h4>
          <Button variant="primary" onClick={() => navigate("/expense-report")}>
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
                    <th>{t("label")}</th>
                    <th>{t("priceExclTax")}</th>
                    <th>{t("qualification")}</th>
                    <th>{t("tax")}</th>
                    <th>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseReports.slice(startIndex, endIndex).map((expenseReport, index) => (
                    <tr
                      key={expenseReport.id}
                      onClick={() => handleViewClick(expenseReport.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{expenseReport.label}</td>
                      <td>{expenseReport.priceExclTax}</td>
                      <td>{expenseReport.qualification}</td>
                      <td>{expenseReport.tax}</td>
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
                                handleViewClick(expenseReport.id);
                              }}
                            >
                              <i className="fa fa-eye icon-space"></i>
                              {t("view")}
                            </button>
                            <button
                              role="button"
                              type="button"
                              className="dropdown-item text-warning"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(expenseReport.id);
                              }}
                            >
                              <i className="fa fa-edit icon-space"></i>
                              {t("edit")}
                            </button>
                            <button
                              role="button"
                              type="button"
                              className="dropdown-item text-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(expenseReport.id);
                              }}
                            >
                              <i className="fa fa-trash icon-space"></i>
                              {t("delete")}
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
                  <Dropdown.Item onClick={() => handleItemsPerPageChange(10)}>10</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleItemsPerPageChange(20)}>20</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleItemsPerPageChange(50)}>50</Dropdown.Item>
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