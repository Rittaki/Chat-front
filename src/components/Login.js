import './Login.css';
import { useState, useEffect } from 'react';
import Chat from './chat/Chat';
import {  Link } from "react-router-dom";


export default function Login() {
    const [userName , setUserName] =useState("");
    const [password , setPassword] =useState("");
    const[errors, setErrors ]=useState({})
    const[isFound, setIsFound] = useState(false);
    const[isSubmit, setIsSubmit]=useState(false);
    const[isChecked, setIsChecked]=useState(false);
    const[isRedirect, setIsRedirect]=useState(false);
    const[saveUser,setSaveUser]=useState({});

    //checks values when log in clicked
    const sunbmitFun = (e) => {
        e.preventDefault();
        setIsSubmit(true);
        setErrors(checkErrors(userName,password))
    };

    const headers = new Headers();
    headers.append('content-type', 'application/json');
    const init = {
        method: 'POST',
        headers,
        body:JSON.stringify({ Username:userName,Password:password })
      };


    const checkDataBase=(async()=>{
        const response = await fetch('https://localhost:7038/api/Users/Login', init);
        const mediaType = response.headers.get('content-type');
        let data;
        if (mediaType.includes('json')) {
          data = await response.json();
          if(data!="Failed"){
              setIsFound(true);
              setIsChecked(true)
              setSaveUser(data);
          }
          else{
            setIsChecked(true)
          }
    }
})
    //checking errors in entered values
    const checkErrors=(userName,password)=>{
        const errors={}
        if(!userName){
            errors.userName = "Username is required";
        }
        if(!password){
            errors.password = "Password is required";
        }
        return errors;

    };

    //checks if there are no errors and user found in database
    useEffect(()=>{
        if(Object.keys(errors).length===0&&isSubmit){
            checkDataBase();
        }
        else if(Object.keys(errors).length!=0 && isSubmit){
            setIsSubmit(false)
        }
    },[errors]);


    useEffect(()=>{
        if(isFound){
            setIsRedirect(true);
        }
        else if(!isFound&&isChecked&&isSubmit){
            errors.login = "Invalid username or password";
            setIsSubmit(false);
            setIsChecked(false);
        }
    },[isChecked]);
    //redirects to chat if necessary
    if(isRedirect){
        window.history.pushState(null, '', `/Chat`);
        return (<Chat user={saveUser}/> )
    }
    return (
        <div className="container-fluid">
            <div className="row">
                {/*<div className="col-md-3 col-sm-4 col-xs-12"></div>*/}
                {/*<div className="col-md-4 col-sm-4 col-xs-12">*/}
                    <div className="mt-20">
                        <form className="form-container" onSubmit={sunbmitFun}>
                            <h1>Login</h1>
                            <div className="form-group mt-3">
                                <label htmlFor="user" className="sr-only">Username</label>
                                <input type="text" id="user" className="form-control mt-1" placeholder="Username" onChange={(e)=>setUserName(e.target.value)}/>
                            </div>
                            <p className="error">{errors.userName}</p>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input type="password" id="password" className="form-control mt-1" placeholder="Password"  onChange={(e)=>setPassword(e.target.value)} />
                            <p className="error">{errors.password}</p>
                            <p className="error">{errors.login}</p>
                            <div className="mt-3">
                                <button className="btn btn-lg btn-primary btn-block"  >Log in</button>
                            </div>
                            <div className="mt-3 text-center">
                                Not Registered? <Link to="/Signup" className="text-dark fw-bold" > Create an Account</Link>
                            </div>
                        </form>
                    </div>
                {/*</div>*/}
            </div>
        </div>
    );
}
