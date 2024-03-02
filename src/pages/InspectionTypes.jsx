import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useSelector, useDispatch } from "react-redux";
import { setStandardInspections } from "../reducers/StandardInspection";
import { setSubInspections } from "../reducers/SubInspection";
import { setInspections } from "../reducers/Inspections";
import AppBar from "../components/Common/AppBar";
import StandardCategoryForm from "../components/StandardCategory/StandardCategoryForm";
import StandardCategoryCard from "../components/StandardCategory/StandardCategoryCard";
import SubCategoryForm from "../components/SubCategory/SubCategoryForm";
import SubCategoryCard from "../components/SubCategory/SubCategoryCard";
import CategoryForm from "../components/Category/CategoryForm";
import CategoryCard from "../components/Category/CategoryCard";

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

export default function InspectionTypes() {
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const standardInspections = useSelector(
    (state) => state.standardInspection.standardInspections
  );
  const subInspections = useSelector(
    (state) => state.subInspection.subInspections
  );
  const inspections = useSelector((state) => state.inspections.inspections);

  console.log(standardInspections, "standardInspections");
  console.log(subInspections, "subInspections");
  console.log(inspections, "inspections");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/standard-inspection/`)
      .then((res) => {
        console.log(res.data, "res.data");
        dispatch(setStandardInspections(res.data));
      });
  }, [dispatch]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/sub-inspection/`)
      .then((res) => {
        dispatch(setSubInspections(res.data));
      });
  }, [dispatch]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/inspection/`)
      .then((res) => {
        dispatch(setInspections(res.data));
      });
  }, [dispatch]);

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
        </Tabs>
        <TabPanel value={value} index={0}>
          <StandardCategoryForm />
          {standardInspections
            ? standardInspections.map((sc) => (
                <StandardCategoryCard
                  key={sc.id}
                  id={sc.id}
                  name={sc.name}
                  description={sc.description}
                  created_at={sc.created_at}
                />
              ))
            : null}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SubCategoryForm />
          {subInspections
            ? subInspections.map((subc) => (
                <SubCategoryCard
                  key={subc.id}
                  id={subc.id}
                  name={subc.name}
                  full_name={subc.full_name}
                  description={subc.description}
                  created_at={subc.created_at}
                />
              ))
            : null}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <CategoryForm />
          {inspections
            ? inspections.map((c) => (
                <CategoryCard
                  key={c.id}
                  id={c.id}
                  name={c.name}
                  full_name={c.full_name}
                  description={c.description}
                  type_of_geometry={c.type_of_geometry}
                  created_at={c.created_at}
                />
              ))
            : null}
        </TabPanel>
      </Box>
    </>
  );
}
