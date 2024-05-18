import React, { useEffect } from "react";
import { createContext, useReducer } from "react";
import Auth_reducer from "./Auth_reducer";

const INITIAL_STATE = {
  currentUser: JSON.parse(localStorage.getItem("user"))||null, 
};

export const Authencation = createContext(INITIAL_STATE);

export const AuthencationProvider = ({children}) => 
{
    const [state, dispatch] = useReducer(Auth_reducer,INITIAL_STATE);

    useEffect(()=>{
        localStorage.setItem("user",JSON.stringify(state.currentUser));
    },[state.currentUser])

    return(
        <Authencation.Provider value = {{currentUser : state.currentUser,dispatch}}>
            {children}
        </Authencation.Provider>
    );
};
