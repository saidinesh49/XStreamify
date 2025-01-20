import React, { Children, createContext, useContext, useState } from 'react';

const UserContext=createContext();

export function UserContextProvider({children}){
    const [userData, setUserData]=useState(null);

    const removeUserData=()=>{
        setUserData(null);
    }

    const addUserData=({fullName="",username="",...props})=>{
        try {
            if(!fullName || !username){
                console.log("fullName and username is needed");
            }
            setUserData({
                fullName,
                username,
                ...props
            });
        } catch (error) {
            console.log("Error: ",error);
        }
    }

    return (
        <UserContext.Provider value={{userData, removeUserData, addUserData}}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext(){
    return useContext(UserContext);
};