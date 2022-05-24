import { Form } from "react-bootstrap";
import React from 'react';


const AddNewContact = (props) => {
    return (
        <Form>
            <Form.Group>
                <Form.Control type="text" placeholder="Nickname" onChange={(e)=>props.setNewContactNickname(e.target.value)}/>
                <br />
                <Form.Control type="text" placeholder="Username" onChange={(e)=>props.setNewContact(e.target.value)} />
                <br />
                <Form.Control type="text" placeholder="Server" onChange={(e)=>props.setNewContactServer(e.target.value)}/>
            </Form.Group>
        </Form>
    );
}

export default AddNewContact;