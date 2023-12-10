import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Sidebar({ isVisible }) {
  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState(null);

  if (!isVisible) {
    return null;
  }

    const sidebarStyle = {
      position: "fixed",
      left: 0,
      height: "100%",
      width: "280px",
      zIndex: 1000,
    };

  const toggleDropdown = (dropdownName) => {
    if (openDropdown === dropdownName) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdownName);
    }
  };

  const isDropdownOpen = (dropdownName) => openDropdown === dropdownName;

  return (
    <>
      <div data-testid="sidebar" className="sidebar sidebar-show" style={sidebarStyle}>
        <ul className="sidebar-nav">
          <li className="nav-title">{t("sidebar.content")}</li>
          <li className={`nav-item nav-group ${isDropdownOpen("dropdown1") ? "show" : ""}`}>
            <a className={`nav-link nav-group-toggle`} onClick={() => toggleDropdown("dropdown1")}>
              <i className="fa fa-user icon-space"></i>
              {t("accountant.groupTitle")}
            </a>
            {isDropdownOpen("dropdown1") && (
              <ul className="nav-group-items">
                <li className="nav-item">
                  <Link className="nav-link" to="accountant">
                    <i className="fa fa-user-plus icon-space"></i>
                    {t("accountant.title")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="accountant-list">
                    <i className="fa fa-list icon-space"></i>
                    {t("accountantList.title")}
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li className={`nav-item nav-group ${isDropdownOpen("dropdown2") ? "show" : ""}`}>
            <a className={`nav-link nav-group-toggle`} onClick={() => toggleDropdown("dropdown2")}>
              <i className="fa fa-users icon-space"></i>
              {t("client.groupTitle")}
            </a>
            {isDropdownOpen("dropdown2") && (
              <ul className="nav-group-items">
                <li className="nav-item">
                  <Link className="nav-link" to="client">
                    <i className="fa fa-user-plus icon-space"></i>
                    {t("client.title")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="client-list">
                    <i className="fa fa-list icon-space"></i>
                    {t("clientList.title")}
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li className={`nav-item nav-group ${isDropdownOpen("dropdown3") ? "show" : ""}`}>
            <a className={`nav-link nav-group-toggle`} onClick={() => toggleDropdown("dropdown3")}>
              <i className="fa fa-users icon-space"></i>
              {t("customer.groupTitle")}
            </a>
            {isDropdownOpen("dropdown3") && (
              <ul className="nav-group-items">
                <li className="nav-item">
                  <Link className="nav-link" to="customer">
                    <i className="fa fa-user-plus icon-space"></i>
                    {t("customer.title")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="customer-list">
                    <i className="fa fa-list icon-space"></i>
                    {t("customerList.title")}
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li className={`nav-item nav-group ${isDropdownOpen("dropdown6") ? "show" : ""}`}>
            <a className={`nav-link nav-group-toggle`} onClick={() => toggleDropdown("dropdown6")}>
              <i className="fa fa-cubes icon-space"></i>
              {t("product.groupTitle")}
            </a>
            {isDropdownOpen("dropdown6") && (
              <ul className="nav-group-items">
                <li className="nav-item">
                  <Link className="nav-link" to="product">
                    <i className="fa fa-user-plus icon-space"></i>
                    {t("product.title")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="product-list">
                    <i className="fa fa-list icon-space"></i>
                    {t("productList.title")}
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li className={`nav-item nav-group ${isDropdownOpen("dropdown7") ? "show" : ""}`}>
            <a className={`nav-link nav-group-toggle`} onClick={() => toggleDropdown("dropdown7")}>
              <i className="fas fa-file-alt icon-space"></i>
              {t("expenseReport.groupTitle")}
            </a>
            {isDropdownOpen("dropdown7") && (
              <ul className="nav-group-items">
                <li className="nav-item">
                  <Link className="nav-link" to="expense-report">
                    <i className="fa fa-user-plus icon-space"></i>
                    {t("expenseReport.title")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="expense-report-list">
                    <i className="fa fa-list icon-space"></i>
                    {t("expenseReportList.title")}
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li className={`nav-item nav-group ${isDropdownOpen("dropdown4") ? "show" : ""}`}>
            <a className={`nav-link nav-group-toggle`} onClick={() => toggleDropdown("dropdown4")}>
              <i className="fas fa-money-bill-alt icon-space"></i>
              {t("invoice.groupTitle")}
            </a>
            {isDropdownOpen("dropdown4") && (
              <ul className="nav-group-items">
                <li className="nav-item">
                  <Link className="nav-link" to="invoice">
                    <i className="fa fa-user-plus icon-space"></i>
                    {t("invoice.title")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="invoice-list">
                    <i className="fa fa-list icon-space"></i>
                    {t("invoiceList.title")}
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li className={`nav-item nav-group ${isDropdownOpen("dropdown5") ? "show" : ""}`}>
            <a className={`nav-link nav-group-toggle`} onClick={() => toggleDropdown("dropdown5")}>
              <i className="fa fa-file icon-space"></i>
              {t("quotation.groupTitle")}
            </a>
            {isDropdownOpen("dropdown5") && (
              <ul className="nav-group-items">
                <li className="nav-item">
                  <Link className="nav-link" to="quotation">
                    <i className="fa fa-user-plus icon-space"></i>
                    {t("quotation.title")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="quotation-list">
                    <i className="fa fa-list icon-space"></i>
                    {t("quotationList.title")}
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
        <div className="sidebar-footer">DOT-COMPTA 2023</div>
      </div>
    </>
  );
}
