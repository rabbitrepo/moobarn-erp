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
import { useForm, Controller, setError } from 'react-hook-form';
import { useEffect, useState } from "react"
import supabase from "supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Decimal from 'decimal.js';


import checkBlockIsLand from "@/lib/checkBlockIsLand";
import checkHouseExist from "@/lib/checkHouseExist";
import { checkInstallmentByAddress, checkInstallmentByBlockId } from "@/lib/checkInstallment";
import { formatDate } from "@/lib/formatThaiDate";

async function getInstallmentPayments(istm_id_param) {
    let { data, error } = await supabase
        .rpc('get_installment_payments_by_istm_id', {
            istm_id_param
        })
    if (error) { alert(error) } else {
        return data
    }
}

function formatHistory(InstallmentPayments) {
    const { istm_id, amount, note, Installment_Payment } = InstallmentPayments;

    // Check if Installment_Payment is an array, if not, provide a default empty array
    const installmentPaymentsArray = Array.isArray(Installment_Payment) ? Installment_Payment : [];
    const fotmattedInstallmentPaymentsArray = installmentPaymentsArray.map((payment) => {
        return {
            ...payment,
            date: formatDate(payment.date)
        }
    })
    const last_payment = installmentPaymentsArray.reduce((maxPayment, payment) => {
        return payment.sort > maxPayment.sort ? payment : maxPayment;
    }, { sort: -Infinity });

    const last_remaining = last_payment.remaining;

    return {
        istm_id,
        amount,
        note,
        Installment_Payment: fotmattedInstallmentPaymentsArray,
        last_remaining,
    };
}

