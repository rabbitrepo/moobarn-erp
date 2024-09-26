'use client'

import { DataTable } from "./data-table"
import { columns } from "./columns"
import { data as testData } from "./data"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { Search } from "lucide-react"
import supabase from "supabase"
import { startOfMonth, endOfMonth } from "date-fns";

function convertToThaiDate(dateString) {
    // Convert the input date string to a JavaScript Date object
    const dateObj = new Date(dateString);

    // Array of Thai month names

    const thaiMonths = [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];

    // Extract day, month, and year
    const day = dateObj.getDate();
    const month = thaiMonths[dateObj.getMonth()];
    const year = dateObj.getFullYear() + 543 - 2500; // Convert to Thai Buddhist calendar year

    // Format the date in the Thai format
    const thaiDate = `${day} ${month} ${year}`;

    return thaiDate;
}

export default function () {

    const handleDateChange = (newDate: DateRange | undefined) => {
        setDate(newDate);
    }

    const [date, setDate] = useState<{
        from: Date;
        to?: Date;
    }>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date())
    });

    const [data, setData] = useState([])

    async function fetchData(date_range) {
        try {
            const { data: fetchedData, error } = await supabase
                .rpc('get_receipt_details_by_date_range', {
                    date_range
                });

            if (error) {
                console.error(error);
            } else {
                const formattedFetchedData = fetchedData ? fetchedData.map((receipt) => {

                    const { receipt_id, date, amount, address, block_id } = receipt

                    const formattedReceiptId = `RC${receipt_id}`

                    let checkedBlockId = ""
                    address !== "-" ? checkedBlockId = "-" : checkedBlockId = block_id

                    return {
                        receipt_id: formattedReceiptId,
                        date: convertToThaiDate(date),
                        amount,
                        void: receipt.void,
                        address,
                        block_id: checkedBlockId
                    }
                }) : []
                console.log("after format:", formattedFetchedData)
                // const formattedSortedFetchedData = formattedFetchedData.sort((a, b) => b.pv_id - a.pv_id)

                const formattedSortedFetchedData = formattedFetchedData.sort((a, b) => {
                    // Assuming gl_id is a string with the "GL" prefix
                    const receiptIdA = parseInt(a.receipt_id.substring(2));
                    const receiptIdB = parseInt(b.receipt_id.substring(2));

                    return receiptIdB - receiptIdA
                });
                console.log("after sort:", formattedFetchedData)

                setData(formattedSortedFetchedData)

            }
        } catch (error) {
            console.error('Error calling get_receipt_details_by_date_range:', error.message);
        }
    }

    // initial page load
    useEffect(() => {
        fetchData(date)
    }, [])

    return (
        <div className="flex flex-col p-36 ">
            <h1 className="text-4xl font-bold">ใบเสร็จ - รายได้ค่าส่วนกลาง</h1>
            <div className="flex items-center justify-between py-4">
                <div className="flex space-x-2">
                    <DatePickerWithRange
                        date={date}
                        onDateChange={handleDateChange}
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fetchData(date)}
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
                <Link href="/app/receipt/fees/create">
                    <Button> <Plus className="mr-2 h-4 w-4" /> เช็คค่าส่วนกลาง / ออกใบเสร็จ</Button>
                </Link>

            </div>

            <DataTable columns={columns} data={data} />
        </div>
    )
}