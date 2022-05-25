import './App.css';
import Chat from './components/chat/Chat';
import Login from './components/Login';
import Signup from './components/Signup';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Button } from 'react-bootstrap';


function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/Signup' element={<Signup/>}></Route>
                    <Route path='/' element={<Login/>}></Route>
                    <Route path='/Chat' element={<Chat/>}></Route>
                </Routes>
            </BrowserRouter>
            <div class="review-button">
                <a class="review-link" href='https://localhost:7038/Reviews' type="button">Click here to see other customers reviews</a>
            </div>
        </div>
    );
}

export default App;
