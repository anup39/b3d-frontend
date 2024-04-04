import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
import { Box, Paper } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import { setshowReport } from "../../reducers/MapView";
import { useState } from "react";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create Document Component
const ReportActualPage = () => {
  const [pageLayout, setPageLayout] = useState("A5");
  const dispatch = useDispatch();
  return (
    <>
      <PDFViewer
        style={{
          left: "0%",
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 9999,
        }}
      >
        <Document>
          <Page size={pageLayout} style={styles.page}>
            <View style={styles.section}>
              <Text>Section #1</Text>
            </View>
            <View style={styles.section}>
              <Text>Section #2</Text>
            </View>
          </Page>
          <Page size={pageLayout} style={styles.page}>
            <View style={styles.section}>
              <Text>Section #1</Text>
            </View>
            <View style={styles.section}>
              <Text>Section #2</Text>
            </View>
          </Page>
        </Document>
      </PDFViewer>
      <Box
        sx={[
          {
            position: "absolute",
            right: "8%",
            top: "17px",
            zIndex: 9999,
            cursor: "pointer",
            color: "white",
            display: "flex",
            gap: "10px",
          },
        ]}
      >
        <Box sx={{ display: "flex", color: "white" }}>
          <label>Page Layout :</label>
          <div
            style={{
              marginLeft: 5,
            }}
          >
            <select
              value={pageLayout}
              onChange={(e) => setPageLayout(e.target.value)}
            >
              <option value="A4">A4</option>
              <option value="A5">A5</option>
            </select>
          </div>
        </Box>
        <Tooltip sx={{ zIndex: 99999 }} title="Close Report">
          <CancelIcon
            onClick={() => {
              dispatch(setshowReport(false));
            }}
          />
        </Tooltip>
      </Box>
    </>
  );
};

export default ReportActualPage;
