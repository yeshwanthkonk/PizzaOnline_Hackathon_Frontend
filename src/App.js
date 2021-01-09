import './App.css'
import React from "react"

import Admin from "./admin"
import Home from "./home"
import Notification from "./notifications"
import NavBar from "./navbar"
import Login from "./login"
import Signup from "./signup"
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
  const [loading, setLoading] = React.useState("block");// eslint-disable-next-line
  const {authorized, Authenticate, Logout, saveToken} = useAuthorize({setUser, setLoading});
  const {role, setRole} = React.useState("");
  

  const [alert, setAlert] = React.useState({"red_alert": "none", "green_alert": "none"});

  function Action({Page}){
    return (
      (authorized.isAuth)?(<Redirect push to="/dashboard"/>):
      <Page saveToken={saveToken} setAlert={setAlert} setLoading={setLoading}/>
    );
  }

  return (
    <div>
    <NavBar isAuth={authorized.isAuth} Logout={Logout} user={user}/>
    <Notification alert={alert} setAlert={setAlert} loading={loading}/>
    <Router>
      <Validate setRole={setRole}/>
      {/* <Switch> */}
        <Route exact path="/">
          <Redirect push to="/home"/>
        </Route>
        <Route path="/home">
          <Action Page={Home}/>
        </Route>
        <Route path="/login">
          <Action Page={Login}/>
        </Route>
        <Route exact path="/signup">
          <Action Page={Signup}/>
        </Route>
        <Route path="/admin">
          <Admin></Admin>
        </Route>
        {/* <PrivateComponents authorized={authorized} setAlert={setAlert}/> */}
      {/* </Switch> */}
    </Router>
    </div>
  );
}

export default App;
