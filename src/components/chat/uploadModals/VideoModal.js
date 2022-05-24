import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';

export default function VideoModal(props) {
    const [goodInput, setGoodInput] = useState(true);
    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add video</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {goodInput && (<div>Upload a video from your computer</div>)}
                {props.video && goodInput && (
                    <div>
                        <br />
                        <video width={"400px"} controls>
                            <source src={URL.createObjectURL(props.video)} type="video/mp4" />
                        </video>
                        <br />
                    </div>
                )}
                {!goodInput && (
                    <div>
                        Please choose a <b>video</b> file.
                        <br />
                    </div>
                )}
                <br />
                <br />
                <input type="file"
                    name="myVideo"
                    onChange={(event) => {
                        if (event.target.files[0].type[0] === "v") {
                            props.setVideo(event.target.files[0]);
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
                {goodInput && <Button variant="primary" onClick={props.showVideo}>
                    Save Changes
                </Button>}
            </Modal.Footer>
        </Modal>
    );
}