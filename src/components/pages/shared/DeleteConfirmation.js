import React from 'react';
import { Modal,Button } from 'react-bootstrap';

function DeleteConfirmation({modelTitle, showModalHandler, hideModalHandler, confirmModalHandler, actionButtonClass, message,actionType }) {
    return (
        <>
            <Modal show={showModalHandler} onHide={hideModalHandler}>
                <Modal.Header closeButton>
                    {/* <Modal.Title>Delete Confirmation</Modal.Title> */}
                    <Modal.Title>{modelTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body><div>{message}</div></Modal.Body>
                <Modal.Footer>
                    <Button variant="default" onClick={hideModalHandler}>
                        Cancel
                    </Button>
                    <Button variant={actionButtonClass} onClick={confirmModalHandler}>
                        {actionType}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DeleteConfirmation;