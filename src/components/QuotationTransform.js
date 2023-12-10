import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { makeApiGetRequest, makeApiPutRequest } from "./ApiUtils";
import { useTranslation } from "react-i18next";

export default function QuotationTransform() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [validated, setValidated] = useState(false);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    paymentDelay: "",
  });

  useEffect(() => {
    if (id) {
      const fetchQuotation = async () => {
        try {
          const data = await makeApiGetRequest(`/api/v1/quotations/${id}`);
          setFormData(data);
        } catch (error) {
          console.error("Error fetching quotation data:", error);
        }
      };
      fetchQuotation();
    }
  }, [id]);

  const validateForm = (form) => {
    if (form.checkValidity() === false) {
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (id) {
        // Add logic to update status to "TRANSFORMED" here
        formData.status = "TRANSFORMED";

        await makeApiPutRequest(`/api/v1/quotations/transform/${id}`, formData);
        navigate("/quotation-list");
      } else {
        // Handle creation if needed
      }
    } catch (error) {
      console.error("Error saving quotation data:", error);
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
      [id]: value,
    }));
  };

  const handleCancel = () => {
    if (id) {
      navigate("/quotation-list");
    } else {
      navigate("/");
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
          <h3 className="card-header">{t("Transform Quotation")}</h3>
          <div className="card-body">
            <form
              className="row g-3"
              noValidate
              validated={validated ? "true" : "false"}
              onSubmit={handleSubmit}
            >
              <div className="col-md-6">
                <label htmlFor="paymentDelay" className="form-label">
                  {t("paymentDelay") + " *"}
                </label>
                <input
                  type="number"
                  className={getInputClassName("paymentDelay")}
                  id="paymentDelay"
                  value={formData.paymentDelay}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">{t("invalidFeedbackPaymentDelay")}</div>
              </div>
              <div className="col-12 d-flex justify-content-end">
                <button className="btn btn-secondary me-1" onClick={handleCancel} type="button">
                  {t("cancel")}
                </button>
                <button className="btn btn-primary ms-2" type="submit">
                  {t("transform")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
