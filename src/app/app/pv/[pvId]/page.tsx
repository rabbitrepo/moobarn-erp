'use client'

import { PDFViewer } from '@react-pdf/renderer';
import PVGenerator from '@/components/PVGenerator'
import { formatPeriod } from '@/lib/formatThaiDate';
import supabase from 'supabase'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'

async function fetchData(pv_id_param: number) {
    try {
        const { data: fetchedData, error } = await supabase
            .rpc('get_pv_details_by_pv_id', {
                pv_id_param
            });

        if (error) {
            console.error(error);
        } else {
            console.log(fetchedData)
            return JSON.stringify(fetchedData)
        }
    } catch (error) {
        console.error('Error calling get_pv_details_by_pv_id:', error.message);
    }
}

const PV = async ({ params }) => {

    const [PVDetails, setPVDetails] = useState(null)

    useEffect(() => {
        const fetchReceiptData = async () => {
            try {
                const data = await fetchData(params.pvId);
                setPVDetails(data);
                console.log(PVDetails)
            } catch (error) {
                console.error('Error fetching receipt data:', error.message);
            }
        };

        fetchReceiptData();
    }, [params.receiptId]);

    return (
        // <div>My Post: {params.receiptId}</div>
        <PDFViewer className='h-screen w-full'>
            <PVGenerator data={PVDetails}/>
        </PDFViewer>

    )
}

export default PV;