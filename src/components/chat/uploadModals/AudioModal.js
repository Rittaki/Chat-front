import React from "react";
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';

export default function AudioModal(props) {
    const [goodInput, setGoodInput] = useState(false);
    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add audio</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {goodInput && (<div>Upload an audio from your computer</div>)}
                {props.audio && goodInput && (
                    <div>
                        <audio controlsList="nodownload" controls>
                            <source src={URL.createObjectURL(props.audio)} type="audio/mpeg" />
                        </audio>
                        <br />
                    </div>
                )}
                {!goodInput && (
                    <div>
                        Please choose an <b>audio</b> file.
                        <br />
                    </div>
                )}
                <br />
                <br />
                <input type="file"
                    name="myAudio"
                    onChange={(event) => {
                        if (event.target.files[0].type[0] === "a") {
                            props.setAudio(event.target.files[0]);
                            console.log(event.target.files[0]);
                            setGoodInput(true);
                        } else {
                            console.log(event.target.files[0].type);
                            console.log("not good input");
                            setGoodInput(false);
                        }
                    }} />
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
                {goodInput && <Button variant="primary" onClick={props.showAudio}>
                    Save Changes
                </Button>}
            </Modal.Footer>
        </Modal>
    );
}