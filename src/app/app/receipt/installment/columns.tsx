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

async function getGlId(receipt_id: number) {
    try {
        const { data, error } = await supabase
            .rpc('get_gl_id_by_receipt_id', {
                p_receipt_id: receipt_id
            })
        if (error) {
            console.error('Error calling function:', error);

        } else {
            console.log('Function result:', data);
            return data.gl_id
        }
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

async function handleVoid(receipt_id: number) {

    const gl_id = await getGlId(receipt_id)
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

async function handlePrint(istm_id, receipt_id, router) {
    router.push(`/app/receipt/installment/${istm_id}?receiptId=${receipt_id}`)
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
        },
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
        accessorKey: "note",
        header: "คำอธิบาย",
    },
    {
        accessorKey: "address",
        header: "บ้านเลขที่",
    },
    {
        accessorKey: "block_id",
        header: "แปลงที่ดิน",
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
                    // handlePrint(row.original.istm_id ,parseInt(row.original.receipt_id.replace(/^RC/, ''), 10), router)
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
                                    onClick={() =>
                                        handleVoid(parseInt(row.original.receipt_id.replace(/^RC/, ''), 10))
                                    }
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
