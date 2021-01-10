import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Home({setAlert}) {
    let query = new URLSearchParams(useLocation().search);
    React.useEffect(()=>{
        if(
            query.get("id")){
            setAlert({"red_alert": "none", "green_alert": "block", "msg": 'Account Activated'});
            setTimeout(()=>setAlert({"red_alert": "none", "green_alert": "none"}), 3000);
        }// eslint-disable-next-line
    }, [])
    return (
        <div>
        <div style={{textAlign:"center"}}>
            <h2 className="display-4 font-weight-normal">Hack Pizza Presents</h2>
        </div>
        <div className="home_background"></div>
        </div>
    );
}