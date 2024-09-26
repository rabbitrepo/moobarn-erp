'use client'

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
import { Pencil, Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"

import checkBlockIsLand from "@/lib/checkBlockIsLand";
import checkHouseExist from "@/lib/checkHouseExist";
import { checkInstallmentByAddress, checkInstallmentByBlockId } from "@/lib/checkInstallment";
import { formatDate, formatThaiDateFromTimestamp } from "@/lib/formatThaiDate";
import { Badge } from "@/components/ui/badge"

interface Owner {
  to?: string | null;
  from?: string | null;
  title?: string;
  owner_id?: string;
  last_name?: string;
  first_name?: string;
}

interface BlockDetails {
  soi?: string | null;
  area?: string | null;
  deed?: string | null;
  note?: string | null;
  zone?: string | null;
  owners?: Owner[] | null;
  address?: string | null;
  deed_no?: string | null;
  block_id?: string | null;
  status_id?: string | null;
  photo_link?: string | null;
  status_name?: string | null;
  cancel?: boolean | null
}


async function getBlockDetails(block_id_param: string) {
  let { data, error } = await supabase
    .rpc('get_block_details', {
      block_id_param
    })
  if (error) alert(JSON.stringify(error))
  else return data
}

async function getAllStatus() {
  let { data, error } = await supabase
    .rpc('get_all_status')
  if (error) alert(JSON.stringify(error))
  else {
    return data.sort((a, b) => a.status_id - b.status_id)
  }
}

async function getBlocks(address_param) {
  let { data, error } = await supabase
    .rpc('get_block_ids_by_address', {
      address_param
    })
  if (error) alert(JSON.stringify(error))
  else return data.block_ids
}

async function changeNote(block_ids_param, note_param) {
  let { data, error } = await supabase
    .rpc('change_note', {
      block_ids_param,
      note_param
    })
  if (error) alert(JSON.stringify(error))
  else return data
}

export default function () {

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
    setError,
    resetField
  } = useForm()

  const router = useRouter()

  const [buttonLoading, setButtonLoading] = useState(false)

  const onSubmit = async (data) => {
    setButtonLoading(true)

    const { block_id } = data
    router.replace(`/app/block?blockId=${block_id}`, { scroll: false })
    console.log("data:", data)

    const blockDetails = await getBlockDetails(block_id)
    console.log("blockDetails:", blockDetails)
    setDetails(blockDetails)

    const fetchedStatusOptions = await getAllStatus()
    setStatusOptions(fetchedStatusOptions)

    if (blockDetails.address !== "ที่ดินเปล่า") {
      const block_ids = await getBlocks(blockDetails.address)
      setBlocks(block_ids)
    }

    if (blockDetails.address == "ที่ดินเปล่า") {
      setBlocks(null)
    }

    setButtonLoading(false)
  }

  const searchParams = useSearchParams()
  const blockId = searchParams.get('blockId')
  useEffect(() => {
    if (blockId !== null) {
      setValue('block_id', blockId)
      onSubmit({ block_id: blockId })
    } else {
      console.error('blockId is null. Handle this case accordingly.')
      return
    }
  }, [blockId])

  const [statusOptions, setStatusOptions] = useState([])
  const [details, setDetails] = useState<BlockDetails>({})
  const [blocks, setBlocks] = useState(null)

  const {
    handleSubmit: statusHandleSubmit,
    register: statusRegister,
    setValue: statusSetValue,
    control: statusControl
  } = useForm()

  const onStatusSubmit = async (data) => {
    if (data && (data.status_id !== "8") && (data.status_id !== "11") && (data.status_id !== details.status_id)) {
      let block_ids_param = []
      if (blocks) {
        block_ids_param = blocks
      } else {
        block_ids_param.push(details.block_id)
      }
      let { data: supabase_data, error } = await supabase
        .rpc('change_status', {
          block_ids_param,
          status_id_param: data.status_id
        })
      if (error) alert(JSON.stringify(error))
      else {
        alert("✅ สำเร็จ")
        window.location.reload()
        return
      }
    } else {
      if ((data.status_id === "8") || (data.status_id === "11")) {
        alert("📝 กรุณากรอก Form")
        window.open('https://docs.google.com/forms/d/e/1FAIpQLSc7HTc5zaO2ABM28RkhhwUb6SxT-MF1i8igmZ3fzPM5qXRFqA/viewform', '_blank');
      } else if (data.status_id === details.status_id) {
        alert("สถานะเหมือนเดิม ไม่จำเป็นต้องเปลี่ยน")
      } else {
        alert("❌ An Error has occured. Please try again.")
      }
    }
  }

  const {
    handleSubmit: noteHandleSubmit,
    register: noteRegister,
    setValue: noteSetValue,
  } = useForm()

  const onNoteSubmit = async (data) => {
    if (data && (data.note !== details.note)) {
      let block_ids_param = []
      if (blocks) {
        block_ids_param = blocks
      } else {
        block_ids_param.push(details.block_id)
      }
      console.log("block_ids:", block_ids_param)
      console.log("note:", data.note)
      let { data: supabase_data, error } = await supabase
        .rpc('change_note', {
          block_ids_param,
          note_param: data.note
        })
      if (error) alert(JSON.stringify(error))
      else {
        alert("✅ สำเร็จ")
        window.location.reload()
        return
      }
    } else {
      if (data.note === details.note) {
        alert("note เหมือนเดิม ไม่จำเป็นต้องเปลี่ยน")
      } else {
        alert("❌ An Error has occured. Please try again.")
      }
    }
  }
  
  const [type, setType] = useState("")

  return (
    <Card className="m-12">
      <CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 p-4'>
          <div className="flex items-center">
            <p className="flex-shrink-0 pr-2 ">แปลง :</p>
            <Input
              type="text"
              {...register('block_id')}
              className='w-24'
            />
          </div>
          {/* <Controller
            name="type"
            control={control}
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
                        resetField('address')
                        resetField('block')
                        setDetails({})
                        // setSelectedBlockId("")
                        // setSelectedBlockDetails({})
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
                        resetField('address')
                        resetField('block')
                        setDetails({})
                        // setSelectedBlockId("")
                        // setSelectedBlockDetails({})
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
                    control={control}
                    render={({ field }) => (
                      <Input type="text" step="1" {...field} className='w-24' />
                    )}
                  />
                </div>
              </div>
              :
              <></>
            }
            {type === "land" ?
              <div className="flex items-center">
                <p className="flex-shrink-0 pr-2 ">แปลง :</p>
                <Controller
                  name="block"
                  control={control}
                  render={({ field }) => (
                    <Input type="text" {...field} className='w-24' />
                  )}
                />
              </div>
              :
              <></>
            }
          </div> */}
          {buttonLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              กำลังโหลด
            </Button>
          ) : (
            <Button type="submit">ค้นหา</Button>
          )}
        </form>
        <Separator className="my-4" />
      </CardHeader>
      <CardContent >
        <div className="space-y-8 p-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <p className="flex-shrink-0 pr-2 ">ยกเลิก :</p>
              {details.cancel ? <Badge variant="destructive">ยกเลิก</Badge> : <Badge variant="outline">ไม่ยกเลิก</Badge>}
            </div>
            <div className="flex items-center">
              <p className="flex-shrink-0 pr-2 ">สถานะ :</p>
              <Badge variant="outline">{details.status_name}</Badge>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  แก้ไข
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>✏️ แก้ไข สถานะ</DialogTitle>
                  <DialogDescription>
                    <form onSubmit={statusHandleSubmit(onStatusSubmit)}>
                      <div className="p-6 space-x-2">
                        <Controller
                          name={`status_id`}
                          control={statusControl}
                          defaultValue={details.status_id}
                          render={({ field }) => (
                            <select
                              className='border rounded-md p-2'
                              {...field}
                            >
                              {statusOptions && statusOptions.map(option =>
                                <option value={option.status_id}>{option.status_name}</option>
                              )}
                            </select>
                          )}
                        />
                        {buttonLoading ? (
                          <Button disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            กำลังโหลด
                          </Button>
                        ) : (
                          <Button type="submit">แก้ไข</Button>
                        )}
                      </div>
                      <div className="flex flex-col items-center justify-center w-full space-y-4">
                        {blocks ?
                          <div className="flex pl-4 space-x-2 justify-center items-center">
                            <p>สถานะของบ้านเลขที่ :</p>
                            {blocks.map(block_id =>
                              <Button variant="outline" size="sm" disabled>
                                {block_id}
                              </Button>
                            )}
                            <p>จะถูก Update พร้อมกัน</p>
                          </div>
                          :
                          <></>}
                        <p>
                          หากต้องการแก้ไขสถานะเป็น ผ่อนจ่าย หรือ รอรับเงินจากบังคับคดี กรุณา
                          <a href="https://docs.google.com/forms/d/e/1FAIpQLSc7HTc5zaO2ABM28RkhhwUb6SxT-MF1i8igmZ3fzPM5qXRFqA/viewform" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                            คลิกที่นี่
                          </a>
                        </p>
                      </div>
                    </form>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
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
                {details.owners && details.owners.map((owner) => (
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
          <div className="space-y-4">
            <p className="flex-shrink-0 pr-2 ">โซน : {details.zone}</p>
            <p className="flex-shrink-0 pr-2 ">ซอย : {details.soi}</p>
            <p className="flex-shrink-0 pr-2 ">พื้นที่ : {details.area} ตารางวา</p>
            <p className="flex-shrink-0 pr-2 ">deed : {details.deed}</p>
            <p className="flex-shrink-0 pr-2 ">deed no : {details.deed_no}</p>
            <div className="flex flex-col items-start space-y-2">
              <p className="flex-shrink-0 pr-2">note : {details.note}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    แก้ไข
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>✏️ แก้ไข note</DialogTitle>
                    <DialogDescription>
                      <form onSubmit={noteHandleSubmit(onNoteSubmit)}>
                        <div className="flex flex-col justify-center items-center p-6 space-y-2">
                          <Textarea {...noteRegister('note')} defaultValue={details.note} />
                          {buttonLoading ? (
                            <Button disabled>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              กำลังโหลด
                            </Button>
                          ) : (
                            <Button type="submit">แก้ไข</Button>
                          )}
                        </div>
                        <div className="flex flex-col items-center justify-center w-full space-y-4">
                          {blocks ?
                            <div className="flex pl-4 space-x-2 justify-center items-center">
                              <p>note ของบ้านเลขที่ :</p>
                              {blocks.map(block_id =>
                                <Button variant="outline" size="sm" disabled>
                                  {block_id}
                                </Button>
                              )}
                              <p>จะถูก Update พร้อมกัน</p>
                            </div>
                            :
                            <></>}
                        </div>
                      </form>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}