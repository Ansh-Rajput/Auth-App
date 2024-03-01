"use client";
import { logOut } from "@/actions/logOut";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
// import { useSession,signOut } from "next-auth/react";  //for client side session and logOut 

const SettingsPage = () => {
  const user = useCurrentUser();

  const onClick = ()=>logOut();

  return (
    <div className="bg-white p-10 rounded-xl">
      {JSON.stringify(user)}
        <Button type="submit" onClick={onClick}>
          Sign Out
        </Button>
    </div>
  )
}

export default SettingsPage
