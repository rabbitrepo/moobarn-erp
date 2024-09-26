'use client'

import { PDFViewer } from '@react-pdf/renderer';
import ReceiptGenerator from '@/components/ReceiptGenerator'
import { formatPeriod } from '@/lib/formatThaiDate';
import supabase from 'supabase'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'

async function fetchData(receipt_id_param: number) {
    try {
        const { data: fetchedData, error } = await supabase
            .rpc('get_receipt_details_by_receipt_id', {
                receipt_id_param
            });

        if (error) {
            console.error(error);
        } else {
            console.log(fetchedData)
            return JSON.stringify(fetchedData)
        }
    } catch (error) {
        console.error('Error calling get_receipt_details_by_date_range:', error.message);
    }
}

const Receipt = async ({ params }) => {

    const [receiptDetails, setReceiptDetails] = useState(null)

    useEffect(() => {
        const fetchReceiptData = async () => {
            try {
                const data = await fetchData(params.receiptId);
                setReceiptDetails(data);
            } catch (error) {
                console.error('Error fetching receipt data:', error.message);
            }
        };

        fetchReceiptData();
    }, [params.receiptId]);

    return (
        // <div>My Post: {params.receiptId}</div>
        <PDFViewer className='h-screen w-full'>
            <ReceiptGenerator data={receiptDetails} />
        </PDFViewer>

    )
}

export default Receipt;