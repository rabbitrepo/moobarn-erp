'use client'

import { Document, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import kunalai_logo from 'public/kunalai_logo.jpg'

const tw = createTw({
  theme: {
    extend: {
      colors: {
        custom: "cornflowerblue",
      },
    },
  },
});

export default function ReceiptGenerator({ data }) {
  return (
    <Document>
      <Page size="A5" style={tw("p-12 flex")}>
        <View style={tw("bg-gray-100")}>
          <View style={tw("flex flex-row flex-wrap bg-gray-200")}>
            {/* <Image src={kunalai_logo} style={{ width: 64, height: 64 }} /> */}
            <Text style={tw("text-3xl")}>Contact Info</Text>
            <Text style={tw("text-3xl")}>Receipt + ReceiptNo</Text>
          </View>
        </View>
        <View style={tw("bg-gray-100 mt-4")}>
          <Text style={tw("text-3xl")}>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
}

// import { Document, Page, View, Image, Text, StyleSheet, Font } from '@react-pdf/renderer';

// // Font.register({
// //   family: 'Kanit',
// //   src: 'https://fonts.gstatic.com/s/kanit/v6/nKKX-Go6G5tXcraQ9Oem7dRuoBPrmA.ttf'
// // });

// const styles = StyleSheet.create({
//   body: {
//     paddingTop: 35,
//     paddingBottom: 65,
//     paddingHorizontal: 35,
//   },
//   containerCenter: {
//     flexDirection: 'row', // Display in a row
//     alignItems: 'center', // Center items vertically
//     marginLeft: 10,
//   },
//   containerStart: {
//     justifyContent: 'flex-start',
//     marginLeft: 10,
//   },
//   image: {
//     width: 50,
//     height: 25,
//   },
//   text: {
//     fontSize: 12,
//     // fontFamily: 'Arial',
//   },
// });

// // TODO: Add Thai Font https://chat.openai.com/c/892811f6-abde-45db-9f1f-b81dbcb73ae4
// const ReceiptGenerator = () => (
//   <Document>
//     <Page size="A5" style={styles.body} wrap>
//       <View style={styles.containerCenter}>
//         <Image src="https://i.ibb.co/GH5C8zS/Kunalai-Logo-Edited.jpg" style={styles.image} />
//         <View style={styles.containerStart}>
//           <Text style={styles.text}>นิติบุคคลหมู่บ้านจัดสรร คุณาลัย บางขุนเทียน</Text>
//           <Text style={styles.text}>This is the third column.</Text>
//           <Text style={styles.text}>This is the third column.</Text>
//           <Text style={styles.text}>This is the third column.</Text>
//         </View>
//         <View style={styles.containerStart}>
//           <Text style={styles.text}>This is the first column.</Text>
//           <Text style={styles.text}>This is the third column.</Text>
//         </View>
//       </View>
//     </Page>
//   </Document>
// );

// export default ReceiptGenerator;