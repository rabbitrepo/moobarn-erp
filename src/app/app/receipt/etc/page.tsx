"use client"

import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import supabase from "supabase"
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { Search } from "lucide-react"
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

export default function GeneralLedger() {

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

  // TODO: get only General_Ledger.gl_id that related to Journal_Entry.account_id starts with 400 but is not 400101 (รายได้ค่าส่วนกลาง)
  async function fetchData(date_range) {
    const { data: fetchedData, error } = await supabase.rpc('get_receipt_etc_by_date_range', {
      date_range
    });
    if (error) {
      console.error('Error calling get_receipt_etc_by_date_range:', error);
      alert(error)
    } else {
      const formattedFetchedData = fetchedData ? fetchedData.map((gl) => {
        const { gl_id, receipt_id, date, description, amount } = gl
        const formattedRCId = `RC${receipt_id}`
        return {
          gl_id,
          receipt_id: formattedRCId,
          date: convertToThaiDate(date),
          description,
          amount,
          void: gl.void
        }
      }) : []
      const formattedSortedFetchedData = formattedFetchedData.sort((a, b) => {
        // Assuming gl_id is a string with the "GL" prefix
        const glIdA = parseInt(a.receipt_id.substring(2));
        const glIdB = parseInt(b.receipt_id.substring(2));

        return glIdB - glIdA;
      });
      setData(formattedSortedFetchedData)

    }
  }

  // fetch data on initial page load
  useEffect(() => {
    fetchData(date)
  }, [])

  return (
    <div className="flex flex-col p-36 ">
      <h1 className="text-4xl font-bold">ใบเสร็จ - รายได้อื่นๆ</h1>
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
        <Link href="/app/receipt/etc/create">
          <Button> <Plus className="mr-2 h-4 w-4" /> ออกใบเสร็จ </Button>
        </Link>

      </div>

      <DataTable columns={columns} data={data} />
    </div>
  )
}