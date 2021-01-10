import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

function Login({saveToken, setAlert, setLoading, role}) {

    async function login(event){
        event.preventDefault();
        let details = {
            "email":user,
            "password":password,
            role,
        }
        setLoading("block");
        try{
            let response = await fetch(window.env.API_URL+"login",{ 
            method: 'POST', 
            headers: { 
                'Content-Type':  
                    'application/json;charset=utf-8' 
            }, 
            body: JSON.stringify(details) 
            })
            let result = await response.json()
            if(response['status']!==200)
                setAlert({"red_alert": "block", "green_alert": "none", "msg": result["detail"]})
            else{
                saveToken(result["token"]);
                setAlert({"red_alert": "none", "green_alert": "block"})
            } 
        }
        catch(error){
            setAlert({"red_alert": "block", "green_alert": "none"})
        }  
        setTimeout(()=>setAlert({"red_alert": "none", "green_alert": "none"}), 3000);
        setLoading("none");
    }
    
    const [user, setUser] = React.useState("");
    const [password, setPaswword] = React.useState("");

    return (
        <div>
        <form method="POST" style={{width:"350px", margin:"10% auto 0 auto"}} onSubmit={login}>
            <h1>Please Login, here</h1>
            <div className="form-group">
                <label htmlFor="username">User ID</label>
                <input type="text" className="form-control" id="username" name="username" placeholder="Email" autoFocus required onChange={(event)=>setUser(event.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" name='password' placeholder="Password" required onChange={(event)=>setPaswword(event.target.value)}/>
            </div>
            <div className="ml-2 mb-2" id="link_resend">
              <a href="/forgot_password">Forgot Password</a>
            </div>
            <button type="submit" className="btn btn-primary mt-2">Log In</button>
        </form>
        </div>
    );
}


function Signup({setAlert, setLoading, role}) {
    const [user, setUser] = React.useState("");
    const [password, setPaswword] = React.useState("");
    const [email, setEmail] = React.useState("");

    const history = useHistory();

    async function register(event) {
        event.preventDefault();
        let details = {
            email,
            password,
            role,
            "name": user,
        }
        setLoading("block")
        try{
            let response = await fetch(window.env.API_URL +"new_user",{ 
            method: 'POST', 
            headers: { 
                'Content-Type':  
                    'application/json;charset=utf-8' 
            }, 
            body: JSON.stringify(details) 
            })
            let result = await response.json()
            if(response['status']!==200)
                setAlert({"red_alert": "block", "green_alert": "none", "msg": result["detail"]})
            else{
                await fetch(window.env.API_URL +"activate_link",{ 
                    method: 'POST', 
                    headers: { 
                        'Content-Type':  
                            'application/json;charset=utf-8' 
                    }, 
                    body: JSON.stringify({email}) 
                })
                setAlert({"red_alert": "none", "green_alert": "block", "msg":"Activation Email has been sent"})
                history.push("/home");
            } 
        }
        catch(error){
            setAlert({"red_alert": "block", "green_alert": "none"})
        } 
        setLoading("none");
        setTimeout(()=>setAlert({"red_alert": "none", "green_alert": "none"}), 3000);
        return false;
    }

    return (
        <div>
        <form method="POST" style={{width:"380px", margin:"10% auto 0 auto"}} onSubmit={register} key="signup">
            <h1>Please Sign Up, here</h1>
            <div className="form-group">
                <label htmlFor="name">User Name</label>
                <input type="text" className="form-control" value={user} id="name" name="name" placeholder="Full Name" autoFocus required onChange={(event)=>setUser(event.target.value)}/>
            </div>
            <div className="form-group">
                <label htmlFor="email">Email Id</label>
                <input type="email" className="form-control" id="email" name="email" placeholder="Email" required onChange={(event)=>setEmail(event.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" name='password' placeholder="Password" required onChange={(event)=>setPaswword(event.target.value)}/>
            </div>
            <button type="submit" className="btn btn-primary mt-2">Register</button>
        </form>
        </div>
    )
}

function ForgotPassword({setAlert, setLoading, role}){
    const history = useHistory();

    async function forgot_password(event){
        event.preventDefault();
        let details = {
            email
        }
        setLoading("block")
        try{
            let response = await fetch(window.env.API_URL+"reset_link",{ 
            method: 'POST', 
            headers: { 
                'Content-Type':  
                    'application/json;charset=utf-8' 
            }, 
            body: JSON.stringify(details) 
            })
            let result = await response.json()
            if(response['status']!==200)
                setAlert({"red_alert": "block", "green_alert": "none", "msg": result["detail"]})
            else{
                setAlert({"red_alert": "none", "green_alert": "block", "msg":result["detail"]})
                history.push("/home");
            } 
        }
        catch(error){
            setAlert({"red_alert": "block", "green_alert": "none"})
        } 
        setLoading("none");
        setTimeout(()=>setAlert({"red_alert": "none", "green_alert": "none"}), 3000);
        return false;
    }

    let query = new URLSearchParams(useLocation().search);

    React.useEffect(()=>{
        let q = query.get("q");
        if(!q){
            setAlert({"red_alert": "block", "green_alert": "none", "msg": 'Invalid Link'});
            setTimeout(()=>setAlert({"red_alert": "none", "green_alert": "none"}), 3000);
        }// eslint-disable-next-line
    }, [])
    const [email, setEmail] = React.useState("");
        
    return (
        <form method="POST" style={{width:"380px", margin:"10% auto 0 auto"}} onSubmit={forgot_password} key="forgot">
            <img style={{marginLeft: "40%"}} className="mb-4" src="/logo.png" alt="" width="80" height="80"/>
            <h1 className="h3 mb-3 font-weight-normal">Enter Email Register with us</h1>
            <div className="form-group">
                <label htmlFor="email">Email Id</label>
                <input type="email" className="form-control" id="email" name="email" placeholder="Email" required onChange={(event)=>setEmail(event.target.value)}/>
            </div>
            <button type="submit" className="btn btn-primary mt-2">Send Link</button>
            <p className="mt-2 mb-3 text-muted">© 2017-2020</p>
        </form>
    )
}

function ResetPassword({setAlert, setLoading, role}){
    const history = useHistory();

    async function reset_password(event){
        event.preventDefault();
        if(password !== confirmPass){
            setAlert({"red_alert": "block", "green_alert": "none", "msg": "Passwords Doesn't match"});
            setTimeout(()=>setAlert({"red_alert": "none", "green_alert": "none"}), 3000);
            return;
        }
        let details = {
            id,
            data: {"password": confirmPass},
        }
        setLoading("block")
        try{
            let response = await fetch(window.env.API_URL+"update_password",{ 
            method: 'POST', 
            headers: { 
                'Content-Type':  
                    'application/json;charset=utf-8' 
            }, 
            body: JSON.stringify(details) 
            })
            let result = await response.json()
            if(response['status']!==200)
                setAlert({"red_alert": "block", "green_alert": "none", "msg": result["detail"]})
            else{
                setAlert({"red_alert": "none", "green_alert": "block", "msg":result["detail"]})
                history.push("/home");
            } 
        }
        catch(error){
            setAlert({"red_alert": "block", "green_alert": "none"})
        } 
        setLoading("none");
        setTimeout(()=>setAlert({"red_alert": "none", "green_alert": "none"}), 3000);
        return false;
    }

    let query = new URLSearchParams(useLocation().search);

    React.useEffect(()=>{
        setID(query.get("id"));
        // eslint-disable-next-line
    }, [])
    const [password, setPaswword] = React.useState("");
    const [confirmPass, setconfirmPass] = React.useState("");
    const [id, setID] = React.useState("");
        
    return (
        <div>
        {(id)?(<img src="https://assets.prestashop2.com/sites/default/files/styles/blog_750x320/public/blog/2019/10/banner_error_404.jpg" alt=""/>):(
        <form method="POST" style={{width:"380px", margin:"10% auto 0 auto"}} onSubmit={reset_password} key="forgot">
            <img style={{marginLeft: "40%"}} className="mb-4" src="/logo.png" alt="" width="80" height="80"/>
            <h1 className="h3 mb-3 font-weight-normal" id="note">Enter New Password</h1>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="text" className="form-control" id="password" name='password' placeholder="Password" required onChange={(event)=>setPaswword(event.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="conf_password">Confirm Password</label>
              <input type="password" className="form-control" id="conf_password" name='conf_password' placeholder="Confirm Password" required onChange={(event)=>setconfirmPass (event.target.value)}/>
            </div>
            <div className="mb-3" id="link_resend">
              <a href="/forgot_password">Send it Again</a>
            </div>
            <button type="submit" className="btn btn-primary mt-2">Reset Password</button>
            <p className="mt-2 mb-3 text-muted">© 2017-2020</p>
        </form>
        )}
        </div>
    )
}

export {Login, Signup, ForgotPassword, ResetPassword}