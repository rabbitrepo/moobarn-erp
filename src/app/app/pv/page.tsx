'use client'

import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import supabase from "supabase"
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { Search } from "lucide-react"
import { startOfMonth, endOfMonth } from "date-fns";

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
        const { data: fetchedData, error } = await supabase.rpc('get_payment_voucher_details', {
            date_range
        });
        if (error) {
            console.error('Error calling get_payment_voucher_details:', error);
            alert(error)
        } else {
            const formattedFetchedData = fetchedData ? fetchedData.map((pv) => {
                const { pv_id, date, amount, gl_id } = pv
                const formattedPvId = `PV${pv_id}`

                return {
                    pv_id: formattedPvId,
                    date: convertToThaiDate(date),
                    amount,
                    gl_id,
                    void: pv.void
                }
            }) : []
            const formattedSortedFetchedData = formattedFetchedData.sort((a, b) => {
                // Assuming gl_id is a string with the "GL" prefix
                const pvIdA = parseInt(a.pv_id.substring(2));
                const pvIdB = parseInt(b.pv_id.substring(2));

                return pvIdB - pvIdA;
            });

            setData(formattedSortedFetchedData)
        }
    }

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

    // initial page load
    useEffect(() => {
        fetchData(date)
    }, [])

    return (
        <div className="flex flex-col p-36 ">
            <h1 className="text-4xl font-bold">ใบสำคัญจ่าย</h1>
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
                <Link href="/app/pv/create">
                    <Button> <Plus className="mr-2 h-4 w-4" /> ออกใบสำคัญจ่าย </Button>
                </Link>

            </div>

            <DataTable columns={columns} data={data} />
        </div>
    )
}