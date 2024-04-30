import { Document, Page, Text, View } from "@react-pdf/renderer";

// Create styles
import { StyleSheet, Font } from "@react-pdf/renderer";
import Cairo from "./cairo.ttf";
// Register font
Font.register({ family: "Cairo", src: Cairo });

// Reference font
const styles = StyleSheet.create({
  lang: {
    fontFamily: "Cairo",
  },
  table: {
    fontFamily: "Cairo",

    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol: {
    width: "80px",
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
  title: {
    fontFamily: "Cairo",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create Document Component
const MyDocument = ({ items }) => (
  <Document>
    <Page wrap size="A4" style={styles.page}>
      <View>
        <Text>اذن وارد للمخزن</Text>
      </View>
      <View>
        <Text>print date : {new Date().toLocaleDateString()}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>اسم الصنف</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>وحده القياس</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>القسم</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>رصيد اول المده</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>الوارد </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}> المنصرف </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}> الرصيد </Text>
          </View>
        </View>
        {items.map((item) => (
          <View wrap={true} key={item.id} style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.name}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.unit_name}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.section.name}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.initial_balance}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.totaldeposit}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.totaldeduct}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.remaining}</Text>
            </View>
          </View>
        ))}
      </View>
      <Text
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
);

export default MyDocument;
