import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function Modals({ showModal, handleCloseModal, handleDelete, t }) {
  return (
    <div>
      {showModal && (
        <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
      )}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("confirmDelete.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t("confirmDelete")}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            {t("confirm")}
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            {t("cancel")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
