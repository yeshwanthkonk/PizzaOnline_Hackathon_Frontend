import React from 'react';

export default function useAuthorize({setUser, setLoading, role, download, setDownloadCount}) {

    function getToken () {
        return sessionStorage.getItem(`${role}_token_id`);
    };

    const [authorized, setAuthorization] = React.useState({isAuth: false, token_id: getToken()});

    async function Check(){
        setLoading("block");
        setDownloadCount(++download);
        let token_id = getToken()
        if(!token_id){
            setAuthorization({isAuth: false, token_id: null})
            setDownloadCount(--download);
            if(!download)
                setLoading("none");
            return
        }
        try{
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
            let result = await response.json();
            setUser(result["name"]);
        }
        catch(err){
            console.log(err);
        }
        if(!download)
            setLoading("none");
    }
    React.useEffect(()=>{
        (async function(){
            await Check()
            setLoading("none");
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