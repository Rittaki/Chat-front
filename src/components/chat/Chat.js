import { useEffect, useState, useRef } from 'react';
import './Chat.css';
import { Modal, Button } from 'react-bootstrap';
import AddNewContact from './addContact/AddNewContact';
import ChatMessages from './chatMessages/ChatMessages';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';


function Chat(props) {


    const [checkDatabaseForContacts, setCheckDatabaseForContacts] = useState(false);

    const [selectedContact, SetSelectedContact] = useState({});
    //for search bar
    const [search, setSearch] = useState("");
    //for adding new contact
    const [newContactNickname, setNewContactNickname] = useState("");
    const [newContact, setNewContact] = useState("");
    const [newContactServer, setNewContactServer] = useState("");
    const [inValidNewContact, setInValidNewContact] = useState(false);
    const [newContactError, setNewContactError] = useState("");

    const [show, setShow] = useState(false);
    //last message update and time since
    //info about the current user
    
    //const [saveUser, setSaveUser] = useState((props.user === undefined) ? JSON.parse(localStorage.getItem('user')) : props.user);


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
            connection.on("ChangeRecieved", (newContact) => {
                console.log('received: ' + newContact);
                setCheckDatabaseForContacts(true);
                setCheckDatabaseForContacts(false);
            })
        })      
    }, [connection]);

    //contacts of current user
    const [list, setList] = useState([]);
    useEffect (()=>{
        setCheckDatabaseForContacts(true);
    },[]);


    useEffect ( () => {
    async function findContacts(){
        const response = await fetch('https://localhost:7038/api/Contacts/?user='+props.user.userName);
        const mediaType = response.headers.get('content-type');
        let data;
        if (mediaType.includes('json')) {
            data = await response.json();
        } 
        setList(data)
    }
    findContacts()
    },[checkDatabaseForContacts]);

    //for searching contacts
    const filteredData = list.filter((contact) => {
        if (search === '') {
            return contact;
        }
        else if (contact.name.toLowerCase().includes(search.toLowerCase())) {
            return contact;
        }
    })
    //for clicking on contact from the list of contacts
    const handleClick = (contact) => {
        SetSelectedContact(contact);
    }


    //showing all the contacts the user has
    const chatList = filteredData.map((contact, key) => {
        return (
            <div className="contacts-map">
                <div className={(selectedContact.name === contact.name) ? "selected-contact" : "contacts"}
                    onClick={() => handleClick(contact)}>
                    <img className={(selectedContact.name === contact.name) ? "selected-contacts-image" : "contacts-image"}
                        src="./images/cat2.png" alt="icon"></img>
                    <div className={(selectedContact.name === contact.name) ? "selected-message" : "message"}>
                        <h6 className={(selectedContact.name === contact.name) ? "selected-contact-name" : "contact-name"}>{contact.name}</h6>
                        <p className={(selectedContact.name === contact.name) ? "selected-text-muted" : "text-muted"}>{contact.last}</p>
                    </div>
                
                    <span className="time-text-muted-small">{(contact.last==null)?null:contact.lastdate}</span>
                </div>
                <hr />
            </div>
        )
    });

    let modelStyle = {
        padding: '10%',
        display: 'block',
    }

    //showing window of adding contact
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setNewContactNickname("");
        setNewContact("");
        setNewContactServer("");
        setNewContactError("");
        setInValidNewContact(false);
        setNewContactError("")
    };

    //checks if added contact is valid without checking database
    const handleAddContact = () => {
        if (newContact === "" || newContactNickname === "" || newContactServer === "") {
            setNewContactError("all fields are required");
        }
        else if (newContact === props.user.userName) {
            setNewContactError("can't add yourself as contact");
        }
        else {
            AddContactByOrder();
        }
    }


    const AddContactByOrder = async () => {
        const result = await InviteContact()
        if(result==0){
            setNewContactError(`There's no such user in ${newContactServer}`);
        }
        else if(result==1){
            setNewContactError(`${newContact} is already a contact`);
        }
        else{
            AddContact();
            updateContacts();
            await connection.invoke("Changed", newContact);
        }
    }

    function updateContacts(){
        handleClose();
        if(checkDatabaseForContacts){
            setCheckDatabaseForContacts(false);
        }
        else{
            setCheckDatabaseForContacts(true);
        }
    }
    async function AddContact(){
        const headers = new Headers();
        headers.append('content-type', 'application/json');

        const init = {
            method: 'POST',
            headers,
            body: JSON.stringify({id:newContact,name:newContactNickname,server:newContactServer,user:props.user.userName})
          };
        await fetch('https://localhost:7038/api/contacts/AddContact', init);
    }

    async function InviteContact(){
        const headers = new Headers();
        headers.append('content-type', 'application/json');

        const init = {
            method: 'POST',
            headers,
            body: JSON.stringify({from:props.user.userName,to:newContact,server:newContactServer})
          };
        const response=await fetch('https://localhost:7038/api/invitation/AddContact', init);
        if(response.status==404){
            return 0;
        }
        else if(response.status==400){
            return 1;
        }
        return 2;
    }



    //checks if added contact is already a contact of current user
    function compareContacts(item) {
        if (item.id === newContact) {
            setNewContactError(`${newContact} is already a contact`);
            setInValidNewContact(true);
        }

    }
    return (
        <div className="container-fluid chat">
            <div className="row chat">
                <div className="col-md-5 contacts-colomn">
                    <div className="profile-panel">
                        <img className="profile-image" src={"./images/cat4.png"} alt="icon"></img>
                        <span className="profile-name">{props.user.nickname}</span>
                        <span className="add-contact" onClick={handleShow}>
                            <i className="bi bi-person-plus float-end"></i>
                        </span>
                    </div>
                    <div className="search-box">
                        <div className="input-wrapper">
                            <i className="bi bi-search"></i>
                            <input type="text" placeholder="Search chat" onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </div>
                    <div className='contacts-container'>
                        {chatList}
                    </div>

                </div>

                <Modal show={show} style={modelStyle} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Add new contact
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AddNewContact setNewContact={setNewContact} 
                                       setNewContactNickname={setNewContactNickname}
                                       setNewContactServer={setNewContactServer}/>
                        <div className='error'>{newContactError}</div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleAddContact}>
                            Add Contact
                        </Button>
                    </Modal.Footer>
                </Modal>

                <div className="col-md-7 chat-colomn" >

                    {(selectedContact.name) ? (<ChatMessages  logInUserName={props.user.userName} contactUserName={selectedContact.id} nickname={selectedContact.name} img={"./images/cat2.png"} contactServer={selectedContact.server}
                     setCheckDatabaseForContacts={setCheckDatabaseForContacts} checkDatabaseForContacts={checkDatabaseForContacts} />)
                        : <div className="select-text">Select a chat to start messaging</div>}
                </div>
            </div>
        </div>

    );
}

export default Chat;