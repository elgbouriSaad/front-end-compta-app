import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { makeApiPostRequest, makeApiGetRequest, makeApiPutRequest } from "./ApiUtils";
import { useTranslation } from "react-i18next";

export default function Accountant() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isEditModeFromQueryParam = queryParams.get("editMode") === "true";
  const [isEditMode, setIsEditMode] = useState(!id || isEditModeFromQueryParam);
  const [validated, setValidated] = useState(false);
  const { t } = useTranslation();
  const [cityOptions, setCityOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [formData, setFormData] = useState({
    companyName: "",
    rc: "",
    email: "",
    mobilePhone: "",
    phone: "",
    fax: "",
    address: {
      primaryAddress: "",
      secondaryAddress: "",
      postalCode: "",
      city: "",
      country: "",
    },
  });

  const handleSubmitLabel = isEditMode ? t("save") : t("edit");
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

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesData = await makeApiGetRequest("/api/v1/cities");
        setCityOptions(citiesData);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesData = await makeApiGetRequest("/api/v1/countries");
        setCountryOptions(countriesData);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);
  useEffect(() => {
    if (id) {
      const fetchAccountant = async () => {
        try {
          const data = await makeApiGetRequest(`/api/v1/accountants/${id}`);
          setFormData(data);
        } catch (error) {
          console.error("Error fetching accountants data:", error);
        }
      };
      fetchAccountant();
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
        await makeApiPutRequest(`/api/v1/accountants/${id}`, formData);
      } else {
        await makeApiPostRequest("/api/v1/accountants", formData);
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving accountant data:", error);
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
      [id]: value,
    }));
  };

  const handleNestedChange = (event) => {
    const { id, value } = event.target;
    const [field, nestedField] = id.split(".");
    if (field === "address") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          [nestedField]: value,
        },
      }));
    }
  };

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/accountant-list`);
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
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="container">
      <div className="card">
      <h3 className="card-header">{id && !isEditMode ? t("accountant.details") : (id ? t("accountant.edit") : t("accountant.title"))}</h3>
        <div className="card-body">
          <form className="row g-3" noValidate onSubmit={handleSubmit}>
            <div className="col-md-4">
              <label htmlFor="companyName" className="form-label">
                {t("labelCompanyName") + " *"}
              </label>
              <input
                type="text"
                className={getInputClassName("companyName")}
                id="companyName"
                value={formData.companyName}
                onChange={handleChange}
                readOnly={!isEditMode}
                required
              />
              <div id="companyNameFeedback" className="invalid-feedback">
                {t("invalidFeedbackCompanyName")}
              </div>
            </div>
            <div className="col-md-4">
              <label htmlFor="rc" className="form-label">
                {t("labelRC") + " *"}
              </label>
              <input
                type="number"
                className={getInputClassName("rc")}
                id="rc"
                value={formData.rc}
                onChange={handleChange}
                readOnly={!isEditMode}
                required
              />
              <div id="rcFeedback" className="invalid-feedback">
                {t("invalidFeedbackRC")}
              </div>
            </div>
            <div className="col-md-4">
              <label htmlFor="email" className="form-label">
                {t("labelEmail") + " *"}
              </label>
              <div className="input-group">
                <span className="input-group-text">@</span>
                <input
                  type="email"
                  className={`form-control ${
                    validated && !validateEmail(formData.email)
                      ? "is-invalid"
                      : validated && validateEmail(formData.email) && validateEmail(formData.email)
                      ? "is-valid"
                      : ""
                  }`}
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={!isEditMode}
                  required
                />
                <div id="invalidFeedbackEmail" className="invalid-feedback">
                  {t("invalidFeedbackEmail")}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <label htmlFor="mobilePhone" className="form-label">
                {t("labelMobilePhone") + " *"}
              </label>
              <input
                type="number"
                className={getInputClassName("mobilePhone")}
                id="mobilePhone"
                value={formData.mobilePhone}
                onChange={handleChange}
                readOnly={!isEditMode}
                required
              />
              <div id="mobilePhoneFeedback" className="invalid-feedback">
                {t("invalidFeedbackMobilePhone")}
              </div>
            </div>
            <div className="col-md-4">
              <label htmlFor="phone" className="form-label">
                {t("labelPhone")}
              </label>
              <input
                type="number"
                className={`form-control ${validated && !formData.phone ? "is-valid" : ""}`}
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                readOnly={!isEditMode}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="fax" className="form-label">
                {t("labelFax")}
              </label>
              <input
                type="number"
                className={`form-control ${validated && !formData.fax ? "is-valid" : ""}`}
                id="fax"
                value={formData.fax}
                onChange={handleChange}
                readOnly={!isEditMode}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="address.primaryAddress" className="form-label">
                {t("labelPrimaryAddress") + " *"}
              </label>
              <input
                type="text"
                className={`form-control ${
                  validated && !formData.address.primaryAddress
                    ? "is-invalid"
                    : validated &&
                      formData.address.primaryAddress &&
                      formData.address.primaryAddress
                    ? "is-valid"
                    : ""
                }`}
                id="address.primaryAddress"
                placeholder={t("labelPrimaryAddress") + " *"}
                value={formData.address.primaryAddress}
                onChange={handleNestedChange}
                readOnly={!isEditMode}
                required
              />
              <div id="primaryAddressFeedback" className="invalid-feedback">
                {t("invalidFeedbackAddress")}
              </div>
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className={`form-control ${
                  validated && !formData.address.secondaryAddress ? "is-valid" : ""
                }`}
                id="address.secondaryAddress"
                placeholder={t("labelSecondaryAddress")}
                value={formData.address.secondaryAddress}
                onChange={handleNestedChange}
                readOnly={!isEditMode}
                style={{ marginTop: !isMobile ? "2rem" : 0 }}
              />
            </div>

            <div className="col-md-4">
              <select
                className={`form-control ${
                  validated && !formData.address.country
                    ? "is-invalid"
                    : validated && formData.address.country && formData.address.country
                    ? "is-valid"
                    : ""
                }`}
                id="address.country"
                value={formData.address.country}
                onChange={handleNestedChange}
                disabled={!isEditMode}
                required
              >
                <option value="">{t("chooseCountry")}</option>
                {countryOptions.map((country) => (
                  <option key={country.id} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              <div id="countryFeedback" className="invalid-feedback">
                {t("invalidFeedbackCountry")}
              </div>
            </div>
            <div className="col-md-4">
              <select
                className={`form-control ${
                  validated && !formData.address.city
                    ? "is-invalid"
                    : validated && formData.address.city && formData.address.city
                    ? "is-valid"
                    : ""
                }`}
                id="address.city"
                value={formData.address.city}
                onChange={handleNestedChange}
                disabled={!isEditMode}
                required
              >
                <option value="">{t("chooseCity")}</option>
                {cityOptions.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              <div id="cityFeedback" className="invalid-feedback">
                {t("invalidFeedbackCity")}
              </div>
            </div>
            <div className="col-md-4">
              <input
                type="number"
                className={`form-control ${
                  validated && !formData.address.postalCode
                    ? "is-invalid"
                    : validated && formData.address.postalCode && formData.address.postalCode
                    ? "is-valid"
                    : ""
                }`}
                id="address.postalCode"
                placeholder={t("labelPostalCode") + " *"}
                value={formData.address.postalCode}
                onChange={handleNestedChange}
                readOnly={!isEditMode}
                required
              />
              <div id="zipCodeFeedback" className="invalid-feedback">
                {t("invalidFeedbackPostalCode")}
              </div>
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
  );
}
