"use client"

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, ArrowUpDown, MoreVertical, X } from "lucide-react"
import supabase from "supabase";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

async function handleVoid(gl_id: number) {
    try {
        const { data, error } = await supabase
            .from('General_Ledger')
            .update({ void: true })
            .eq('gl_id', gl_id)

        if (error) {
            console.error('Error calling function:', error);
            alert(error)
        } else {
            console.log('Function result:', data);
            alert("ยกเลิก สำเร็จ ✅")
            window.location.reload()
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        alert(error)
    }
}

export const columns = [
    {
        accessorKey: "gl_id",
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => {
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }}
                >
                    เลขที่
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        }
    },
    {
        accessorKey: "void",
        header: "ยกเลิก",
        cell: ({ row }) => {
            return (
                (row.original.void ? <Badge variant="destructive">ยกเลิก</Badge> : <></>)
            )
        }
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => {
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }}
                >
                    วันที่
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        }
    },
    {
        accessorKey: "description",
        header: "คำอธิบาย",
    },
    {
        accessorKey: "amount",
        header: "จำนวน​ (บาท)",
    },
    {
        accessorKey: "pv_id",
        header: "PV",
        cell: ({ row }) => {
            return (
                row.original.pv_id ? `PV${row.original.pv_id}` : null
            )
        }
    },
    {
        accessorKey: "receipt_id",
        header: "RC",
        cell: ({ row }) => {
            return (
                row.original.receipt_id ? `RC${row.original.receipt_id}` : null
            )
        }
    },
    {
        id: "void",
        cell: ({ row }) => {
            return (
                (row.original.void ? <></> :
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button variant="destructive" size="sm">
                                <X className="mr-2 h-4 w-4" /> ยกเลิก
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>ยืนยันการยกเลิกรายการ</AlertDialogTitle>
                                <AlertDialogDescription>
                                    โปรดเช็ครายละเอียด เมื่อยกเลิกรายการแล้วจะไม่สามารถย้อนกลับได้
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>กลับ</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-500 hover:bg-red-700"
                                    onClick={() => handleVoid(parseInt(row.original.gl_id.replace(/^GL/, ''), 10))}
                                >
                                    ยินยัน
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )
            )
        }
    }
];
