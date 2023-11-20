import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "../components/AppBar/AppBar";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TransferList from "../components/TransferList/TransferList";
import { Button, Tooltip } from "@mui/material";
import ErrorPopup from "../components/ErrorPopup/ErrorPopup";

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
  const { client_id } = useParams();
  const [value, setValue] = useState(0);
  const [clientName, setClientName] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/clients/${client_id}/`)
      .then((res) => {
        setClientName(res.data.name);
      });
  }, [client_id]);

  return (
    <>
      <AppBar></AppBar>

      <ErrorPopup />

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
        </Tabs>
        <TabPanel value={value} index={0}>
          <Tooltip>
            <Button
              sx={{ marginBottom: "25px" }}
              variant="outlined"
              color="error"
            >
              {clientName}
            </Button>
          </Tooltip>
          <TransferList
            client_id={parseInt(client_id)}
            component={"standard-category"}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Tooltip>
            <Button
              sx={{ marginBottom: "25px" }}
              variant="outlined"
              color="error"
            >
              {clientName}
            </Button>
          </Tooltip>
          <TransferList
            client_id={parseInt(client_id)}
            component={"sub-category"}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Tooltip>
            <Button
              sx={{ marginBottom: "25px" }}
              variant="outlined"
              color="error"
            >
              {clientName}
            </Button>
          </Tooltip>
          <TransferList
            client_id={parseInt(client_id)}
            component={"category"}
          />
        </TabPanel>
      </Box>
    </>
  );
}
