import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { makeApiPostRequest, makeApiPutRequest } from "./ApiUtils";
import { useTranslation } from "react-i18next";
import { fetchCustomerIds } from "./GetUtils";

export default function Product() {
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
    label: "",
    reference: "",
    priceExclTax: "",
    unity: "",
    qualification: "",
    tax: "",
    customerId: "",
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
    const fetchIds = async () => {
      const ids = await fetchCustomerIds();
      setCustomerIds(ids);
    };
    fetchIds();
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
        await makeApiPutRequest(`/api/v1/products/${id}`, formData);
      } else {
        await makeApiPostRequest("/api/v1/products", formData);
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving products data:", error);
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
      navigate(`/product-list`);
    } else {
      navigate(`/`);
    }
  };
  const getInputClassName = (fieldName) => {
    return `form-control ${
      validated && !formData[fieldName]
        ? "is-invalid"
        : validated && formData[fieldName] && formData[fieldName]
        ? "is-valid"
        : ""
    }`;
  };

  return (
    <div className="container">
      <div className="">
        <div className="card">
        <h3 className="card-header">{id && !isEditMode ? t("product.details") : (id ? t("product.edit") : t("product.title"))}</h3>
          <div className="card-body">
            <form
              className="row g-3"
              noValidate
              validated={validated ? "true" : "false"}
              onSubmit={handleSubmit}
            >
              <div className="col-md-4">
                <label htmlFor="label" className="form-label">
                  {t("label") + " *"}
                </label>
                <input
                  type="text"
                  className={getInputClassName("label")}
                  id="label"
                  value={formData.label}
                  onChange={handleChange}
                  readOnly={!isEditMode}
                  required
                />
                <div className="invalid-feedback">{t("invalidFeedbackLabel")}</div>
              </div>
              <div className="col-md-4">
                <label htmlFor="reference" className="form-label">
                  {t("reference") + " *"}
                </label>
                <input
                  type="text"
                  className={getInputClassName("reference")}
                  id="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  readOnly={!isEditMode}
                  required
                />
                <div className="invalid-feedback">{t("invalidFeedbackReference")}</div>
              </div>
              <div className="col-md-4">
                <label htmlFor="priceExclTax" className="form-label">
                  {t("priceExclTax") + " *"}
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    className={getInputClassName("priceExclTax")}
                    id="priceExclTax"
                    value={formData.priceExclTax}
                    onChange={handleChange}
                    readOnly={!isEditMode}
                    required
                  />
                  <div className="invalid-feedback">{t("invalidFeedbackPriceExclTax")}</div>
                </div>
              </div>
              <div className="col-md-4">
                <label htmlFor="unity" className="form-label">
                  {t("unity") + " *"}
                </label>
                <input
                  type="text"
                  className={getInputClassName("unity")}
                  id="unity"
                  value={formData.unity}
                  onChange={handleChange}
                  readOnly={!isEditMode}
                  required
                />
                <div className="invalid-feedback">{t("invalidFeedbackUnity")}</div>
              </div>
              <div className="col-md-4">
                <label htmlFor="qualification" className="form-label">
                  {t("qualification") + " *"}
                </label>
                <input
                  type="text"
                  className={getInputClassName("qualification")}
                  id="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  readOnly={!isEditMode}
                  required
                />
                <div className="invalid-feedback">{t("invalidFeedbackQualification")}</div>
              </div>
              <div className="col-md-4">
                <label htmlFor="tax" className="form-label">
                  {t("tax") + " *"}
                </label>
                <input
                  type="number"
                  className={getInputClassName("tax")}
                  id="tax"
                  value={formData.tax}
                  onChange={handleChange}
                  readOnly={!isEditMode}
                  required
                />
                <div className="invalid-feedback">{t("invalidFeedbackTax")}</div>
              </div>
              <div className="col-12 d-flex justify-content-end">
                <button className="btn btn-secondary me-1" onClick={handleCancel} type="button">
                  {t("cancel")}
                </button>
                {id ? (
                  <button
                    className={`btn btn-primary ms-2`}
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
