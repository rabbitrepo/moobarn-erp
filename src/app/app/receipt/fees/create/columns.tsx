"use client"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

export const columns = [
    {
        id: "select",
        header: ({ table }) => {
            return <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => {
                    table.toggleAllPageRowsSelected(!!value)
                }}
            />
        },
        cell: ({ row }) => {
            return <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => {
                    row.toggleSelected(!!value)
                }}
            />
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "period",
        header: "งวด",
    },
    {
        accessorKey: "status",
        header: "สถานะ",
        cell: ({ row }) => {
            const status = row.getValue("status")
            return status === "ค้างชำระ"
                ? <Badge variant="destructive">{status}</Badge>
                : <Badge variant="outline">{status}</Badge>;
        },
    },
    {
        accessorKey: "amount",
        header: "จำนวน​ (บาท)",
    },
];
