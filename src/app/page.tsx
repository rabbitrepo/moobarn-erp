'use client'
import { redirect } from "next/navigation"

// import Login from "@/components/Login"
// import { useUserContext } from "@/components/Context/userContext"

export default function () {

  // const { user } = useUserContext()

  // if (user) {
    redirect('/app')
  // } else {
  //   return (<Login />)
  // }
  
}
