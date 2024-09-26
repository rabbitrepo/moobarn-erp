'use client'

// import { EnvelopeIcon, Bellicon, ChartBarIcon, HomeIcon } from "@heroicons/react"
// import { useSelectedLayoutSegment } from "next/navigation"
// import Link from 'next/link'

// function classNames(...classes: string[]) {
//     return classes.filter(Boolean).join(' ')
// }

// export default function Sidebar() {

//     const sideBarOptions = [
//         {
//             name: "Dashboard",
//             href: "/dashboard",
//             icon: HomeIcon,
//             current: true
//         },
//         {
//             name: "Analytics",
//             href: "/dashboard ",
//             icon: ChartBarIcon,
//             current: false
//         },
//     ]

//     return (
//         <div className="">
//             <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
//                 <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4 border-r-2">
//                     <h1 className="text-3xl font-bold">Logo</h1>
//                 </div>
//                 <nav className="flex flex-1 flex-col">
//                     <ul role="list" className="flex flex-1 flex-col gap-y-7">
//                         <li>
//                             <ul role="list" className="mx-2 space-x-1">
//                                 {sideBarOptions.map((option) => (
//                                     <li key={option.name}>
//                                         <Link href={option.href} className={classNames(option.current ? "bg-gray-700 text-white" : "hover:text-white hover:bg-gray-700", "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold")}>
//                                             <option.icon className="text-gray-300 group-hover:text-white h-6 w-6 shrink-0" />
//                                             {option.name}
//                                         </Link>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </li>
//                     </ul>
//                 </nav>
//             </div>
//         </div>
//     )
// }

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
  

export default function Sidebar() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}