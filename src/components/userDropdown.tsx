'use client'

import { LogOut, } from "lucide-react"
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { useUserContext } from "./Context/userContext"
import supabase from "supabase"

export default function UserDropdown() {

    const { user } = useUserContext()

    function getFirstLetter(email) {
        // Check if the email is provided
        if (!email || typeof email !== 'string') {
            return 'Invalid email';
        }

        // Extract the first two letters and capitalize them
        const firstTwoLetters = email.slice(0, 1).toUpperCase();

        return firstTwoLetters;
    }

    function removeEmailDomain(email) {
        // Check if the email is provided and contains '@'
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return 'Invalid email';
        }

        // Split the email address at '@' and take the part before '@'
        const parts = email.split('@');
        const username = parts[0];

        return username;
    }

    const { email } = user
    const emailWithoutDomain = removeEmailDomain(email)
    const fallback = getFirstLetter(email)

    async function logout() {
        try {
            let { error } = await supabase.auth.signOut()
            alert('ออกจากระบบ สำเร็จ')
        } catch (error) {
            console.log(error)
        }
    }

    async function handleLogout() {
        await logout()
        location.reload()
    }

    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                {/* <div className="flex justify-start items-start"> */}
                    <Button variant="ghost" className="p-8 w-full hover:bg-gray-300 dark:hover:bg-gray-700 group border border-gray-300 dark:border-gray-600">
                        <div className="flex justify-center items-center">
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-slate-300 dark:bg-slate-600">{fallback}</AvatarFallback>
                            </Avatar>
                            <p className="px-2 dark:text-slate-200" >{emailWithoutDomain}</p>
                            <ChevronDownIcon />
                        </div>
                    </Button>
                {/* </div> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> ออกจากระบบ
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}