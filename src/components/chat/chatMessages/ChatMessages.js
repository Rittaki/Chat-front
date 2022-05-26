import React from "react";
import { useState, useRef, useEffect } from "react";
import { Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import "./ChatMessages.css";
import ImageModal from "../uploadModals/ImageModal";
import VideoModal from "../uploadModals/VideoModal";
import RecordingModal from "../uploadModals/RecordingModal";
import AudioModal from "../uploadModals/AudioModal";
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export default function ChatMessages(props) {
    const [load, setLoad] = useState(false);
    const containerRef = useRef(null);
    const [input, setInput] = useState('');
    const [updateMessages, setUpdateMessages] = useState(false);
    //hardcoded array of all the messages 

    //for showing messages
    const [currentMessages, setCurrentMessages] = useState([]);
    /* for images */
    const [show, setShow] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const handleCloseImageModal = () => setShow(false);
    const handleShowImageModal = () => setShow(true);
    /* for video */
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const handleCloseVideoModal = () => setShowVideoModal(false);
    const handleShowVideoModal = () => setShowVideoModal(true);
    /* for record */
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const handleCloseRecordModal = () => setShowRecordModal(false);
    const handleShowRecordModal = () => setShowRecordModal(true);
    /* for audio messages */
    const [showAudioModal, setShowAudioModal] = useState(false);
    const [selectedAudio, setSelectedAudio] = useState(null);
    const handleCloseAudioModal = () => setShowAudioModal(false);
    const handleShowAudioModal = () => setShowAudioModal(true);


    const [connection, setConnection] = useState(null);


        
    
    useEffect(() => {
        const connect = new HubConnectionBuilder()
            .withUrl("https://localhost:7038/myHub")
            .configureLogging(LogLevel.Information)
            .build();
        setConnection(connect);
    },[]);

    useEffect(() => {
        if(!connection) {
            return;
        }
        connection.start().then(() => {
            connection.on("ChangeRecieved", (input) => {
                console.log('received: ' + input);
                setUpdateMessages(true);
                setUpdateMessages(false);
            })
        })      
    }, [connection]);

    //for scrolling to the bottom of chat panel
    useEffect(() => {
        if (containerRef && containerRef.current) {
            const element = containerRef.current;
            element.scroll({
                top: element.scrollHeight,
                left: 0,
                behavior: "smooth",
            })
            setLoad(false)
        }

    }, [containerRef, currentMessages, load])

    //changes the shown messages every time different contact is chosen
    useEffect(() => {
        async function getMessages(){
            (async () => {
                const response = await fetch(`https://localhost:7038/api/contacts/${props.contactUserName}/messages?user=${props.logInUserName}`);                
                const mediaType = response.headers.get('content-type');
                let data;
                if (mediaType.includes('json')) {
                  data = await response.json();
                }
                setCurrentMessages(data);
                if(props.checkDatabaseForContacts){
                    props.setCheckDatabaseForContacts(false);
                }
                else{
                    props.setCheckDatabaseForContacts(true);
                }
              })();
        }
        getMessages();
    }, [props.contactUserName,updateMessages])



    async function UpdateMyServer(){
        const headers = new Headers();
        headers.append('content-type', 'application/json');
    
      
        const init = {
          method: 'POST',
          headers,
          body: JSON.stringify({ user: props.logInUserName,content:input})
        };
                
         await fetch(`https://localhost:7038/api/contacts/${props.contactUserName}/messages`, init);
    }

    async function UpdateContactServer(){
        const headers = new Headers();
        headers.append('content-type', 'application/json');
    
      
        const init = {
          method: 'POST',
          headers,
          body: JSON.stringify({ from: props.logInUserName,to:props.contactUserName,content:input})
        };
                
        await fetch(`https://${props.contactServer}/api/transfer`, init);
    }

    //shows the time of sending messages
    const showItem = async()=>{
        // newMessage(input);
        await UpdateMyServer();
        await UpdateContactServer();
        if(updateMessages){
            setUpdateMessages(false);
        }
        else{
            setUpdateMessages(true);
        }
        setInput('');
        await connection.invoke("Changed", input);
    };

    //for adding images
    const showImage = () => {
        handleCloseImageModal();
        var today = new Date();
        const messageTime = today.getHours() + ':' + today.getMinutes();
        currentMessages.map((contact) => {
            if (props.contactUserName === contact.name) {
                setCurrentMessages([...currentMessages, { from: "me", time: messageTime, message: URL.createObjectURL(selectedImage), type: "image" }])
                contact.messages.push({ from: "me", message: URL.createObjectURL(selectedImage), time: messageTime, type: "image" })
            }
        })
        props.setLastMessage("Image")
        setSelectedImage(null);
    }

    //for adding videos
    const showVideoFunc = () => {
        handleCloseVideoModal();
        var today = new Date();
        const messageTime = today.getHours() + ':' + today.getMinutes();
        currentMessages.map((contact) => {
            if (props.contactUserName === contact.name) {
                console.log(selectedVideo);
                setCurrentMessages([...currentMessages, { from: "me", message: URL.createObjectURL(selectedVideo), time: messageTime, type: "video" }])
                contact.messages.push({ from: "me", message: URL.createObjectURL(selectedVideo), time: messageTime, type: "video" })
            }
        })
        props.setLastMessage("Video")
        setSelectedVideo(null);
    }

    //for adding records
    const showRecordFunc = () => {
        handleCloseRecordModal();
        var today = new Date();
        const messageTime = today.getHours() + ':' + today.getMinutes();
        currentMessages.map((contact) => {
            if (props.contactUserName === contact.name) {
                console.log(selectedRecord);
                setCurrentMessages([...currentMessages, { from: "me", message: selectedRecord, time: messageTime, type: "record" }])
                contact.messages.push({ from: "me", message: selectedRecord, time: messageTime, type: "record" })
            }
        })
        props.setLastMessage("Record")
        setSelectedRecord(null);
    }

    //for adding audio
    const showAudioFunc = () => {
        handleCloseAudioModal();
        var today = new Date();
        const messageTime = today.getHours() + ':' + today.getMinutes();
        currentMessages.map((contact) => {
            if (props.contactUserName === contact.name) {
                console.log(selectedAudio);
                setCurrentMessages([...currentMessages, { from: "me", message: URL.createObjectURL(selectedAudio), time: messageTime, type: "record" }])
                contact.messages.push({ from: "me", message: URL.createObjectURL(selectedAudio), time: messageTime, type: "record" })
            }
        })
        props.setLastMessage("Audio")
        setSelectedAudio(null);
    }

    const enterKey = (e) => {
        if (e.which === 13) showItem();
    }

    //shows all the messages
    const messagesList = currentMessages.map((message) => {
        if (message.sent === true) {
            return (
                <div className="row-message">
                    <div className="col-md-3 offset-md-9">

                        {(() => {
                            /*
                            if (message.type === "image") {
                                return (
                                    <div className="chat-bubble chat-bubble--right"><img alt="not found" width={"200px"} src={contact.content} onLoad={() => setLoad(true)} />
                                        <span className="time text-muted small">{contact.created}</span></div>
                                )
                            } else if (contact.type === "video") {
                                return (
                                    <div className="chat-bubble chat-bubble--right">
                                        <video width={"400px"} controls onLoadedData={() => setLoad(true)} >
                                            <source src={contact.message} type="video/mp4" />
                                        </video>
                                        <span className="time text-muted small">{contact.time}</span>
                                    </div>
                                )
                            }
                            else if (contact.type === "record") {
                                return (
                                    <div className="chat-bubble chat-bubble--right">
                                        <audio controlsList="nodownload" controls onLoadedData={() => setLoad(true)}>
                                            <source src={contact.message} type="audio/mpeg" />
                                        </audio>


                                        <span className="time text-muted small">{contact.time}</span></div>
                                )
                            }
                            else {
                                return (
                                    <div className="chat-bubble chat-bubble--right"><p className="text-muted">{contact.message}</p>
                                        <span className="time text-muted small">{contact.time}</span></div>
                                )
                            }
                            */
                            return (
                                <div className="chat-bubble chat-bubble--right"><p className="text-muted">{message.content}</p>
                                    <span className="time text-muted small">{message.created}</span></div>
                            )
                        })()}

                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="row-message">
                    <div className="col-md-3">
                        <div className="chat-bubble chat-bubble--left">
                            <p className="text-muted">{message.content}</p>
                            <span className="time text-muted small">{message.created}</span>
                        </div>
                    </div>
                </div>
            )
        }
    });
    return (
        <div className="help-div">
            <div className="current-contact">
                <img className="profile-image" src={props.img} alt="icon"></img>
                <span className="text">
                    <h6 className="contact-name">{props.nickname}</h6>
                    <p className="text-muted quote">Throw kindness around like confetti</p>
                </span>
            </div>

            <div className="chat-panel" ref={containerRef}>
                {messagesList}
            </div>
            <div className="row-chat">
                <div className="col-12">
                    <div className="new-message-panel">
                    {/*<Form className="input-message" onSubmit={e => {
                        e.preventDefault();
                        console.log("sending: " + input);
                        newMessage(input);
                        }}>*/}
                        <Form className="input-message" onSubmit={e => {
                            e.preventDefault();
                            console.log("sending: " + input);}}>
                        
                        <InputGroup >
                        
                            <Dropdown drop="up">
                                <Dropdown.Toggle className="dropdown-button">
                                    <i className="bi bi-paperclip "></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="animate slideIn">
                                    <Dropdown.Item className="item-1"
                                        onClick={handleShowImageModal}>
                                        <img className="image-icon" src="./images/image.png" alt="image" />
                                    </Dropdown.Item>
                                    <Dropdown.Item className="item-2"
                                        onClick={handleShowVideoModal}>
                                        <img className="image-icon" src="./images/movie.png" alt="image" />
                                    </Dropdown.Item>
                                    <Dropdown.Item className="item-3"
                                        onClick={handleShowRecordModal}>
                                        <img className="image-icon" src="./images/voice.png" alt="image" />
                                    </Dropdown.Item>
                                    <Dropdown.Item className="item-4"
                                        onClick={handleShowAudioModal}>
                                        <img className="image-icon" src="./images/sound.png" alt="image" />
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            {/*<Form onSubmit={e => {
                                e.preventDefault();
                                newMessage(text);
                                }}>
                            <textarea value={text} onChange={e => setText(e.target.value)}></textarea>
                            <Button variant="success" type="submit">Submit</Button>
                            </Form>
                            */}
                            
                            <Form.Control value={input} className="input-message" type={'text'} placeholder={'Write a message'}
                                onChange={(e) => setInput(e.target.value)}>
                            {/*onKeyPress={enterKey}>*/}
                            
                            </Form.Control>
                            <Button className="send-message" type="submit" onClick={showItem}>
                                <i className="bi bi-send float-end"></i>
                            </Button>
                            
                            <ImageModal show={show} onHide={handleCloseImageModal} image={selectedImage}
                                showImage={showImage} setImage={setSelectedImage} />

                            <VideoModal show={showVideoModal} onHide={handleCloseVideoModal} video={selectedVideo}
                                showVideo={showVideoFunc} setVideo={setSelectedVideo} />

                            <RecordingModal show={showRecordModal} onHide={handleCloseRecordModal} record={selectedRecord}
                                showRecord={showRecordFunc} setRecord={setSelectedRecord} />

                            <AudioModal show={showAudioModal} onHide={handleCloseAudioModal} audio={selectedAudio}
                                showAudio={showAudioFunc} setAudio={setSelectedAudio} />
                        </InputGroup>
                       </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}