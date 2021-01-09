import {useLocation} from "react-router-dom"

export default function Validate({setRole}){
    let loc = useLocation();
    console.log(loc.pathname);
    return null;
}