import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

export default function Signup({setAlert, setLoading}) {
    const [user, setUser] = React.useState("");
    const [password, setPaswword] = React.useState("");
    const [email, setEmail] = React.useState("");

    const history = useHistory();
    let {role} = useParams();

    async function register(event) {
        if(!role)
            role="user"
        event.preventDefault();
        let details = {
            email,
            password,
            role,
            "name": user,
        }
        setLoading("block")
        try{
            let response = await fetch(window.env.API_URL +"create_user",{ 
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
                setAlert({"red_alert": "none", "green_alert": "block", "msg":"Succesfully Register"})
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