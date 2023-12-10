import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="">
      <div className="dashboard-container">
        {/* About Us Section */}
        <div className="about-us-section">
          <h2>About Dot Consulting Company</h2>
          <p>
            Dot Consulting Company is a leading IT consulting firm based in France. With a focus on delivering
            innovative solutions, we specialize in helping businesses leverage technology to achieve their goals.
          </p>
        </div>

        {/* Bootstrap Card Sections in a grid layout */}
        <div className="row card-sections">
          {/* Manage Clients Card */}
          <div className="col-md-4 mb-4">
            <div className="card h-100" style={{ border: "2px solid #007BFF" }}>
              <div className="card-body">
                <h5 className="card-title">Manage Clients</h5>
                <p className="card-text">Effortlessly manage your client information and relationships.</p>
                <Link to="/client-list">
                  <button className="btn btn-primary">Go to Clients</button>
                </Link>
              </div>
            </div>
          </div>

          {/* Invoices Card */}
          <div className="col-md-4 mb-4">
            <div className="card h-100" style={{ border: "2px solid #007BFF" }}>
              <div className="card-body">
                <h5 className="card-title">Invoices</h5>
                <p className="card-text">Track and manage your invoices with ease and comfortably.</p>
                <Link to="/invoice-list">
                  <button className="btn btn-primary">Go to Invoices</button>
                </Link>
              </div>
            </div>
          </div>

          {/* Products Card */}
          <div className="col-md-4 mb-4">
            <div className="card h-100" style={{ border: "2px solid #007BFF" }}>
              <div className="card-body">
                <h5 className="card-title">Products</h5>
                <p className="card-text">Manage your product inventory and information.</p>
                <Link to="/product-list">
                  <button className="btn btn-primary">Go to Products</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
