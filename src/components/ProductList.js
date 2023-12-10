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

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
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
    const fetchProducts = async () => {
      try {
        const data = await makeApiGetRequest("/api/v1/products");
        setProducts(data);
        setLoading(false);
      } catch (fetchError) {
        console.error("Error fetching products:", fetchError);
        setError(true);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handleViewClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleEditClick = (productId) => {
    navigate(`/product/${productId}?editMode=true`);
  };

  const handleDeleteClick = (productId) => {
    setShowModal(true);
    setDeleteProductId(productId);
  };

  const handleDelete = async () => {
    try {
      await makeApiDeleteRequest(`/api/v1/products/${deleteProductId}`);
      setShowModal(false);
      setDeleteProductId(null);
      window.location.reload();
    } catch (deleteError) {
      console.error("Error deleting product:", deleteError);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDeleteProductId(null);
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

  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="container">
      <div className="card mt-5">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title">{t("productList.title")}</h4>
          <Button variant="primary" onClick={() => navigate("/product")}>
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
                    <th>{t("reference")}</th>
                    <th>{t("priceExclTax")}</th>
                    <th>{t("unity")}</th>
                    <th>{t("qualification")}</th>
                    <th>{t("tax")}</th>
                    <th>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(startIndex, endIndex).map((product, index) => (
                    <tr
                      key={product.id}
                      onClick={() => handleViewClick(product.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{product.label}</td>
                      <td>{product.reference}</td>
                      <td>{product.priceExclTax}</td>
                      <td>{product.unity}</td>
                      <td>{product.qualification}</td>
                      <td>{product.tax}</td>
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
                                handleViewClick(product.id);
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
                                handleEditClick(product.id);
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
                                handleDeleteClick(product.id);
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