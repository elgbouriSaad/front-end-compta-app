import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { makeApiPostRequest, makeApiGetRequest, makeApiPutRequest } from "./ApiUtils";
import { useTranslation } from "react-i18next";
import { fetchCustomerIds } from "./GetUtils";

export default function Quotation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isEditModeFromQueryParam = queryParams.get("editMode") === "true";
  const [isEditMode, setIsEditMode] = useState(!id || isEditModeFromQueryParam);
  const [validated, setValidated] = useState(false);
  const [customerIds, setCustomerIds] = useState([]);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    status: "SAVED",
    validationDelay: "",
    customerId: "",
    clientId: "",
    productQuantities: [
      {
        productId: "",
        quantity: "",
      },
    ],
  });

  const handleSubmitLabel = isEditMode ? t("save") : t("edit");

  useEffect(() => {
    const fetchIds = async () => {
      const ids = await fetchCustomerIds();
      setCustomerIds(ids);
    };
    fetchIds();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchQuotation = async () => {
        try {
          const data = await makeApiGetRequest(`/api/v1/quotations/${id}`);
          setFormData({
            validationDelay: data.validationDelay,
            clientId: data.clientId,
            productQuantities: data.quotationProducts.map((product) => ({
              productId: product.productId,
              quantity: product.quantity,
            })),
          });

          const mappedProducts = data.quotationProducts.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
            label: product.label,
          }));
          setSelectedProducts(mappedProducts);
        } catch (error) {
          console.error("Error fetching quotation product data:", error);
        }
      };
      fetchQuotation();
    }
  }, [id]);

  const [clientOption, setClientOption] = useState([]);
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await makeApiGetRequest("/api/v1/clients");
        setClientOption(clientsData);
      } catch (error) {
        console.error("Error fetching client:", error);
      }
    };
    fetchClients();
  }, []);

  const validateForm = (form) => {
    if (form.checkValidity() === false) {
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (id) {
        await makeApiPutRequest(`/api/v1/quotations/update/${id}`, formData);
      } else {
        await makeApiPostRequest("/api/v1/quotations", formData);
      }
      navigate("/quotation-list");
    } catch (error) {
      console.error("Error saving quotations data:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    setValidated(true);
    if (!validateForm(form)) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    handleFormSubmit(formData);
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      customerId: customerIds.length > 0 ? customerIds[0] : "",
      [id]: value,
    }));
  };

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/quotation-list`);
    } else {
      navigate(`/`);
    }
  };

  const getInputClassName = (fieldName) => {
    if (fieldName.startsWith("product-")) {
      const index = parseInt(fieldName.split("-")[1], 10);
      const product = selectedProducts[index];
      if (!product.productId || !product.quantity) {
        return "form-control is-invalid";
      }
    }

    return `form-control ${
      validated && !formData[fieldName]
        ? "is-invalid"
        : validated && formData[fieldName] && formData[fieldName]
        ? "is-valid"
        : ""
    }`;
  };

  const [productOptions, setProductOptions] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await makeApiGetRequest("/api/v1/products");
        setProductOptions(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const [selectedProducts, setSelectedProducts] = useState([
    {
      productId: "",
      quantity: "",
      label: "",
    },
  ]);

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index][field] = value;
    setSelectedProducts(updatedProducts);

    const updatedProductQuantities = updatedProducts.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
    }));

    setFormData((prevFormData) => ({
      ...prevFormData,
      productQuantities: updatedProductQuantities,
    }));
  };

  const handleAddProduct = () => {
    setSelectedProducts((prevProducts) => [
      ...prevProducts,
      {
        productId: "",
        quantity: "",
      },
    ]);
  };
  const handleRemoveProduct = (indexToRemove) => {
    setSelectedProducts((prevProducts) => {
      return prevProducts.filter((_, index) => index !== indexToRemove);
    });
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="container">
      <div className="">
        <div className="card">
        <h3 className="card-header">{id && !isEditMode ? t("quotation.details") : (id ? t("quotation.edit") : t("quotation.title"))}</h3>
          <div className="card-body">
            <form
              className="row g-3"
              noValidate
              validated={validated ? "true" : "false"}
              onSubmit={handleSubmit}
            >
              <div className="col-md-6">
                <label htmlFor="validationDelay" className="form-label">
                  {t("validationDelay") + " *"}
                </label>
                <input
                  type="number"
                  className={getInputClassName("validationDelay")}
                  id="validationDelay"
                  value={formData.validationDelay}
                  onChange={handleChange}
                  readOnly={!isEditMode}
                  required
                />
                <div className="invalid-feedback">{t("invalidFeedbackVerificationDelay")}</div>
              </div>
              <div className="col-md-6">
                <select
                  className={`form-control ${
                    validated && !formData.clientId
                      ? "is-invalid"
                      : validated && formData.clientId && formData.clientId
                      ? "is-valid"
                      : ""
                  }`}
                  id="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  style={{ marginTop: !isMobile ? "2rem" : 0 }}
                  required
                >
                  <option value="">{t("chooseClient")}</option>
                  {clientOption.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.companyName}
                    </option>
                  ))}
                </select>
                <div id="clientFeedback" className="invalid-feedback">
                  {t("invalidFeedbackClient")}
                </div>
              </div>
              <div className="col-md-12">
                <table className="table table-bordered table-hover">
                  <thead className="table-secondary">
                    <tr>
                      <th>{t("productsAvailable")}</th>
                      <th>{t("quantity")}</th>
                      {id ? null : <th>{t("product.title")}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {id ? (
                      selectedProducts.map((product, index) => (
                        <tr key={index}>
                          <td>{product.label}</td>
                          <td>{product.quantity}</td>
                        </tr>
                      ))
                    ) : (
                      <>
                        {selectedProducts.map((product, index) => (
                          <tr key={index}>
                            <td>
                              <select
                                className={`form-control ${
                                  validated && !product.productId
                                    ? "is-invalid"
                                    : "" || (validated && product.productId && product.productId)
                                    ? "is-valid"
                                    : ""
                                }`}
                                value={product.productId}
                                onChange={(event) =>
                                  handleProductChange(index, "productId", event.target.value)
                                }
                                disabled={!isEditMode}
                                required
                              >
                                <option value="">{t("chooseProduct")}</option>
                                {productOptions.map((productOption) => {
                                  return (
                                    <option key={productOption.id} value={productOption.id}>
                                      {productOption.label}
                                    </option>
                                  );
                                })}
                              </select>
                              <div className="invalid-feedback">{t("invalidFeedbackProduct")}</div>
                            </td>
                            <td>
                              <input
                                type="number"
                                className={`form-control ${
                                  validated && !product.quantity
                                    ? "is-invalid"
                                    : "" || (validated && product.quantity && product.quantity)
                                    ? "is-valid"
                                    : ""
                                }`}
                                placeholder={t("quantity")}
                                value={product.quantity}
                                onChange={(event) =>
                                  handleProductChange(index, "quantity", event.target.value)
                                }
                                disabled={!isEditMode}
                                required
                              />
                              <div className="invalid-feedback">{t("invalidFeedbackQuantity")}</div>
                            </td>
                            <td>
                              {index === 0 ? (
                                <button
                                  className="btn btn-link"
                                  onClick={handleAddProduct}
                                  type="button"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    fill="blue"
                                    className="bi bi-plus-square-fill"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z" />
                                  </svg>
                                </button>
                              ) : (
                                <button
                                  className="btn btn-link"
                                  onClick={() => handleRemoveProduct(index)}
                                  type="button"
                                  disabled={selectedProducts.length === 1}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    fill="red"
                                    className="bi bi-x-square-fill"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
                                  </svg>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="col-12 d-flex justify-content-end">
                <button className="btn btn-secondary me-1" onClick={handleCancel} type="button">
                  {t("cancel")}
                </button>
                {id ? (
                  <button
                    className="btn btn-primary ms-2"
                    type={isEditMode ? "button" : "submit"}
                    onClick={handleToggleEditMode}
                  >
                    {isEditMode ? t("save") : t("edit")}
                  </button>
                ) : (
                  <button className="btn btn-primary ms-2" type="submit">
                    {handleSubmitLabel}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
