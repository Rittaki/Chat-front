import { useEffect, useState, useRef } from 'react';
import './Chat.css';
import { Modal, Button } from 'react-bootstrap';
import AddNewContact from './addContact/AddNewContact';
import ChatMessages from './chatMessages/ChatMessages';

function Chat(props) {


    const [selectedContact, SetSelectedContact] = useState({});
    //for search bar
    const [search, setSearch] = useState("");
    //for adding new contact
    const [newContactNickname, setNewContactNickname] = useState("");
    const [newContact, setNewContact] = useState("");
    const [newContactServer, setNewContactServer] = useState("");

    const [inDatabase, setInDatabase] = useState(false);
    const [isContact, setIsContact] = useState(false);

    const [newContactError, setNewContactError] = useState("");

    const [show, setShow] = useState(false);
    const [addContactSubmit, setAddContactSubmit] = useState(false);
    const [currnetContact, setCurrentContact] = useState({});
    //last message update and time since
    //info about the current user
    
    //const [saveUser, setSaveUser] = useState((props.user === undefined) ? JSON.parse(localStorage.getItem('user')) : props.user);

    //contacts of current user
    const [list, setList] = useState([]);
    const [checkDatabaseForContacts, setCheckDatabaseForContacts] = useState(false);
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
        } else {
            data = [];
        }
        console.log(data);
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
                
                    <span className="time-text-muted-small">{contact.lastdate}</span>
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
        setInDatabase(false);
        setIsContact(false);
        setNewContactError("");
        setAddContactSubmit(false);
    };

    var contact = {};
    //checks if added contact is valid without checking database
    const handleAddContact = () => {
        setAddContactSubmit(true);
        setIsContact(false);
        if (newContact === "" || newContactNickname === "" || newContactServer === "") {
            setNewContactError("all fields are required");
            setAddContactSubmit(false);
        }
        else if (newContact === props.user.userName) {
            setNewContactError("can't add yourself as contact");
            setAddContactSubmit(false);
        }
        else {
            contact = {newContactNickname, newContact, newContactServer};
            console.log(contact);
            list.map((item) => compareContacts(item))
        }
    }




    //changes last message in contact panel when a message is sent and moving the contact to the top of the contact list
    /*
    useEffect(() => {
        if (lastMessage != "") {
            array.map((contact) => {
                if (contact.name == selectedContact.name) {
                    contact.message = lastMessage;
                    contact.time = -1;
                }
            })
            array.sort((a, b) => (a.time > b.time) ? 1 : (a.time === b.time) ? 0 : -1)
            array.map((contact) => {
                if (contact.name == selectedContact.name) {
                    contact.time = 0;
                }
            })
            setLastMessage("");
        }
    }, [lastMessage])
    

    //updating the time since last message every minute
    useEffect(() => {
        const interval = setInterval(() => {
            array.map((contact) => {
                contact.time += 1;;
                setMinutes((minutes) => minutes + 1);
            })
        }, 1000 * 60);

        return () => clearInterval(interval);
    }, []);
    */


/*
    //saves user info so in case of a refresh it will stay in his chat page
    useEffect(() => {
        if (props.user != undefined) {
            localStorage.setItem('user', JSON.stringify(props.user))
        }
    }, []);
*/



    //checks if added contact is already a contact of current user
    function compareContacts(item) {
        if (item.name === newContact) {
            setIsContact(true);
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