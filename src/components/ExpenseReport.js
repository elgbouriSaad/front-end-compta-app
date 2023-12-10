import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { makeApiPostRequest, makeApiGetRequest, makeApiPutRequest } from "./ApiUtils";
import { useTranslation } from "react-i18next";
import { fetchCustomerIds } from "./GetUtils";

export default function ExpenseReport() {
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
    label: "",
    priceExclTax: "",
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
    if (id) {
      const fetchExpenseReport = async () => {
        try {
          const data = await makeApiGetRequest(`/api/v1/expense_reports/${id}`);
          setFormData(data);
        } catch (error) {
          console.error("Error fetching expense reports data:", error);
        }
      };
      fetchExpenseReport();
    }
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
        await makeApiPutRequest(`/api/v1/expense_reports/update/${id}`, formData);
      } else {
        await makeApiPostRequest("/api/v1/expense_reports", formData);
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving expense report data:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    setValidated(true);
    if (!validateForm(form)) {
      event.stopPropagation();
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
      navigate(`/expense-report-list`);
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
        <h3 className="card-header">{id && !isEditMode ? t("expenseReport.details") : (id ? t("expenseReport.edit") : t("expenseReport.title"))}</h3>
          <div className="card-body">
            <form
              className="row g-3"
              noValidate
              validated={validated ? "true" : "false"}
              onSubmit={handleSubmit}
            >
              <div className="col-md-6">
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
              <div className="col-md-6">
                <label htmlFor="priceExclTax" className="form-label">
                  {t("priceExclTax") + " *"}
                </label>
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
              <div className="col-md-6">
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
              <div className="col-md-6">
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
