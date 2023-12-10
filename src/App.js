import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AccountantList from "./components/AccountantList";
import CustomerList from "./components/CustomerList";
import ClientList from "./components/ClientList";
import Client from "./components/Client";
import Customer from "./components/Customer";
import Accountant from "./components/Accountant";
import Product from "./components/Product";
import ProductList from "./components/ProductList";
import ExpenseReport from "./components/ExpenseReport";
import Quotation from "./components/Quotation";
import QuotationList from "./components/QuotationList";
import ExpenseReportList from "./components/ExpenseReportList";
import Invoice from "./components/Invoice";
import InvoiceList from "./components/InvoiceList";
import QuotationTransform from "./components/QuotationTransform";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import "./components/Modals";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "@coreui/coreui/dist/css/coreui.min.css";

const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isAuthenticated, setAuthentication] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/sign-in" element={<SignIn setAuthentication={setAuthentication} />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </Router>
    );
  }else{

  return (
    <>
      <Router>
        <div className="container-fluid">
          <div className="row">
            <div>
              <Sidebar isVisible={sidebarVisible} />
            </div>
            <div className={`main-content ${sidebarVisible ? "with-sidebar" : "without-sidebar"}`}>
              <Navbar toggleSidebar={toggleSidebar} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/accountant/:id?" element={<Accountant />} />
                <Route path="/accountant-list" element={<AccountantList />} />
                <Route path="/client/:id?" element={<Client />} />
                <Route path="/client-list" element={<ClientList />} />
                <Route path="/customer/:id?" element={<Customer />} />
                <Route path="/customer-list" element={<CustomerList />} />
                <Route path="/product/:id?" element={<Product />} />
                <Route path="/product-list" element={<ProductList />} />
                <Route path="/expense-report/:id?" element={<ExpenseReport />} />
                <Route path="/quotation/:id?" element={<Quotation />} />
                <Route path="/quotation-list" element={<QuotationList />} />
                <Route path="/quotation-transform/:id?" element={<QuotationTransform />} />
                <Route path="/expense-report-list" element={<ExpenseReportList />} />
                <Route path="/invoice/:id?" element={<Invoice />} />
                <Route path="/invoice-list" element={<InvoiceList />} />
              </Routes>
            </div>
          </div>
        </div>
        <div
          className="footer-container"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: -1,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            style={{
              width: "100%",
              height: "auto",
              fill: "#0099FF",
              fillOpacity: "0.8",
            }}
          >
            <path d="M0,96L60,96C120,96,240,96,360,112C480,128,600,160,720,154.7C840,149,960,107,1080,90.7C1200,75,1320,85,1380,90.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
      </Router>
    </>
  );
};
}
export default App;
