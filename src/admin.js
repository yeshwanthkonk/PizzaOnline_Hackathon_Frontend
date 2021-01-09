import {
    BrowserRouter as Router,
    Switch,
    Redirect,
    Route,
    useLocation
  } from "react-router-dom";
  
import Signup from "./signup"

export default function Admin({authorized, setLoading, setAlert, saveToken}){

    function Action({Page}){
        return (
        //   (authorized.isAuth)?(<Redirect push to="./home"/>):
          <Page saveToken={saveToken} setAlert={setAlert} setLoading={setLoading}/>
        );
    }

    console.log(useLocation().pathname)

    return (
        // <Switch>
        <Route path="">
          <Action Page={Signup}/>
        </Route>
        // </Switch>
    )
}