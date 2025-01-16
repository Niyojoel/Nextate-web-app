import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import apiRequest from "../lib/apiRequest";


const AppContext = createContext();

export const AppProvider = ({children})=> {
    const [expand, setExpand] = useState(false);

    //DATA
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")) || null);

    //Form filling and processing  
    const [isLoading, setIsLoading] = useState(false);
    const [changeMade, setChangeMade] = useState(false);
    const [message, setMessage] = useState({ content: " ", type: " "}); 
    const [passMatch, setPassMatch] = useState(' ');
    
    //images uploads states
    const [avatar, setAvatar] = useState(user?.avatar || null);
    const [imgPrev, setImgPrev] = useState([]);
    const [images, setImages] = useState([]);
    
    //Chat and Messaging
    const [initMessage, setInitMessage] = useState({ state: null, chatId: null, receiver: null});

    //Paths
    const [path, setPath] = useState('')
    
    const getPath = (path) => {
        setPath(path)
    }
    
    const showAlert = (content=" ", type=" ", time= 2000, pass=" ") => {
        setPassMatch(pass);
        setMessage({content, type, time});
    };

    const updateLoading = (arg=false) => {
       setIsLoading(arg)
    };

    //for imgs files preview and upload  
    const handleReadFile = (files)=> {
        console.log(path, files)
    if(path === "update") {
        return setAvatar(files[0])
    }
    return setImgPrev(files.slice(0, 4));
    } 
    //----------------------------------------
  
    // API communication
    const handleSubmit = async (e, endPoint, method)=> {
        e?.preventDefault();
        setIsLoading(true);
        
        console.log(e)
        const formData = new FormData(e.target);
        let inputs;
        inputs = Object.fromEntries(formData);
        
        console.log({...inputs})

        if(inputs.password && inputs.confirmPassword && inputs.password !== inputs.confirmPassword) {
            showAlert("Passwords does not match", 'fail');
            return setPassMatch("fail");
        }

        try {
            let res;
            if(method === "post") res = apiRequest.post(endPoint, {
                ...inputs,
                ...(imgPrev && {images:imgPrev}),

            });
            if(method === "patch") res = apiRequest.patch(endPoint, {
                ...inputs,
                ...(endPoint.includes("users") ? {avatar} : {images: imgPrev})
            });
            if(method === "put") res = apiRequest.put(endPoint, {
                ...inputs,
                ...(imgPrev && {images: imgPrev})
            });
            if(method === "delete") res = apiRequest.delete(endPoint);
            return res;
        } catch(err) {
            console.log(err)
            return showAlert(err.message.data.response,'failed');
        }
    }   
    //---------------------------------
    
    const updateUser = (data)=> {
        return setUser(data);
    }

    useEffect(()=> {
        sessionStorage.setItem("user", JSON.stringify(user))
    }, [user])
    
    useEffect(()=> {
        images.length > 0 && handleReadFile(images);
    }, [images])

    useEffect(()=>{
        setImages([]);
    }, [path])

    useEffect(()=> {
        const showTimer = setTimeout(()=> {
        showAlert();
        }, message.time)
        return ()=> clearTimeout(showTimer);
    },[message]);

    return <AppContext.Provider value={{expand, setExpand, user, isLoading, setIsLoading, message, showAlert, passMatch, setPassMatch, handleSubmit, updateUser, images, setImages, updateLoading, changeMade, setChangeMade, handleReadFile, imgPrev, setImgPrev, avatar, setInitMessage, initMessage, getPath, path}}> {children} </AppContext.Provider>
}

export const useGlobalContext = ()=> {
    return useContext(AppContext);
};

