import './Signup.css'
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom'
import Chat from './chat/Chat';

function Signup() {
    const [username , setUsername] =useState("");
    const [password , setPassword] =useState("");
    const [repeatPassword , setRepeatPassword] =useState("");
    const [nickname , setNickname] =useState("");
    const [picture, SetPicture]=useState("./images/blank.png");
    const[errors, setErrors ]=useState({})
    const[isSubmit, setIsSubmit]=useState(false);
    const[isRedirect, setIsRedirect]=useState(false);
    
    //checks values when log in clicked
    const sunbmitFun = (e) => {
        e.preventDefault();
        setErrors(checkErrors(username,password,nickname,repeatPassword,picture))
        setIsSubmit(true);
    };

    //handle uploaded pictures
    function handlePicture(e) {
        if(e.target.files[0].type[0] === "i") {
            SetPicture(URL.createObjectURL(e.target.files[0]));
        }
    }

    //checking errors in entered values
    const checkErrors=(username,password,nickname,repeatPassword)=>{
        const errors={}
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;
        if(!username){
            errors.username = "Username is required";
        }
        if(!nickname){
            errors.nickname = "nickname is required";
        }
        if(!password){
            errors.password = "password is required";
        }
        else if(!regex.test(password)){
            errors.password = "password must be between 8 and 16 characters and contain at least one lowercase letter, one uppercase letter and one digit.";
        }
        if(!repeatPassword){
            errors.repeatPassword = "repeat password is required";
        }
        else if(repeatPassword!=password){
            errors.repeatPassword = "repeated password must be identical to password";
        }
        return errors;

    };

    useEffect(()=>{
    },[errors]);

    //checks if there are no errors and if so the new registered user is added to hardcoded database
    useEffect(()=>{
        if(Object.keys(errors).length===0 && isSubmit){
            checkDataBase()
        }
        
    },[isSubmit]);

    const checkDataBase=(async () => {
        const headers = new Headers();
        headers.append('content-type', 'application/json');

        const init = {
          method: 'POST',
          headers,
          body: JSON.stringify({ Id: username,UserName:username,Password:password,NickName:nickname })
        };
      
        const response = await fetch('https://localhost:7038/api/Users/Register', init);
        console.log(`response status is ${response.status}`);
        const mediaType = response.headers.get('content-type');
        let data;
        if (mediaType.includes('json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }
        if(data=="Success"){
            setIsRedirect(true)
        }
        else{
            errors.username="Username is taken"
            setIsSubmit(false);
        }
      });

    //redirects to chat if necessary
    if(isRedirect){
        window.history.pushState(null, '', `/Chat`);
        return (<Chat user={{userName : username , nickname: nickname , picture : picture , password: password}}/> )
    }


    return (
        <div className="container-fluid">
            <div className="row">
                {/*<div className="col-md-3 col-sm-4 col-xs-12"></div>*/}
                {/*<div className="col-md-4 col-sm-4 col-xs-12">*/}
                    <div className="mt-20">
                        <form className="form-container" onSubmit={sunbmitFun}>
                        <div className='img-holder'>
                            <img src={picture} className="img1" />
                        </div>
                        <h1>Sign up</h1>
                        <div className="form-group mt-3">
                            <label htmlFor="user" className="sr-only">Username</label>
                            <input type="text" id="user" className="form-control mt-1" placeholder="Username" onChange={(e)=>setUsername(e.target.value)}/>
                            <p className="error">{errors.username}</p>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="nickname" className="sr-only">Nickname</label>
                            <input type="text" id="nickname" className="form-control mt-1 " placeholder="Nickname" onChange={(e)=>setNickname(e.target.value)} />
                            <p className="error">{errors.nickname}</p>
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input type="password" id="password" className="form-control mt-1" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
                            <p className="error">{errors.password}</p>
                        </div>
                        <div>
                            <label htmlFor="passwordRepeat" className="sr-only">Repeat Password</label>
                            <input type="password" id="passwordRepeat" className="form-control mt-1 " placeholder="Password" onChange={(e)=>setRepeatPassword(e.target.value)}/>
                            <p className="error">{errors.repeatPassword}</p>
                        </div>
                        {/*
                        <div>
                            <label htmlFor="picture" className="sr-only">Add Image</label>
                            <input type="file" id="image-upload" className="form-control mt-1" accept="image/*" onChange={handlePicture} /> 
                            <p className="error">{errors.picture}</p> 
                        </div>
                        */}
                        <div>
                            
                            <label htmlFor="picture" className="sr-only">Add Image</label>
                            <input type="file" id="image-upload" className="form-control mt-1" accept="image/*" onChange={handlePicture} /> 
                            <p className="error">{errors.picture}</p> 
                        </div>
                        <div className="mt-3">
                            <button className="btn btn-lg btn-primary btn-block">Create account</button>
                        </div>
                        <div className="mt-3 text-center">
                            Already have an account? <Link to="/" className="text-dark fw-bold"> Login</Link>
                        </div>
                        </form>
                    </div>
                {/*</div>*/}
            </div>
        </div>
    );
}

export default Signup