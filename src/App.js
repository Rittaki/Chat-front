import './App.css';
import Chat from './components/chat/Chat';
import Login from './components/Login';
import Signup from './components/Signup';

import { BrowserRouter, Routes, Route } from 'react-router-dom';


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
        </div>
    );
}

export default App;
