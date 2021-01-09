import React from "react"
import "./style.css"

const logout_style = {
    fontSize: "20px",
}
const tab = {
    left: "auto",
    right: "0",
}

export default function NavBar({isAuth, Logout, user}) {
    return (
        <nav className="navbar navbar-dark bg-dark">
            <a className="navbar-brand" href="/">
            <img src="./logo.png" width="50" height="50" alt=""/>
             &nbsp;Pizza Hack
            </a>
            {
                (isAuth)?(
                    <div className="nav justify-content-end mr-5" id="nav_user_status">
                        <input type="search" className="mr-3" placeholder="Search"/>
                        <i className='far fa-bell' style={{fontSize:'24px', color: "white", marginTop:"8px", marginRight:"20px"}}></i>
                        <div className="dropdown">
                            <button type="button" className="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{border: "0px"}}>
                                <img
                                src="https://icons.iconarchive.com/icons/alecive/flatwoken/256/Apps-User-Online-icon.png"
                                width="40"
                                height="40"
                                className="d-inline-block align-top"
                                alt=""
                                loading="lazy"/>
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={tab}>
                            <b className="dropdown-item">{user}</b>
                            <a className="dropdown-item" href="./home" onClick={Logout} style={logout_style}>Logout</a>
                            </div>
                        </div>
                    </div>                    
                ):(
                    <div>
                    <a href="/login" type='button' className='btn btn-primary btn-lg btn-mr'>Login</a>
                    <a href="/signup" type='button' className='btn btn-warning btn-lg btn-mr'>Sign up</a>
                    </div>
                )
            }
        </nav>
    )
}