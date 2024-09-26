'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import supabase from 'supabase';

const UserContext = createContext(null);

export function useUserContext() {
    return useContext(UserContext);
};

export function UserProvider({ children }) {

    const [email, setEmail] = useState("")

    const handleEmailChange = (event: any) => {
        setEmail(event.target.value);
    }

    // [ ] mock user!
    const [user, setUser] = useState(false)

    async function checkAuth() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function login() {
        if (!email) alert("กรุณากรอก e-mail ที่ถูกต้อง")
        if (email) {
            try {
                let { data, error } = await supabase.auth.signInWithOtp({
                    email,
                    options: {
                        shouldCreateUser: false
                    }
                })

                if (error) {
                    alert(error)
                } else {
                    alert('กรุณากด Confirm ใน E-mail ของคุณ')
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        checkAuth();
        console.log(user)
    }, []);

    return (
        <UserContext.Provider value={{ user, login, email, setEmail, handleEmailChange }}>
            {children}
        </UserContext.Provider>
    )
}