'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUserContext } from "./Context/userContext"
import { Loader2, Terminal, MessageSquare, Mail } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Login() {

    const { login, email, handleEmailChange } = useUserContext()

    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        setLoading(true);
        await login();
        setLoading(false);
    }

    return (
        <>
            <div className="flex justify-center items-center h-screen">
                <Card className="w-[350px]">
                    {/* <CardHeader>
                </CardHeader> */}
                    <CardContent className="pt-6">
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">E-mail</Label>
                                    <Input id="email" placeholder="กรุณากรอก E-mail ของคุณ" value={email} onChange={handleEmailChange} />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        {loading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                กำลังโหลด
                            </Button>
                        ) : (
                            <Button onClick={handleLogin}>เข้าสู่ระบบ</Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
            {/* <Alert className="fixed bottom-0 right-0 w-auto p-6 m-8">
                <AlertTitle className="pb-2">
                    <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <p>กรุณาตรวจสอบ E-mail ของคุณ</p>
                    </div>
                </AlertTitle>
                <AlertDescription>
                    ระบบได้ส่ง E-mail ไปที่ E-mail ของคุณ กรุณากด "Log In" เพื่อเข้าสู่ระบบ
                </AlertDescription>
            </Alert> */}
        </>

    )
}