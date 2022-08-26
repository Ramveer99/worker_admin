import React from "react";
import { Modal, Button } from "react-bootstrap";

function DeleteConfirmation({
    modelTitle,
    loadingConfirmButton,
    loadingConfirmButtonText,
    showModalHandler,
    hideModalHandler,
    confirmModalHandler,
    actionButtonClass,
    message,
    actionType,
}) {
    return (
        <>
            <Modal show={showModalHandler} onHide={hideModalHandler}>
                <Modal.Header closeButton>
                    <Modal.Title>{modelTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>{message.charAt(0).toUpperCase() + message.slice(1).toLowerCase()}</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="default" onClick={hideModalHandler}>
                        Cancel
                    </Button>
                    <Button
                        disabled={loadingConfirmButton}
                        variant={actionButtonClass}
                        onClick={confirmModalHandler}
                    >
                        {loadingConfirmButton ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                <span className="sr-only"></span> {loadingConfirmButtonText}
                            </>
                        ) : (
                            actionType
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DeleteConfirmation;
