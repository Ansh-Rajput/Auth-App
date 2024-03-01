"use client";

import { FaUser } from "react-icons/fa";
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar,AvatarFallback,AvatarImage } from "@radix-ui/react-avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogOutButton } from "./logout-button";
import { ExitIcon } from "@radix-ui/react-icons";

export const UserButton = () => {
    const user = useCurrentUser();
    return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={user?.image || undefined} />
              <AvatarFallback className="bg-white">
                <FaUser className="text-sky-500" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="end">
            <LogOutButton>
              <DropdownMenuItem>
                <ExitIcon className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </LogOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    };