export default function CreateReceiptInstallment() {

    // เช็ค
    const {
        handleSubmit: handleCheckSubmit,
        control: checkControl,
        watch: checkWatch
    } = useForm();

    const [type, setType] = useState("")

    const [history, setHistory] = useState({
        amount: 0,
        istm_id: 0,
        note: "",
        Installment_Payment: [],
        last_remaining: 0,
    })

    const [checkButtonLoading, setCheckButtonLoading] = useState(false)

    const onCheckSubmit = async (data) => {

        setCheckButtonLoading(true)

        if (type === "house") {
            const { address } = data
            const houseExist = await checkHouseExist(address)

            if (houseExist === "not exist") {
                alert("❌ ไม่มีบ้านเลขที่นี้ กรุณาลองใหม่อีกครั้ง")
            }

            if (houseExist === "exist") {
                const checkInstallment = await checkInstallmentByAddress(address)

                if (checkInstallment.message === "not exist") {
                    alert("❌ ไม่มียอดผ่อนชำระ กรุณาชำระแบบธรรมดา")
                } else {
                    // alert(checkInstallment.istm_id)
                    // fecth history
                    const installmentPayments = await getInstallmentPayments(checkInstallment.istm_id)
                    const formattedInstallmentPayment = formatHistory(installmentPayments)
                    setHistory(formattedInstallmentPayment)
                    console.log(history)
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
                const checkInstallment = await checkInstallmentByBlockId(block)

                if (checkInstallment.message === "not exist") {
                    alert("❌ ไม่มียอดผ่อนชำระ กรุณาชำระแบบธรรมดา")
                } else {
                    // alert(checkInstallment.istm_id)
                    // fecth history
                    const installmentPayments = await getInstallmentPayments(checkInstallment.istm_id)
                    const formattedInstallmentPayment = formatHistory(installmentPayments)
                    setHistory(formattedInstallmentPayment)
                    console.log(history)
                }
            }
        }
        setCheckButtonLoading(false)
    }
    // -----

    // ออกใบเสร็จ
    const {
        control,
        handleSubmit,
        register,
        setValue,
        watch,
        formState: { errors },
        setError
    } = useForm()

    const router = useRouter()

    const [remainingAfterThisPayment, setRemainingAfterThisPayment] = useState(0)
    const amountInput = watch('Amount')
    const adjustmentType = watch('AdjustmentType', "")
    const revEtc = watch('RevEtcAmount', 0)
    const discountAmount = watch('DiscountAmount', 0)
    // console.log(history)
    useEffect(() => {
        // if history.last_remaining > 0 
        if (history.last_remaining > 0) {
            setRemainingAfterThisPayment(history.last_remaining - amountInput - Number(discountAmount) + Number(revEtc))
        } else {
            setRemainingAfterThisPayment(history.amount - amountInput - Number(discountAmount) + Number(revEtc))
        }
    }, [history, amountInput, revEtc, discountAmount])

    const onSubmit = async (data) => {
        setButtonLoading(true)

        console.log("data:", data)

        if (remainingAfterThisPayment < 0) {
            setError('Amount', {
                type: 'manual',
                message: 'Remaining amount cannot be less than zero',
            });
            setButtonLoading(false)
            return;
        }

        const { Amount: amount_param, Date: date_param, Description: note_param, Type: type_param, RevEtcAmount, DiscountAmount} = data

        const entries_param = []

        if (type_param === "cash") {
            entries_param.push({
                account_id: "101102",
                debit_amount: Number(amount_param) - Number(discountAmount) + Number(RevEtcAmount)
            })
        }
        if (type_param === "transfer") {
            entries_param.push({
                account_id: "101205",
                debit_amount: Number(amount_param) - Number(discountAmount) + Number(RevEtcAmount)
            })
        }
        if (type_param === "check") {
            // TODO: บัญชี Check or Transfer ได้เลย?
            entries_param.push({
                account_id: "101205",
                debit_amount: Number(amount_param) - Number(discountAmount) + Number(RevEtcAmount)
            })
        }

        entries_param.push({
            account_id: "400101",
            credit_amount: Number(amount_param) - Number(discountAmount)
        })

        if (Number(RevEtcAmount) > 0) {
            entries_param.push({
                // รายได้อื่นๆ
                account_id: "400201",
                credit_amount: Number(RevEtcAmount)
            })
        }

        const result = {
            date_param,
            type_param,
            note_param,
            istm_id_param: history.istm_id,
            entries_param,
            amount_param
        }

        console.log("result:", result)

        // call create_installment_payment
        // const { data: rpcData, error: rpcError } = await supabase.rpc('create_installment_payment', result);

        // if (rpcError) {
        //     console.error('Error calling create_installment_payment:', rpcError);
        //     alert('❌ เพิ่มรายการไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
        // } else {
        //     console.log('create_installment_payment result:', rpcData);
        //     alert('✅ สำเร็จ')
        //     router.push('/app/receipt/installment')
        // }

        setButtonLoading(false)
    }

    const [buttonLoading, setButtonLoading] = useState(false)
    const [paid, setPaid] = useState(false)
    // -----
    const a = watch('Amount')
    console.log("Amount:", a)

    return (
        <Card className="m-12">
            <CardHeader>
                {/* Form #1 */}
                <form onSubmit={handleCheckSubmit(onCheckSubmit)}>
                    <h1 className="text-2xl font-semibold pl-6 pt-4">
                        เช็คยอดผ่อน
                    </h1>
                    <Controller
                        name="type"
                        control={checkControl}
                        defaultValue=""
                        render={({ field }) => (
                            <div className="flex space-x-2 pt-4 pl-6">
                                <p>ประเภท :</p>
                                <div className="flex space-x-2">
                                    <Label className="flex space-x-1">
                                        <input
                                            type="radio"
                                            value="house"
                                            onChange={() => {
                                                field.onChange('house')
                                                setType('house')
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
                                            }}
                                            checked={field.value === 'land'}
                                        />
                                        <p className="text-base">ที่ดิน</p>
                                    </Label>
                                </div>
                            </div>
                        )}
                    />
                    <div className="p-4">
                        <div className="flex py-4 pl-2">
                            {type === "house" ?
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
                        </div>

                        {checkButtonLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                กำลังโหลด
                            </Button>
                        ) : (
                            <Button type="submit">เช็คยอดผ่อน</Button>
                        )}

                    </div>
                </form>
            </CardHeader>
            <CardContent>
                {/* Form #2 */}
                <div className="p-4 pt-0 space-y-4">
                    {/* Amount / Note / History Table */}

                    <p className="text-md font-bold pl-2">ทั้งหมด : {history.amount.toLocaleString()} บาท</p>
                    <div className="flex space-x-2 pl-2">
                        <p className="flex-shrink-0 pr-2">คำอธิบาย :</p>
                        <Textarea
                            disabled
                            placeholder={history.note}
                            className="pr-2"
                        />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[75px]">งวด</TableHead>
                                <TableHead className="w-[150px]">วันที่</TableHead>
                                <TableHead className="w-[100px]">จำนวน</TableHead>
                                <TableHead>คำอธิบาย</TableHead>
                                <TableHead className="text-right font-semibold">คงเหลือ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.Installment_Payment.map((row) => {
                                return (
                                    <TableRow>
                                        <TableCell>{row.sort}</TableCell>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.amount.toLocaleString()}</TableCell>
                                        <TableCell>{row.note}</TableCell>
                                        <TableCell className="text-right font-semibold">{row.remaining.toLocaleString()}</TableCell>
                                    </TableRow>
                                )
                            })}

                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            <CardFooter>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div className="pl-4 space-y-4">
                            <h2 className="text-2xl font-semibold">
                                ออกใบเสร็จ - รายได้ค่าส่วนกลาง (ผ่อน)
                            </h2>
                            <Controller
                                name="Type"
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
                                    {...register("Date", { required: true })}
                                />
                            </div>
                            <div className="flex justify-center items-center pl-2">
                                <p className="flex-shrink-0 pr-2">งวดนี้ :</p>
                                <Input
                                    type="number"
                                    step="0.01"
                                    {...register('Amount', {
                                        required: 'Amount is required',
                                        validate: value => parseFloat(value) > 0 || 'Amount must be more than 0',
                                    })}
                                />
                            </div>
                            <div className="flex justify-center items-center pl-2">
                                <p className="flex-shrink-0 pr-2">คำอธิบาย :</p>
                                <Textarea {...register('Description')} />
                            </div>
                            <Controller
                                name="AdjustmentType"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <div className="flex space-x-2 pt-4 pl-2">
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
                                <div className="flex flex-col space-y-4 pt-4 pl-2">

                                    <div className="flex justify-center items-center w-1/2">
                                        <p className="flex-shrink-0 pr-2">จำนวน :</p>
                                        <Input type="number" step="0.01" {...register('RevEtcAmount')} />
                                    </div>
                                </div>
                                :
                                adjustmentType === "discount" ?
                                    <div className="flex flex-col space-y-4 pt-4 pl-2">

                                        <div className="flex justify-center items-center w-1/2">
                                            <p className="flex-shrink-0 pr-2">จำนวน :</p>
                                            <Input type="number" step="0.01" {...register('DiscountAmount')} />
                                        </div>
                                    </div>
                                    :
                                    <></>}
                            <p className="text-md font-bold pl-2">คงเหลือหลังงวดนี้ : {remainingAfterThisPayment.toLocaleString()} บาท</p>
                            {errors.Amount && <p className="text-red-500">{errors.Amount.message}</p>}
                        </div>

                        <Label className="flex space-x-2 pl-6">
                            <input
                                type="checkbox"
                                onClick={() => setPaid(paid => !paid)}
                            />
                            <p className="text-base">ได้รับเงินแล้ว</p>
                        </Label>

                        <div className="pl-4 ">
                            {buttonLoading ? (
                                <Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    กำลังโหลด
                                </Button>
                            ) : (
                                <Button type="submit" disabled={!paid}>ออกใบเสร็จ</Button>
                            )}
                        </div>
                    </div>
                </form>
            </CardFooter>
        </Card>
    )
}

