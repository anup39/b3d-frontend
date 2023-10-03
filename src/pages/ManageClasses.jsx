import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "../components/AppBar/AppBar";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useSelector, useDispatch } from "react-redux";
import TransferList from "../components/TransferList/TransferList";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ width: "100%" }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function Classification() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <AppBar></AppBar>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          height: 224,
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{
            borderRight: "1px solid",
            height: "100vh",
            borderColor: "divider",
          }}
        >
          <Tab label="Standard Category" {...a11yProps(0)} />
          <Tab label="Sub Category" {...a11yProps(1)} />
          <Tab label="Category" {...a11yProps(2)} />
          <Tab label="Category Style" {...a11yProps(3)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <TransferList />
        </TabPanel>
        <TabPanel value={value} index={1}>
          Sub C
        </TabPanel>
        <TabPanel value={value} index={2}>
          C
        </TabPanel>
        <TabPanel value={value} index={3}>
          C Style
        </TabPanel>
      </Box>
    </>
  );
}
