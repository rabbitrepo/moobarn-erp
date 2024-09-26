'use client'

import { Inter } from 'next/font/google'
import 'src/app/globals.css'
const inter = Inter({ subsets: ['latin'] })
import { useUserContext } from "@/components/Context/userContext"
import Login from '@/components/Login'
import Sidebar from '@/components/Sidebar'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {

  const { user } = useUserContext()

  if (user) {
    return (
      <div className='flex w-screen'>
        <Sidebar />
        <div className='w-full h-full'>
          {children}
        </div>
      </div>
    )
  } else {
    return (<Login />)
  }
}