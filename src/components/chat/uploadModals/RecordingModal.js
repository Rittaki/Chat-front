import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';

export default function RecordingModal(props) {
    const [recording, setRecording] = useState(true);
    var recorder;
    let chunks = [];

    const recordFunc = async () => {
        recorder = new MediaRecorder(await navigator.mediaDevices.getUserMedia({ audio: true }));
        window.recorder = recorder;

        recorder.ondataavailable = (e) => {
            chunks.push(e.data);
            recorder.onstop = () => {
                var blob = new Blob(chunks, { type: "audio/webm" });
                props.setRecord(URL.createObjectURL(blob));
            }
        };
        recorder.start();
    };

    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Voice Recording</Modal.Title>
            </Modal.Header>

            <Modal.Body><div className="mb-2">
            Tap to record voice:</div>
                <InputGroup>
                    {recording && (<Button onClick={() => { setRecording(false); recordFunc(); }}>
                        <img width={"40px"} src={"./images/recording.png"}></img>
                    </Button>)}

                    {!recording && (<Button onClick={() => { window.recorder.stop(); setRecording(true); }}>
                        <img width={"40px"} src={"./images/stop.png"}></img>
                    </Button>)}
                    <audio controls src={props.record} />
                </InputGroup>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={props.showRecord}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}