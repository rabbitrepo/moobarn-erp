'use client'

import { useForm, useFieldArray, Controller, watch } from 'react-hook-form';
import { z, ZodError } from 'zod';
import { useState, useEffect } from 'react';

import supabase from 'supabase';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { Plus, Minus } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from 'next/navigation'

const paymentVoucherSchema = z.object({
    pv_id: z.string(),
    date: z.string(),
    description: z.string(),
    debitEntries: z.array(
        z.object({
            DrCr: z.literal('Dr'),
            AccountId: z.string(),
            Amount: z.number().refine(value => value > 0, {
                message: 'Amount must be greater than 0.',
            }),
        })
    ),
    creditEntries: z.array(
        z.object({
            DrCr: z.literal('Cr'),
            AccountId: z.string(),
            Amount: z.number().refine(value => value > 0, {
                message: 'Amount must be greater than 0.',
            }),
        })
    ),
}).refine(data => {
    // Calculate the sum of amounts for debitEntries
    const debitSum = data.debitEntries.reduce((sum, entry) => sum + parseFloat(entry.Amount), 0);
    console.log(debitSum);
    // Calculate the sum of amounts for creditEntries
    const creditSum = data.creditEntries.reduce((sum, entry) => sum + parseFloat(entry.Amount), 0);
    console.log(creditSum);
    // Check if the sums are equal
    if (debitSum !== creditSum) {
        throw new Error('Debit and credit sums must be equal.');
    }

    return true;
}, {
    message: 'Debit and credit sums must be equal.',
});

type PaymentVoucherFormData = z.infer<typeof paymentVoucherSchema>;

