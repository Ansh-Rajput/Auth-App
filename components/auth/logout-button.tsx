"use client";

import { logOut } from "@/actions/logOut";

interface LogoutButtonProps{
    children:React.ReactNode;
};

export const LogOutButton = ({children}:LogoutButtonProps)=>{
    const onClick = () => logOut();

    return (
        <span className="cursor-pointer" onClick={onClick}>
            {children}
        </span>
    )
}

