import Link from 'next/link'
import {
    Banknote,
    LayoutDashboard,
    CircleDollarSign,
    Download,
    Upload,
    Book,
    Home,
    Scroll,
    Users,
    HelpCircle
} from 'lucide-react';
import UserDropdown from '@/components/UserDropdown';
import Image from 'next/image'
import Kunalai_Logo from "public/kunalai_logo.jpg"

export default function Sidebar() {
    return (
        <div className="flex">

            <aside
                id="sidebar-multi-level-sidebar"
                className="sticky top-0 left-0 z-40 w-64 h-screen"
                aria-label="Sidebar"
            >
                <div className="h-screen px-3 py-4 overflow-y-auto bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 space-y-4">

                    <Link
                        href="/app/"
                        className="group"
                    >
                        <Image
                            src={Kunalai_Logo}
                            alt="Kunalai Logo"
                            // width={500} automatically provided
                            // height={500} automatically provided
                            // blurDataURL="data:..." automatically provided
                            placeholder="blur" // Optional blur-up while loading
                        />
                    </Link>

                    <UserDropdown />

                    {/* Sidebar items */}
                    <ul className="space-y-2 font-medium pt-4 flex flex-col">
                        {/* <li>
                            <Link
                                href="/app"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                            >
                                <LayoutDashboard />
                                <span className="ml-3">หน้าแรก</span>
                            </Link>
                        </li> */}
                        <li>
                            <p className='text-sm text-muted-foreground'>รายรับ</p>
                        </li>
                        <li>
                            <Link
                                href="/app/receipt/fees"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                            >
                                <Banknote />
                                <span className="ml-3">ค่าส่วนกลาง</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/app/receipt/installment"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                            >
                                <Banknote />
                                <span className="ml-3">ค่าส่วนกลาง (ผ่อน)</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/app/receipt/etc"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                            >
                                <CircleDollarSign />
                                <span className="ml-3">รายได้อื่นๆ</span>
                            </Link>
                        </li>
                        <li>
                            <p className='text-sm text-muted-foreground'>รายจ่าย</p>
                        </li>
                        <li>
                            <Link
                                href="/app/pv"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                            >
                                <Upload />
                                <span className="ml-3">ใบสำคัญจ่าย</span>
                            </Link>
                        </li>
                        {/* <li>
                            <p className='text-sm text-muted-foreground'>บัญชี</p>
                        </li>
                        <li>
                            <Link
                                href="/app"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                            >
                                <Book />
                                <span className="ml-3">รายรับ - รายจ่าย</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/app/ledger/general"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                            >
                                <Book />
                                <span className="ml-3">สมุดรายวันทั่วไป</span>
                            </Link>
                        </li> */}
                        {/* <li>
                            <Link
                                href="/app/ledger/receive"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                            >
                                <Book />
                                <span className="ml-3">สมุดรายวันรับ</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/app/ledger/pay"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                            >
                                <Book />
                                <span className="ml-3">สมุดรายวันจ่าย</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/app/ledger/accounts"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                            >
                                <Book />
                                <span className="ml-3">สมุดบัญชีแยกประเภท</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/app/statement"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                            >
                                <Scroll />
                                <span className="ml-3">งบการเงิน</span>
                            </Link>
                        </li> */}
                        <li>
                            <p className='text-sm text-muted-foreground'>ข้อมูล</p>
                        </li>
                        {/* <li>
                            <Link
                                href="/app"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                            >
                                <Users />
                                <span className="ml-3">ลูกหนี้</span>
                            </Link>
                        </li> */}
                        <li>
                            <Link
                                href="/app/block"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                            >
                                <Home />
                                <span className="ml-3">แปลงที่ดิน</span>
                            </Link>
                        </li>
                        <li className="fixed bottom-4 left-4">
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSc7HTc5zaO2ABM28RkhhwUb6SxT-MF1i8igmZ3fzPM5qXRFqA/viewform"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group w-full"
                            >
                                <HelpCircle />
                                <span className="ml-3">กรณีพิเศษ</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    );
};