export default function CreateGeneralLedger() {

    const router = useRouter()

    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const [optionsDrAccounts, setOptionsDrAccounts] = useState<string[]>([])
    const [optionsCrAccounts, setOptionsCrAccounts] = useState<string[]>([])

    useEffect(() => {
        async function fetchOptions() {
            const { data: accounts, error } = await supabase
                .from('Chart_Of_Accounts')
                .select('account_id, account_name')

            const formattedAccounts = [''].concat(
                accounts.map((account) => `(${account.account_id}) ${account.account_name}`)
            )

            setOptionsDrAccounts(formattedAccounts)
            setOptionsCrAccounts(formattedAccounts)
            if (error) {
                console.error('Error fetching data:', error.message)
                return
            }
        }

        fetchOptions()
    }, [])

    function getContentInParentheses(str) {
        const match = str.match(/\((.*?)\)/);
        return match ? match[1] : null;
    }

    const {
        control,
        handleSubmit,
        register,
        setValue,
        getValues,
        watch,
    } = useForm({
        defaultValues: {
            pv_id: "",
            date: "",
            description: "",
            debitEntries: [{ DrCr: 'Dr', Amount: 0 }],
            creditEntries: [{ DrCr: 'Cr', Amount: 0 }],
        },
    });

    const {
        fields: debitFields,
        append: debitAppend,
        remove: debitRemove,
    } = useFieldArray({
        control,
        name: 'debitEntries',
    });

    const {
        fields: creditFields,
        append: creditAppend,
        remove: creditRemove,
    } = useFieldArray({
        control,
        name: 'creditEntries',
    });

    function transformJson(Json) {

        const transformedData = [
            ...Json.debitEntries.map(entry => ({
                account_id: entry.AccountId,
                debit_amount: parseFloat(entry.Amount),  // Parse the Amount as a float
            })),
            ...Json.creditEntries.map(entry => ({
                account_id: entry.AccountId,
                credit_amount: parseFloat(entry.Amount),  // Parse the Amount as a float
            })),
        ];

        return transformedData;
    }
    const formatDate = (date) => {
        const isoDate = new Date(date).toISOString();
        return isoDate.substring(0, 10); // Extracting YYYY-MM-DD from the ISO string
    };

    const onSubmit = async (data: PaymentVoucherFormData) => {
        try {
            setErrorMessage(null);

            // Convert Amount values to numbers
            const numericData = {
                ...data,
                debitEntries: data.debitEntries.map(entry => ({
                    ...entry,
                    Amount: parseFloat(entry.Amount),
                })),
                creditEntries: data.creditEntries.map(entry => ({
                    ...entry,
                    Amount: parseFloat(entry.Amount),
                })),
            };

            paymentVoucherSchema.parse(numericData);

            // Rest of your code remains unchanged
            const { date, description } = numericData;
            const result = {
                date: formatDate(date),
                entries: transformJson(numericData),
                description,
            };

            console.log('result:', result);

            // create_general_ledger
            const { data: rpcData, error: rpcError } = await supabase.rpc('create_general_ledger', {
                date: result.date,
                entries: result.entries,
                description: result.description,
                reference: {}
            });

            if (rpcError) {
                console.error('Error calling create_general_ledger:', rpcError);
                alert('❌ เพิ่มรายการไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
            } else {
                console.log('create_general_ledger result:', rpcData);
                alert('✅ สำเร็จ')
                router.push('/app/ledger/general')
            }

        } catch (error) {
            if (error instanceof ZodError) {
                // Display each error message to the user
                const errorMessages = error.errors.map(err => err.message);
                setErrorMessage(errorMessages.join('\n'));
                console.error('Zod Validation Error:', error.errors);
            } else {
                setErrorMessage('Debit and credit sums must be equal.');
                console.error('Error:', error.message);
            }
        }
    };

    return (

        <form onSubmit={handleSubmit(onSubmit)}>

            <Card className="m-12">
                <CardHeader className='p-12'>
                    <h1 className="text-2xl font-semibold">
                        เพิ่มรายการ สมุดรายวันทั่วไป
                    </h1>
                    <div className='flex flex-col pt-2 space-y-4'>
                        <div className='flex items-center pt-2 space-x-2'>
                            <p className=''>วันที่ :</p>
                            <input
                                type="date"
                                className='border rounded-md p-1'
                                {...register("date", { required: true })}
                            />
                        </div>
                        <div className='flex space-x-2'>
                            <p>คำอธิบาย :</p>
                            <Textarea className="w-1/2" defaultValue="" {...register("description")} />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className='p-12 pt-0'>
                    {/* Debit Entries */}
                    {debitFields.map((entry, index) => (
                        <div key={entry.id} className="space-x-2 space-y-2">
                            <Controller
                                name={`debitEntries[${index}].DrCr`}
                                control={control}
                                defaultValue="Dr"
                                render={({ field }) => (
                                    <select
                                        className='border rounded-md p-1'
                                        {...field}
                                    >
                                        <option value="Dr">Dr</option>
                                    </select>
                                )}
                            />

                            <Controller
                                name={`debitEntries[${index}].AccountId`}
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <select
                                        className='border rounded-md p-1 w-72'
                                        {...field}>
                                        {optionsDrAccounts.map((option) => (
                                            <option key={option} value={getContentInParentheses(option)}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />

                            <Controller
                                name={`debitEntries[${index}].Amount`}
                                control={control}
                                rules={{ required: true }}
                                defaultValue={0}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        placeholder="Amount"
                                        type="number"
                                        step="0.01"
                                        className='border rounded-md p-1'
                                    />
                                )}
                            />

                            {index > 0 && (
                                <Button
                                    variant="ghost"
                                    type="button"
                                    onClick={() => debitRemove(index)}
                                >
                                    <Minus className="mr-2 h-4 w-4" /> ลบ
                                </Button>
                            )}
                        </div>
                    ))}

                    <div className='pt-2'>
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={() => debitAppend({ DrCr: 'Dr' })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> เพิ่ม
                        </Button>
                    </div>

                    {/* Credit Entries */}
                    {creditFields.map((entry, index) => (
                        <div key={entry.id} className="space-x-2 space-y-2 pl-24">
                            <Controller
                                name={`creditEntries[${index}].DrCr`}
                                control={control}
                                defaultValue="Cr"
                                render={({ field }) => (
                                    <select
                                        className='border rounded-md p-1'
                                        {...field}
                                    >
                                        <option value="Cr">Cr</option>
                                    </select>
                                )}
                            />

                            <Controller
                                name={`creditEntries[${index}].AccountId`}
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <select
                                        className='border rounded-md p-1 w-72'
                                        {...field}
                                    >
                                        {optionsCrAccounts.map((option) => (
                                            <option key={option} value={getContentInParentheses(option)}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />

                            <Controller
                                name={`creditEntries[${index}].Amount`}
                                control={control}
                                rules={{ required: true }}
                                defaultValue={0}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        placeholder="Amount"
                                        type="number"
                                        step="0.01"
                                        className='border rounded-md p-1'
                                    />
                                )}
                            />

                            {index > 0 && (
                                <Button
                                    variant="ghost"
                                    type="button"
                                    onClick={() => creditRemove(index)}
                                >
                                    <Minus className="mr-2 h-4 w-4" /> ลบ
                                </Button>
                            )}
                        </div>
                    ))}

                    <div className='pt-2 pl-24'>
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={() => creditAppend({ DrCr: 'Cr' })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> เพิ่ม
                        </Button>
                    </div>

                    {/* Error Message */}
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                    {/* <input type="submit" value="Submit" /> */}
                    <div className='pt-4'>
                        <Button type="submit" value="Submit">เพิ่มรายการ</Button>
                    </div>

                </CardContent>

            </Card>
        </form>
    );
}