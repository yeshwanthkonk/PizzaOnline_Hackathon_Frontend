import './App.css'
import React from "react"

import Admin from "./admin"
import Home from "./home"
import Notification from "./notifications"
import NavBar from "./navbar"
import { Login, Signup, ForgotPassword, ResetPassword } from "./user_auth_form"
import Userboard from "./user"
import useAuthorize from "./useAuthorize"
import Validate from "./validate"

import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";

function App() {
  
  const [user, setUser] = React.useState("");
  const [role, setRole] = React.useState("user");
  const [loading, setLoading] = React.useState("block");// eslint-disable-next-line
  const {authorized, Authenticate, Logout, saveToken} = useAuthorize({setUser, setLoading, role});
  
  function Action({Page, name}){
    return (
      (authorized.isAuth)?(<Redirect push to="/dashboard"/>):
      <Page key={name} saveToken={saveToken} setAlert={setAlert} setLoading={setLoading} role={role}/>
    );
  }

  React.useEffect(()=>{
    Authenticate();// eslint-disable-next-line
  }, [role]);

  const [alert, setAlert] = React.useState({"red_alert": "none", "green_alert": "none"});

  console.log(role);
  console.log(alert);
  console.log(authorized.isAuth)

  return (
    <div>
    <NavBar isAuth={authorized.isAuth} Logout={Logout} user={user}/>
    <Notification alert={alert} setAlert={setAlert} loading={loading}/>
    <Router>
      <Validate setRole={setRole}/>
      <Switch>
        <Route exact path="/">
          <Redirect push to="/home"/>
        </Route>
        <Route path="/home">
          {(authorized.isAuth)?(<Redirect push to="/user"/>):
          <Home setAlert={setAlert}/>}
        </Route>
        <Route path="/login">
          <Action Page={Login}/>
        </Route>
        <Route path="/signup">
          <Action Page={Signup}/>
        </Route>
        <Route path="/forgot_password">
          {(authorized.isAuth)?(<Redirect push to="/user"/>):
            <ForgotPassword saveToken={saveToken} setAlert={setAlert} setLoading={setLoading} role={role}/>}
        </Route>
        <Route path="/reset_password">
          {(authorized.isAuth)?(<Redirect push to="/user"/>):
            <ResetPassword saveToken={saveToken} setAlert={setAlert} setLoading={setLoading} role={role}/>}
        </Route>
        <Route path="/reset_password">
          <Action Page={Signup}/>
        </Route>
        <Route path="/admin">
          <Admin />
        </Route>
        <Route path="/user">
          {(!authorized.isAuth)?(<Redirect push to="/home"/>):
          <Userboard authorized={authorized} />}
        </Route>
        {/* <PrivateComponents authorized={authorized} setAlert={setAlert}/> */}
        <Redirect to="/home"/>
      </Switch>
    </Router>
    </div>
  );
}

export default App;
