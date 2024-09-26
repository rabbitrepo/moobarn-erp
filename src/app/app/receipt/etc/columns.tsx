"use client"

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, ArrowUpDown, MoreVertical, X } from "lucide-react"
import supabase from "supabase";
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
import { useRouter } from 'next/navigation'

async function handleVoid(gl_id: number) {
    try {
        const { data, error } = await supabase
            .from('General_Ledger')
            .update({ void: true })
            .eq('gl_id', gl_id)

        if (error) {
            console.error('Error calling function:', error);
            alert(JSON.stringify(error))
        } else {
            console.log('Function result:', data);
            alert("ยกเลิก สำเร็จ ✅")
            window.location.reload()
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        alert(JSON.stringify(error))
    }
}

async function handlePrint(receipt_id, router) {
    router.push(`/app/receipt/etc/${receipt_id}`)
}

export const columns = [
    {
        accessorKey: "receipt_id",
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
        id: "print",
        cell: ({ row }) => {
            const router = useRouter()

            return (
                <Button variant="secondary" onClick={() => 
                    // handlePrint(parseInt(row.original.receipt_id.replace(/^RC/, ''), 10), router)
                    alert(`โปรดนำเลขที่ ${row.original.receipt_id} ไปปริ้นใน MS Access 🖨️`)
                }>
                    <Printer className="mr-2" /> Print
                </Button>
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
                                onClick={() => handleVoid(row.original.gl_id)}
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