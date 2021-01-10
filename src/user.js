import React from "react"

import {
    Switch,
    Route,
    useRouteMatch,
    useHistory,
    useLocation
  } from "react-router-dom";

function PizzaList({pizzas}){
    let history = useHistory();
    function next(link){
        history.push(link)
    }
    return (
        <div className="row">
            <div className="col-xs-0 col-md-2"></div>
            <div className="col-xs-12 col-sm-10">
                <div className="row">
                {pizzas.map((item, index)=>{
                    let loc="./files/"+item.image
                    let link = "/user/addons?id="+item._id
                    return (
                    <div key={index} className="col-xs-12 col-sm-5 col-lg-4">
                        <div className="card"> {/*style={{width: "18rem"}} */}
                          <img src={loc} className="card-img-top" alt=""/>
                          <div className="card-body">
                            <h5 className="card-title">{item.name}</h5>
                            <p className="card-text">{item.desc}</p>
                            <button onClick={()=>next(link)} className="btn btn-primary">Order Now</button>
                            <b className="pl-2">INR {item.price}</b>
                          </div>
                        </div>
                    </div>
                    )
                })}
                </div>
            </div>
        </div>
    )
}

function PizzaAddons({pizzas}){
    let query = new URLSearchParams(useLocation().search);
    let history = useHistory();
    let id = query.get("id")
    function next(){
        let item = pizzas.filter((item)=>item._id === id)
        sessionStorage.setItem("price", item.price)
        sessionStorage.setItem("id", item.id)
        history.push("/user/checkout");
    }
    return (
        <div style={{textAlign:"center"}}>
            <h1>Currently No Addons, Available</h1>
            <button onClick={()=>next()} className="btn btn-primary">Check Out</button>
        </div>
    )
}

function PizzaCheckout(){
    return (
        <div style={{textAlign:"center"}}>

        </div>
    )
}

export default function Userboard({authorized}){

    const [pizzas, setPizzas] = React.useState([]);

    React.useEffect(()=>{
        async function pizza_list(){
            let response = await fetch(window.env.API_URL+"pizza_list",{ 
                method: 'GET', 
                headers: { 
                    'Content-Type':  
                        'application/json;charset=utf-8' 
                } 
            })
            let result = await response.json()
            setPizzas(result);
        }
        pizza_list();
    }, [])

    let { url } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${url}/`}>
              <PizzaList pizzas={pizzas}/>
            </Route>
            <Route path={`${url}/addons`}>
              <PizzaAddons pizzas={pizzas}/>
            </Route>
            <Route path={`${url}/checkout`}>
              <PizzaCheckout pizzas={pizzas}/>
            </Route>
        </Switch>
    )
}