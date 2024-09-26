import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
} from "lucide-react"

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
import { ChevronDownIcon, HomeIcon } from '@radix-ui/react-icons'
import { Separator } from "@/components/ui/separator"
import ModeToggle from '@/components/ToggleMode'
import { CircleDollarSign } from "lucide-react"
import User_Dropdown from "../UserDropdown"
import Link from "next/link"

export default function DropdownMenuDemo() {
    return (
        <div className="flex flex-col">
            <User_Dropdown />

            <Link href="/dashboard">
                <Button variant="ghost" className="w-full">
                    <div>
                        <p className="px-2">หน้าแรก</p>
                    </div>
                </Button>
            </Link>

            <p className="text-sm text-muted-foreground">
                ใบเสร็จ
            </p>
            <Link href="/dashboard/revcf">
                <Button variant="ghost" className="w-full">
                    <div>
                        <p className="px-2">รายได้ค่าส่วนกลาง</p>
                    </div>
                </Button>
            </Link>

            <Link href="/dashboard/revetc">
                <Button variant="ghost" className="w-full">
                    <div>
                        <p className="px-2">รายได้อื่นๆ</p>
                    </div>
                </Button>
            </Link>

            <p className="text-sm text-muted-foreground">
                ใบสำคัญ
            </p>
            <Link href="/dashboard/rv">
                <Button variant="ghost" className="w-full">
                    <div>
                        <p className="px-2">ใบสำคัญรับ</p>
                    </div>
                </Button>
            </Link>

            <Link href="/dashboard/pv">
                <Button variant="ghost" className="w-full">
                    <div>
                        <p className="px-2">ใบสำคัญจ่าย</p>
                    </div>
                </Button>
            </Link>
        </div>
    )
}