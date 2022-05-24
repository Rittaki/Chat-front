import React from "react";
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';

export default function ImageModal(props) {
    const [goodInput, setGoodInput] = useState(false);
    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add image</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {goodInput && (<div>Upload an image from your computer</div>)}
                {props.image && goodInput && (
                    <div>
                        <img alt="not found" width={"250px"} src={URL.createObjectURL(props.image)} />
                        <br />
                    </div>
                )}
                {!goodInput && (
                    <div>
                        Please choose an <b>image</b> file.
                        <br />
                    </div>
                )}
                <br />
                <br />
                <input type="file"
                    name="myImage"
                    onChange={(event) => {
                        if (event.target.files[0].type[0] === "i") {
                            props.setImage(event.target.files[0]);
                            console.log(event.target.files[0]);
                            setGoodInput(true);
                        } else {
                            console.log("not good input");
                            setGoodInput(false);
                        }
                    }} />
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
                {goodInput && <Button variant="primary" onClick={props.showImage}>
                    Save Changes
                </Button>}
            </Modal.Footer>
        </Modal>
    );
}