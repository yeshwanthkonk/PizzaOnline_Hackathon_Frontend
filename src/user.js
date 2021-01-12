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
            <div style={{textAlign:"center"}} className="col-xs-2 col-sm-4 col-md-3 col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Delivery Details</h5>
                    <p className="card-text">No Data Availbale</p>
                    <a href="/orders" className="btn btn-primary">Go orders</a>
                  </div>
                </div>
            </div>
            <div className="col-xs-12 col-sm-8 col-md-9 col-lg-8">
                <div className="row">
                {pizzas.map((item, index)=>{
                    let loc="./files/"+item.image
                    let link = "/user/addons?id="+item._id
                    return (
                    <div key={index} className="col-xs-12 col-sm-10 col-md-6 col-lg-5">
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
        let item = pizzas.find((item)=>{
            return item._id === id
        })
        sessionStorage.setItem("price", item.price)
        sessionStorage.setItem("id", item._id)
        history.push("/user/checkout");
    }
    return (
        <div style={{textAlign:"center"}}>
            <h1>Currently No Addons, Available</h1>
            <button onClick={()=>next()} className="btn btn-primary">Check Out</button>
        </div>
    )
}

function PizzaCheckout({pizzas, authorized}){

    let history = useHistory();

    let price = sessionStorage.getItem("price");
    let id = sessionStorage.getItem("id");

    let item = pizzas.find((item)=>item._id === id)
    let loc = "/files/"+item.image;

    const [order_id, setOrderId] = React.useState("")

    React.useEffect(()=>{
        async function create_order(){
            let response = await fetch(window.env.API_URL+"payment",{ 
                method: 'POST', 
                headers: { 
                    'Content-Type':  
                        'application/json;charset=utf-8' ,
                    "Authorization": authorized.token_id,
                }, 
                body: JSON.stringify({price:parseInt(price)*100, "currency": "INR"}) 
            })
            let result = await response.json()
            setOrderId(result["id"])
        }
        create_order(); // eslint-disable-next-line
    }, []);

    const [name, setName] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [address, setAddress] = React.useState("");

    function processed_payment(event){
        event.preventDefault();
        let details = {
            "key": window.env.RAZAOR_KEY, // Enter the Key ID generated from the Dashboard
            "amount": price, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Hack Pizza",
            "description": "Test Transaction",
            "image": "https://hack-pizza.netlify.app/logo.png",
            "order_id": order_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler":async function (response){
                if(response.razorpay_payment_id && response.razorpay_order_id && response.razorpay_signature){
                    response = await fetch(window.env.API_URL+"orders",{ 
                        method: 'POST', 
                        headers: { 
                            'Content-Type':  
                                'application/json;charset=utf-8' ,
                            "Authorization": authorized.token_id,
                        }, 
                        body: JSON.stringify({
                            order_id, razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            item_id: item._id
                        }) 
                    })
                    await response.json();
                    history.replace("/orders");
                }

            },
            "prefill": {
                "name": name,
                "email": email,
                "contact": phone
            },
            "notes": {
                "address": address
            },
            "theme": {
                "color": "#3399cc"
            }
        };

        var payment = new window.Razorpay(details);
        payment.open();

    }
    
    return (
        <div className="row" style={{textAlign:"center"}}>
            <div className="col-6">
                <img src={loc} alt=""/>
                <h2>{item.name}</h2>
                <h3>*No Addons</h3>
                <h1>Total Bill: {price}</h1>
            </div>
            <div className="col-6" style={{textAlign:"left"}}>
                <form style={{width:"350px", margin:"10% auto 0 auto"}} onSubmit={processed_payment}>
                    <div className="form-group">
                        <label htmlFor="username">* User Name</label>
                        <input type="text" className="form-control" id="username" name="username" placeholder="Full Name" autoFocus required onChange={(event)=>setName(event.target.value)}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">* Email</label>
                      <input type="email" className="form-control" id="email" name='email' placeholder="Email" required onChange={(event)=>setEmail(event.target.value)}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">* Contact Number</label>
                      <input type="number" className="form-control" id="phone" name='phone' placeholder="Mobile" required onChange={(event)=>setPhone(event.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">* Address</label>
                        <textarea className="form-control" id="address" name='address' rows="3" placeholder="Delivery Address" onChange={(event)=>setAddress(event.target.value)}/>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">Pay amount</button>
                </form>
            </div>
        </div>
    )
}

function PizzaOrders({authorized, setLoading}){
    const [orders, setOrders] = React.useState([]);
    React.useEffect(()=>{
        setLoading("block")
        async function list_order(){
            let response = await fetch(window.env.API_URL+"orders_list",{ 
                method: 'GET', 
                headers: { 
                    'Content-Type':  
                        'application/json;charset=utf-8' ,
                    "Authorization": authorized.token_id,
                }, 
            })
            let result = await response.json();
            setOrders(result);
        }
        list_order(); 
        setLoading("none"); // eslint-disable-next-line
    }, [authorized]);
    return (
        <div style={{textAlign:"center"}}>
            {
            (orders.length===0)?<h1>Currently No Orders, Available</h1>:
            orders.map((item, index)=>{
                let loc = "/files/"+item.image;
                return(
                <div className="card mt-3" key={index} style={{maxWidth: "700px", margin:"auto", textAlign:"center"}}>
                  <div className="row">
                    <div className="col-md-4">
                      <img src={loc} alt=""/>
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text">{item.desc}</p>
                        <p className="card-text"><small className="text-muted">Amount Paid: </small><b>{item.price}</b></p>
                        <p className="card-text"><small className="text-muted">Status: {item.status}</small></p>
                        <p className="card-text"><small className="text-muted">Order date: {item.ordered_date}</small></p>
                      </div>
                    </div>
                  </div>
                </div>
                )})
            }
        </div>
    )
}

function Userboard({authorized, setLoading}){

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
              <PizzaCheckout pizzas={pizzas} authorized={authorized}/>
            </Route>
        </Switch>
    )
}

export { Userboard , PizzaOrders }