import React from "react"
import { useLocation } from "react-router-dom"

export default function Validate({setRole}){
    let {pathname} = useLocation();
    console.log(pathname);
    React.useEffect(()=>{
        if(pathname.startsWith("/admin"))
            setRole("admin")
        else
            setRole("user");// eslint-disable-next-line
    }, []);
    return null;
}