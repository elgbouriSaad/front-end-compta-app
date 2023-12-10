import { t } from "i18next";
import React from "react";

export default function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-end">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            {t("previous")}
          </button>
        </li>
        {pageNumbers.map((page) => (
          <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(page)}>
              {page}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
          >
            {t("next")}
          </button>
        </li>
      </ul>
    </nav>
  );
}