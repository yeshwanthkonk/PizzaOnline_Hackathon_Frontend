import React from 'react';

export default function useAuthorize({setUser, setLoading}) {

    const [authorized, setAuthorization] = React.useState({isAuth: false, token_id: null});

    async function Check(){
        let token_id = getToken()
        if(!token_id)
            return
        let response = await fetch(window.env.API_URL+"check_status",{
            headers:{
                "Authorization": token_id,
            }
        })
        if(response["status"]===200)
            setAuthorization({isAuth: true, token_id})
        else if(response["status"] === 403){
            sessionStorage.removeItem("token_id");
            token_id = null;
            setAuthorization({isAuth: false, token_id: null});
        }
        let result = await response.json();
        setUser(result["name"])
    }
    React.useEffect(()=>{
        (async function(){
            await Check()
            setLoading("none");
        })();
        // eslint-disable-next-line
    }, [])

    function getToken () {
        return sessionStorage.getItem('token_id');
    };

  const saveToken = token_id => {
    sessionStorage.setItem('token_id', token_id);
    setAuthorization({isAuth: true, token_id});
  };

  const removeToken = () => {
    sessionStorage.removeItem("token_id");
    setAuthorization({isAuth: false, token_id:null});
  }

  return {
    Authenticate: Check,
    Logout: removeToken,
    saveToken,
    authorized: authorized,
  }
}