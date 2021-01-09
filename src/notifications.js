import "./notifications.css";

export default function Notification({alert, setAlert, loading}) {

    const red_msg = alert.msg?(alert.msg):"Something Went Wrong";
    const green_msg = alert.msg?(alert.msg):"Successful";

    const redDiv = (
        <div id="red-alert" style={{display: alert.red_alert}}>
            <span className="closebtn" onClick={()=>setAlert({"red_alert": "none", "green_alert": "none"})}>&times;</span> 
            <span id="error_content">{red_msg}</span>
        </div>
    );

    const greenDiv = (
        <div id="green-alert" style={{display: alert.green_alert}}>
            <span className="closebtn" onClick={()=>setAlert({"red_alert": "none", "green_alert": "none"})}>&times;</span> 
            <span id="success_content">{green_msg}</span>
        </div>
    );

    const loadingDiv = (
        <div id="load_back" style={{display: loading}}>
            <div id="loading"></div>
        </div>
    )
    return (
        <div>
            {redDiv}
            {greenDiv}
            {loadingDiv}
        </div>        
    );
}