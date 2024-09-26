'use client'

import { Document, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

const tw = createTw({
  theme: {
    extend: {
      colors: {
        custom: "cornflowerblue",
      },
    },
  },
});

export default function PVGenerator({ data }) {
  return (
    <Document>
      <Page size="A5" style={tw("p-4 flex flex-row flex-wrap gap-4")}>
        <Text>{JSON.stringify(data)}</Text>
      </Page>
    </Document>
  );
}