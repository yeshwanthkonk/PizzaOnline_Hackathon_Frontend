import React from 'react';

export default function useAuthorize({setUser, setLoading, role}) {

    function getToken () {
        return sessionStorage.getItem(`${role}_token_id`);
    };

    const [authorized, setAuthorization] = React.useState({isAuth: false, token_id: getToken()});

    async function Check(){
        
        let token_id = getToken()
        if(!token_id){
            setAuthorization({isAuth: false, token_id: null})
            return
        }
        try{
            setLoading("block")
            let response = await fetch(window.env.API_URL+"check_status",{
                headers:{
                    "Authorization": token_id,
                }
            })
            if(response["status"]===200)
                setAuthorization({isAuth: true, token_id})
            else if(response["status"] === 403){
                sessionStorage.removeItem(`${role}_token_id`);
                token_id = null;
                setAuthorization({isAuth: false, token_id: null});
            }
            await response.json();
            setLoading("none")
        }
        catch(err){
            console.log(err);
            setLoading("none")
        }
    }
    React.useEffect(()=>{
        (async function(){
            await Check();
        })();
        // eslint-disable-next-line
    }, [role]);

  const saveToken = token_id => {
    sessionStorage.setItem(`${role}_token_id`, token_id);
    setAuthorization({isAuth: true, token_id});
  };

  const removeToken = () => {
    sessionStorage.removeItem(`${role}_token_id`);
    setAuthorization({isAuth: false, token_id:null});
  }

  return {
    Authenticate: Check,
    Logout: removeToken,
    saveToken,
    authorized: authorized,
  }
}