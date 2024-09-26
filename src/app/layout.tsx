'use client'

import { Inter, Kanit } from 'next/font/google'
import 'src/app/globals.css'
import { ThemeProvider } from "@/components/Context/themeProvider"
const inter = Inter({ subsets: ['latin'] })
const kanit = Kanit({ subsets: ['thai'], weight: "400" })
import { UserProvider } from "@/components/Context/userContext"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={kanit.className}>
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  )
}
