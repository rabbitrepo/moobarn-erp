'use client'

import { DataTable } from "@/app/app/receipt/fees/create/data-table"
import { columns } from "@/app/app/receipt/fees/create/columns"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from "react"
import supabase from "supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from 'next/navigation'
import { formatDate, formatPeriod, formatThaiDateFromTimestamp } from "@/lib/formatThaiDate";
import { checkInstallmentByAddress, checkInstallmentByBlockId } from "@/lib/checkInstallment";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";

export default function CreateReceipt() {

    // init react-hook-form
    const {
        handleSubmit: handleCheckSubmit,
        control: checkControl,
        watch: checkWatch,
        resetField: checkResetField,
    } = useForm();

    const {
        control,
        handleSubmit,
        register,
        setValue,
        watch
    } = useForm()
    // --------------------

    // บ้าน or ที่ดิน
    const [type, setType] = useState("")

    // --------------------

    // Handle Check ค่าส่วนกลาง
    async function checkBlockIsLand(block_id) {

        if (!block_id) {
            console.error("Address parameter is blank.");
            alert('กรุณากรอก 🏡 เลขที่แปลง')
            return "Address parameter is blank."; // Or handle this case as needed
        }

        try {
            let { data: blockIsLand, error } = await supabase
                .rpc('check_block_is_land', {
                    block_id_param: block_id
                })
            const { message } = blockIsLand
            if (error) {
                alert(JSON.stringify(error))
                return console.log("error:", error)
            } else {
                return message;
            }
        } catch (error) {
            alert(JSON.stringify(error))
            return console.log("error:", error)
        }
    }

    async function checkHouseExist(address) {
        // Check if address is blank
        if (!address) {
            console.error("Address parameter is blank.");
            alert('กรุณากรอก 🏠 บ้านเลขที่')
            return "Address parameter is blank."; // Or handle this case as needed
        }

        try {
            let { data: houseExist, error } = await supabase
                .rpc('check_house_exist', { address_param: address });
            const { message } = houseExist;

            if (error) {
                // Handle API error
                console.error("API error:", error);
                alert(error.message); // Displaying error message to the user
                return null; // Or handle this case as needed
            } else {
                return message;
            }
        } catch (error) {
            // Handle unexpected errors
            console.error("Unexpected error:", error);
            return null; // Or handle this case as needed
        }
    }

    async function getBlockDetails(block_id_param) {
        try {
            let { data, error } = await supabase
                .rpc('get_block_details', {
                    block_id_param
                })
            if (error) alert(JSON.stringify(error))
            else return data
        } catch (error) {
            alert(error)
            return console.log("error:", error)
        }
    }

    const [invoiceDetails, setInvoiceDetails] = useState([])

    async function get_invoice_details_by_address(address) {
        try {
            let { data: invoice_details, error } = await supabase
                .rpc('get_invoice_details_by_address', {
                    address_param: address
                });

            if (error) {
                alert(JSON.stringify(error))
                return console.log("error:", error)
            } else {
                console.log(invoice_details)
                return invoice_details;
            }
        } catch (error) {
            alert(error)
            return console.log("error:", error)
        }
    }

    async function get_invoice_details_by_block_id(block_id) {
        try {
            let { data: invoice_details, error } = await supabase
                .rpc('get_invoice_details_by_block_id', {
                    block_id_param: block_id
                });

            if (error) {
                alert(JSON.stringify(error))
                return console.log("error:", error)
            } else {
                return invoice_details;
            }
        } catch (error) {
            alert(error)
            return console.log("error:", error)
        }
    }

    async function get_payment_history(block_id_param) {
        try {
            let { data, error } = await supabase
                .rpc('get_payment_history', {
                    block_id_param
                });

            if (error) {
                alert(JSON.stringify(error))
                return console.log("error:", error)
            } else {
                return data;
            }
        } catch (error) {
            alert(error)
            return console.log("error:", error)
        }
    }

    async function get_first_block_id(address_param) {
        try {
            let { data, error } = await supabase
                .rpc('get_block_ids_by_address', {
                    address_param
                });

            if (error) {
                alert(JSON.stringify(error))
                return console.log("error:", error)
            } else {
                return data.block_ids[0];
            }
        } catch (error) {
            alert(error)
            return console.log("error:", error)
        }
    }

    function checkStatus(dateString) {
        const currentDate = new Date();
        const inputDate = new Date(`${dateString}-01`); // Assuming day is always the 1st day of the month

        if (inputDate < currentDate) {
            return "ค้างชำระ"; // Payment is overdue
        } else {
            return "ชำระล่วงหน้า"; // Payment is in the future
        }
    }

    const [rowSelection, setRowSelection] = useState({});

    const [paymentHistory, setPaymentHistory] = useState([])

    const [blocks, setBlocks] = useState([])


    async function getBlocks(address_param) {
        let { data, error } = await supabase
            .rpc('get_block_ids_by_address', {
                address_param
            })
        if (error) alert(JSON.stringify(error))
        else return data.block_ids
    }

    const [selectedBlockId, setSelectedBlockId] = useState("")
    const [selectedBlockDetails, setSelectedBlockDetails] = useState({})
    console.log('block_details', selectedBlockDetails)

    async function selectBlockId(block_id) {

        setRowSelection({})
        setInvoiceDetails([])
        setPaymentHistory([])
        setSelectedBlockId(block_id)

        const fetchedBlockDetails = await getBlockDetails(block_id)
        setSelectedBlockDetails(fetchedBlockDetails)

        const checkInstallment = await checkInstallmentByBlockId(block_id)
        if (checkInstallment.message === "not exist") {
            const fetchedInvoiceDetails = await get_invoice_details_by_block_id(block_id)

            if (fetchedInvoiceDetails.length === 0) {
                alert("✅ จ่ายครบแล้ว")
            } else {

                const sortedInvoiceDetails = fetchedInvoiceDetails.sort((a, b) => {
                    const periodA = a.period;
                    const periodB = b.period;

                    // Compare the periods as strings
                    if (periodA < periodB) {
                        return -1;
                    }
                    if (periodA > periodB) {
                        return 1;
                    }
                    return 0;
                })

                const formattedInvoiceDetails = sortedInvoiceDetails.map((invoice) => {
                    const { period, amount, invoice_ids } = invoice
                    return {
                        "period": formatPeriod(period),
                        "status": checkStatus(period),
                        amount,
                        invoice_ids
                    }
                })

                console.log("formattedInvoiceDetails:", formattedInvoiceDetails)
                setInvoiceDetails(formattedInvoiceDetails)

                const history = await get_payment_history(block_id)
                setPaymentHistory(history)
            }
        }
    }

    const onCheckSubmit = async (data) => {

        setRowSelection({})
        setInvoiceDetails([])
        setPaymentHistory([])
        setCheckButtonLoading(true)

        if (type === "house") {
            const { address } = data
            const houseExist = await checkHouseExist(address)

            if (houseExist === "not exist") {
                alert("❌ ไม่มีบ้านเลขที่นี้ กรุณาลองใหม่อีกครั้ง")
            }

            if (houseExist === "exist") {

                // check if ผ่อนมั้ย
                const checkInstallment = await checkInstallmentByAddress(address)
                if (checkInstallment.message === "not exist") {

                    const fetchedBlockIds = await getBlocks(address)
                    setBlocks(fetchedBlockIds)
                    // const fetchedInvoiceDetails = await get_invoice_details_by_address(address)

                    // if (fetchedInvoiceDetails.length === 0) {
                    //     alert("✅ จ่ายครบแล้ว")
                    // } else {

                    //     const sortedInvoiceDetails = fetchedInvoiceDetails.sort((a, b) => {
                    //         const periodA = a.period;
                    //         const periodB = b.period;

                    //         // Compare the periods as strings
                    //         if (periodA < periodB) {
                    //             return -1;
                    //         }
                    //         if (periodA > periodB) {
                    //             return 1;
                    //         }
                    //         return 0;
                    //     })

                    //     const formattedInvoiceDetails = sortedInvoiceDetails.map((invoice) => {
                    //         const { period, amount, invoice_ids } = invoice
                    //         return {
                    //             "period": formatPeriod(period),
                    //             "status": checkStatus(period),
                    //             amount,
                    //             invoice_ids
                    //         }
                    //     })

                    //     console.log("formattedInvoiceDetails:", formattedInvoiceDetails)
                    //     setInvoiceDetails(formattedInvoiceDetails)

                    //     const firstBlockId = await get_first_block_id(address)
                    //     const history = await get_payment_history(firstBlockId)
                    //     setPaymentHistory(history)
                    // }
                } else {
                    alert(`👈 บ้านเลขที่นี้กำลังผ่อนชำระ โปรดใช้เมนู "ค่าส่วนกลาง (ผ่อน)"`)
                }


            }
        }

        if (type === "land") {
            const { block } = data

            const blockIsLand = await checkBlockIsLand(block)

            if (blockIsLand === "not exist") {
                alert("❌ ไม่มีที่ดินเลขที่แปลงนี้ กรุณาลองใหม่อีกครั้ง")
            }

            if (blockIsLand === "house") {
                alert("🏠 ที่ดินแปลงนี้มีบ้าน โปรดกรอกบ้านเลขที่")
            }

            if (blockIsLand === "land") {
                const { block } = data

                // check if ผ่อนมั้ย
                const checkInstallment = await checkInstallmentByBlockId(block)
                if (checkInstallment.message === "not exist") {

                    const fetchedBlockDetails = await getBlockDetails(block)
                    setSelectedBlockDetails(fetchedBlockDetails)

                    const fetchedInvoiceDetails = await get_invoice_details_by_block_id(block)

                    if (fetchedInvoiceDetails.length === 0) {
                        alert("✅ จ่ายครบแล้ว")
                    } else {

                        const sortedInvoiceDetails = fetchedInvoiceDetails.sort((a, b) => {
                            const periodA = a.period;
                            const periodB = b.period;

                            // Compare the periods as strings
                            if (periodA < periodB) {
                                return -1;
                            }
                            if (periodA > periodB) {
                                return 1;
                            }
                            return 0;
                        })

                        const formattedInvoiceDetails = sortedInvoiceDetails.map((invoice) => {
                            const { period, amount, invoice_ids } = invoice
                            return {
                                "period": formatPeriod(period),
                                "status": checkStatus(period),
                                amount,
                                invoice_ids
                            }
                        })

                        console.log("formattedInvoiceDetails:", formattedInvoiceDetails)
                        setInvoiceDetails(formattedInvoiceDetails)

                        const history = await get_payment_history(block)
                        setPaymentHistory(history)
                    }
                } else {
                    alert(`👈 แปลงที่ดินนี้กำลังผ่อนชำระ โปรดใช้เมนู "ค่าส่วนกลาง (ผ่อน)"`)
                }


            }
        }

        setCheckButtonLoading(false)
    }
    // --------------------

    // -- React Table - Selected Rows
    const [selectedRows, setSelectedRows] = useState([])

    useEffect(() => {
        setValue('selectedRows', selectedRows)
    }, [selectedRows]);

    const handleRowSelectionChange = (unformattedSelectedRows) => {
        const indexOfSelectedRowsArray = Object.keys(unformattedSelectedRows).map(Number);
        setSelectedRows(prevSelectedRows => {
            // Using a functional update to prevent the infinite loop
            if (JSON.stringify(prevSelectedRows) !== JSON.stringify(indexOfSelectedRowsArray)) {
                return indexOfSelectedRowsArray;
            }
            return prevSelectedRows;
        });
    };
    // ------------------------------

    // -- Amounts State
    const [totalAmountFromInvoices, setTotalAmountFromInvoices] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const revEtc = watch('RevEtcAmount', 0)
    const discountAmount = watch('DiscountAmount', 0)
    const adjustmentType = watch('AdjustmentType', "")

    useEffect(() => {
        const selectedInvoicesDetail = invoiceDetails.filter((_, index) => selectedRows.includes(index))

        const sumAmountFromSelectedInvoices = selectedInvoicesDetail.reduce((sum, invoice) => sum + invoice.amount, 0)
        setTotalAmountFromInvoices(sumAmountFromSelectedInvoices)

        const calcTotalAmount = Number(sumAmountFromSelectedInvoices) + Number(revEtc) - Number(discountAmount)
        setTotalAmount(calcTotalAmount)

    }, [selectedRows, revEtc, discountAmount])
    // ------------------------------

    // -- Handle Form Submit
    const router = useRouter()

    async function createReceipt(date_param, description_param, entries_param, invoice_ids_param, type_param) {
        let { data: receipt, error } = await supabase
            .rpc('create_receipt', {
                date_param,
                description_param,
                entries_param,
                invoice_ids_param,
                type_param
            })

        if (error) { alert(JSON.stringify(error)) } else {
            console.log("supabase result:", receipt)
            const { success } = receipt

            if (success) {
                alert('✅ สำเร็จ')
                router.push('/app/receipt/fees')
            } else {
                alert('❌ เพิ่มรายการไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
            }

            return receipt
        }
    }

    const onSubmit = async (data) => {
        setButtonLoading(true)
        const {
            date,
            type,
            selectedRows,
            RevEtcAmount,
            DiscountAmount,
            description,
        } = data

        console.log(data)
        // filter only invoices that is selected 
        const selectedInvoiceDetails = selectedRows.map(index => invoiceDetails[index])
        // create an array of invoice_ids
        let selectedInvoiceIds = []
        if (selectedInvoiceDetails.length === 1) {
            // If there's only one selected invoice, access its invoice_ids directly
            selectedInvoiceIds = selectedInvoiceDetails[0].invoice_ids;
        } else {
            // If there are multiple selected invoices, use flatMap
            selectedInvoiceIds = selectedInvoiceDetails.flatMap(item => item.invoice_ids);
        }
        // const selectedInvoiceIds = selectedInvoiceDetails.flatMap(item => item.invoice_ids)

        const entries = []
        let revNow = 0
        let revLater = 0

        // DEBIT
        if (type === "cash") {
            entries.push({
                account_id: "101102",
                debit_amount: Number(totalAmount)
            })
        }
        if (type === "transfer") {
            entries.push({
                account_id: "101205",
                debit_amount: Number(totalAmount)
            })
        }
        if (type === "check") {
            // TODO: บัญชี Check or Transfer ได้เลย?
            entries.push({
                account_id: "101205",
                debit_amount: Number(totalAmount)
            })
        }

        // CREDIT
        if (RevEtcAmount > 0) {
            entries.push({
                // รายได้อื่นๆ
                account_id: "400201",
                credit_amount: Number(RevEtcAmount)
            })
        }

        // change to Selected invoices
        selectedInvoiceDetails.map(invoice => {
            if (invoice.status === "ค้างชำระ") {
                revNow = revNow + invoice.amount
            }
            if (invoice.status === "ชำระล่วงหน้า") {
                revLater = revLater + invoice.amount
            }
        })

        if (DiscountAmount > 0) {
            revNow = revNow - Number(DiscountAmount)
        }

        if (revNow > 0) {
            entries.push({
                // รายได้ค่าส่วนกลาง
                account_id: "400101",
                credit_amount: revNow
            })
        }

        if (revLater > 0) {
            entries.push({
                // รายได้ค่าส่วนกลางรับล่วงหน้า
                account_id: "204301",
                credit_amount: revLater
            })
        }
        console.log("selectedRows", selectedRows)
        console.log("selectedInvoiceIds", selectedInvoiceIds)

        const entries2 = entries.map(entry => {
            if (entry.debit_amount) {
                return { account_id: entry.account_id, debit_amount: Number(entry.debit_amount).toFixed(2) };
            } else {
                return { account_id: entry.account_id, credit_amount: Number(entry.credit_amount).toFixed(2) };
            }
        });

        const result = {
            date,
            type,
            description,
            invoice_ids: selectedInvoiceIds,
            entries: entries2
        }

        console.log("local result:", result)

        if (selectedRows.length > 0) {
            const receipt = await createReceipt(
                result.date,
                result.description,
                result.entries,
                result.invoice_ids,
                result.type,
            )
            console.log(receipt)
        } else {
            alert("📅 โปรดเลือกเดือนที่ต้องการชำระค่าส่วนกลาง")
        }

        setButtonLoading(false)
    }

    // Cosmetic State
    const [checkButtonLoading, setCheckButtonLoading] = useState(false)
    const [buttonLoading, setButtonLoading] = useState(false)
    const [paid, setPaid] = useState(false)
    // ------------------------------

    return (
        <Card className="m-12">
            <CardHeader>
                {/* Form #1 Input address / block_id  ==> Address First */}
                <form onSubmit={handleCheckSubmit(onCheckSubmit)}>
                    <div className="p-4">
                        <h1 className="text-2xl font-semibold">
                            เช็คค่าส่วนกลาง
                        </h1>
                        <Controller
                            name="type"
                            control={checkControl}
                            defaultValue=""
                            render={({ field }) => (
                                <div className="flex space-x-2 pt-4 pl-2">

                                    <p>ประเภท :</p>

                                    <div className="flex space-x-2">
                                        <Label className="flex space-x-1">
                                            <input
                                                type="radio"
                                                value="house"
                                                onChange={() => {
                                                    field.onChange('house')
                                                    setType('house')
                                                    setBlocks([])
                                                    setSelectedBlockId("")
                                                    setSelectedBlockDetails({})
                                                    setRowSelection({})
                                                    setInvoiceDetails([])
                                                    setPaymentHistory([])
                                                    checkResetField('address')
                                                    checkResetField('block')
                                                }}
                                                checked={field.value === 'house'}
                                            />
                                            <p className="text-base">บ้าน</p>
                                        </Label>

                                        <Label className="flex space-x-1">
                                            <input
                                                type="radio"
                                                value="land"
                                                onChange={() => {
                                                    field.onChange('land');
                                                    setType('land')
                                                    setBlocks([])
                                                    setSelectedBlockId("")
                                                    setSelectedBlockDetails({})
                                                    setRowSelection({})
                                                    setInvoiceDetails([])
                                                    setPaymentHistory([])
                                                    checkResetField('address')
                                                    checkResetField('block')
                                                }}
                                                checked={field.value === 'land'}
                                            />
                                            <p className="text-base">ที่ดิน</p>
                                        </Label>
                                    </div>

                                </div>
                            )}
                        />
                        <div className="flex flex-col space-y-4 py-4 pl-2">

                            {type === "house" ?
                                <div className="flex flex-col space-y-4">
                                    <div className="flex items-center">
                                        <p className="flex-shrink-0 pr-2">บ้านเลขที่ :</p>
                                        <Controller
                                            name="address"
                                            control={checkControl}
                                            render={({ field }) => (
                                                <Input type="text" step="1" {...field} className='w-24' />
                                            )}
                                        />
                                    </div>
                                    {blocks ?
                                        <div className="flex space-x-2 justify-start items-center">
                                            <p>แปลงที่ดินในบ้านเลขที่เดียวกัน :</p>
                                            {blocks.map(block_id =>
                                                block_id == selectedBlockId ?
                                                    <Button type="button" onClick={() => selectBlockId(block_id)}>{block_id}</Button>
                                                    :
                                                    <Button type="button" variant="outline" onClick={() => selectBlockId(block_id)}>{block_id}</Button>
                                            )}
                                        </div>
                                        :
                                        <></>}
                                </div>
                                :
                                <></>
                            }
                            {type === "land" ?
                                <div className="flex items-center">
                                    <p className="flex-shrink-0 pr-2 ">แปลง :</p>
                                    <Controller
                                        name="block"
                                        control={checkControl}
                                        render={({ field }) => (
                                            <Input type="text" {...field} className='w-24' />
                                        )}
                                    />
                                </div>
                                :
                                <></>
                            }
                            <div className="space-y-4">
                                <p className="flex-shrink-0 pr-2 ">โซน : {selectedBlockDetails && selectedBlockDetails.zone}</p>
                                <p className="flex-shrink-0 pr-2 ">พื้นที่ : {selectedBlockDetails && selectedBlockDetails.area} ตารางวา</p>
                            </div>
                            <div className="space-y-2">
                                <p className="flex-shrink-0 pr-2 ">เจ้าของ :</p>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[150px]">คำนำหน้า</TableHead>
                                            <TableHead>ชื่อ</TableHead>
                                            <TableHead>นามสกุล</TableHead>
                                            <TableHead>เริ่ม</TableHead>
                                            <TableHead>สิ้นสุด</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedBlockDetails && selectedBlockDetails.owners && selectedBlockDetails.owners.map((owner) => (
                                            <TableRow key={owner.owner_id}>
                                                <TableCell>{owner.title}</TableCell>
                                                <TableCell>{owner.first_name}</TableCell>
                                                <TableCell>{owner.last_name}</TableCell>
                                                <TableCell className="font-medium">{owner.from && formatThaiDateFromTimestamp(owner.from)}</TableCell>
                                                <TableCell className="font-medium">{owner.to ? formatThaiDateFromTimestamp(owner.to) : "-"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {checkButtonLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                กำลังโหลด
                            </Button>
                        ) : (
                            <Button type="submit">เช็คค่าส่วนกลาง</Button>
                        )}

                    </div>
                </form>
            </CardHeader>
            <CardContent>
                {/* Form #2 Type, Invoices, */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-4 pt-0 space-y-6">

                        <h2 className="text-2xl font-semibold">
                            ออกใบเสร็จ - รายได้ค่าส่วนกลาง
                        </h2>

                        <Controller
                            name="type"
                            control={control}
                            defaultValue=""
                            rules={{ required: true }}
                            render={({ field }) => (
                                <div className="flex space-x-2 pl-2">

                                    <p>ช่องทางการชำระ :</p>

                                    <div className="flex space-x-2">
                                        <Label className="flex space-x-1">
                                            <input
                                                type="radio"
                                                value="cash"
                                                onChange={() => {
                                                    field.onChange('cash');
                                                }}
                                                checked={field.value === 'cash'}
                                            />
                                            <p className="text-base"> เงินสด</p>
                                        </Label>

                                        <Label className="flex space-x-1">
                                            <input
                                                type="radio"
                                                value="transfer"
                                                onChange={() => {
                                                    field.onChange('transfer');
                                                }}
                                                checked={field.value === 'transfer'}
                                            />
                                            <p className="text-base">โอน</p>
                                        </Label>
                                        <Label className="flex space-x-1">
                                            <input
                                                type="radio"
                                                value="check"
                                                onChange={() => {
                                                    field.onChange('check');
                                                }}
                                                checked={field.value === 'check'}
                                            />
                                            <p className="text-base">เช็ค</p>
                                        </Label>
                                    </div>

                                </div>
                            )}
                        />

                        <div className="flex space-x-2 pl-2 items-center">
                            <p>วันที่ :</p>
                            <input
                                type="date"
                                className='border rounded-md p-1'
                                {...register("date", { required: true })}
                            />
                        </div>

                        <div className="flex justify-stretch px-2 w-full space-x-8">
                            <div className="w-4/5 space-y-2">
                                <h3 className="text-xl font-semibold">เลือกงวดที่ต้องการชำระ</h3>
                                <ScrollArea className="h-[400px] rounded-md border p-4">
                                    <DataTable
                                        columns={columns}
                                        data={invoiceDetails}
                                        onRowSelectionChange={handleRowSelectionChange}
                                        rowSelection={rowSelection}
                                        setRowSelection={setRowSelection}
                                    />
                                </ScrollArea>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold">ประวัติการชำระ</h3>
                                <ScrollArea className="h-[400px] rounded-md border p-4">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ปี</TableHead>
                                                <TableHead className="text-right">จ่ายแล้ว​ (เดือน)</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paymentHistory.map((invoice) => (
                                                <TableRow key={invoice.year} className="justify-items-center">
                                                    <TableCell>{invoice.year + 543}</TableCell>
                                                    <TableCell className="text-right">{invoice.paid} / 12</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </div>
                        </div>

                        <div className="pl-2">

                            <div className=" justify-center pr-2 hidden">
                                <p className="flex-shrink-0 pr-2">คำอธิบาย :</p>
                                <Textarea {...register('description')} />
                            </div>

                            <Controller
                                name="AdjustmentType"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <div className="flex space-x-2 pt-4">
                                        <div className="flex space-x-2">
                                            <Label className="flex space-x-1">
                                                <input
                                                    type="radio"
                                                    value="revEtc"
                                                    onChange={() => {
                                                        field.onChange('revEtc')
                                                        setValue('RevEtcAmount', 0)
                                                        setValue('DiscountAmount', 0)
                                                    }}
                                                    checked={field.value === 'revEtc'}
                                                />
                                                <p className="text-base">รับเกิน / เบี้ยปรับ</p>
                                            </Label>

                                            <Label className="flex space-x-1">
                                                <input
                                                    type="radio"
                                                    value="discount"
                                                    onChange={() => {
                                                        field.onChange('discount')
                                                        setValue('RevEtcAmount', 0)
                                                        setValue('DiscountAmount', 0)
                                                    }}
                                                    checked={field.value === 'discount'}
                                                />
                                                <p className="text-base">รับขาด</p>
                                            </Label>
                                        </div>
                                    </div>
                                )}
                            />

                            {adjustmentType === "revEtc" ?
                                <div className="flex flex-col space-y-4 pt-4">

                                    <div className="flex justify-center items-center w-1/2">
                                        <p className="flex-shrink-0 pr-2">จำนวน :</p>
                                        <Input type="number" step="0.01" {...register('RevEtcAmount')} />
                                    </div>
                                </div>
                                :
                                adjustmentType === "discount" ?
                                    <div className="flex flex-col space-y-4 pt-4">

                                        <div className="flex justify-center items-center w-1/2">
                                            <p className="flex-shrink-0 pr-2">จำนวน :</p>
                                            <Input type="number" step="0.01" {...register('DiscountAmount')} />
                                        </div>
                                    </div>
                                    :
                                    <></>}
                        </div>
                    </div>

                    <p className="text-lg font-bold pl-6">ยอดรวม : {totalAmount.toLocaleString()} บาท</p>

                    <Label className="flex space-x-2 pt-4 pl-6">
                        <input
                            type="checkbox"
                            onClick={() => setPaid(paid => !paid)}
                        />
                        <p className="text-base">ได้รับเงินแล้ว</p>
                    </Label>

                    <div className="pl-4 pt-4">
                        {buttonLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                กำลังโหลด
                            </Button>
                        ) : (
                            <Button type="submit" disabled={!paid}>ออกใบเสร็จ</Button>
                        )}

                    </div>
                </form>

            </CardContent>
        </Card>
    )
}