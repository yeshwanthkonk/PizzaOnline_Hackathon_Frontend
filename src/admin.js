import {
    Switch,
    Route,
    useRouteMatch
  } from "react-router-dom";
  
import { Signup } from "./user_auth_form"

export default function Admin({authorized, setLoading, setAlert, saveToken}){

    function Action({Page}){
        return (
        //   (authorized.isAuth)?(<Redirect push to="./home"/>):
          <Page saveToken={saveToken} setAlert={setAlert} setLoading={setLoading}/>
        );
    }

    let { url } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${url}`}>
                <h1 style={{textAlign:"center"}}>Under Maintance</h1>
            </Route>
            <Route exact path={`${url}/signup`}>
              <Action Page={Signup}/>
            </Route>
        </Switch>
    )
}