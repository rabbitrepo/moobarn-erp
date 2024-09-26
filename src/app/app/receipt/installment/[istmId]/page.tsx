'use client'

import { PDFViewer } from '@react-pdf/renderer';
import ReceiptInstallmentGenerator from '@/components/ReceiptInstallmentGenerator'
import { formatPeriod } from '@/lib/formatThaiDate';
import supabase from 'supabase'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

async function fetchData(istm_id_param: number, receiptId: number) {
    try {
        const { data: fetchedData, error } = await supabase
            .rpc('get_installment_payments_by_istm_id', {
                istm_id_param
            });

        if (error) {
            console.error(error);
        } else {
            console.log(fetchedData)

            const filteredFetchedData = {
                ...fetchedData, // Copy the original data
                Installment_Payment: fetchedData.Installment_Payment.filter(
                    (payment) => payment.receipt_id === receiptId
                ),
            };

            return filteredFetchedData
        }
    } catch (error) {
        console.error('Error calling get_receipt_details_by_date_range:', error.message);
    }
}

const Receipt = async ({ params }) => {
    const { istmId } = params
    const searchParams = useSearchParams()
    const receiptId = searchParams.get('receiptId')

    const [receiptDetails, setReceiptDetails] = useState(null)

    useEffect(() => {
        const fetchReceiptData = async () => {
            try {
                const data = await fetchData(istmId, Number(receiptId));
                setReceiptDetails(data);
            } catch (error) {
                console.error('Error fetching receipt data:', error.message);
            }
        };

        fetchReceiptData();
    }, [params.receiptId]);

    return (
        // <div>
        //     {JSON.stringify(receiptDetails)}
        // </div>
        <PDFViewer className='h-screen w-full'>
            <ReceiptInstallmentGenerator data={JSON.stringify(receiptDetails)}/>
        </PDFViewer>

    )
}

export default Receipt;