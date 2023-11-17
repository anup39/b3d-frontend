import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "../components/AppBar/AppBar";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useSelector, useDispatch } from "react-redux";
import StandardCategoryForm from "../components/StandardCategoryForm/StandardCategoryForm";
import StandardCategoryCard from "../components/StandardCategoryCard/StandardCategoryCard";
import SubCategoryForm from "../components/SubCategoryForm/SubCategoryForm";
import SubCategoryCard from "../components/SubCategoryCard/SubCategoryCard";
import CategoryForm from "../components/CategoryForm/CategoryForm";
import CategoryCard from "../components/CategoryCard/CategoryCard";

import { setStandardCategorys } from "../reducers/StandardCategory";
import { setSubCategorys } from "../reducers/SubCategory";
import { setCategorys } from "../reducers/Category";

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
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const standardCategorys = useSelector(
    (state) => state.standardCategory.standardCategorys
  );
  const subCategorys = useSelector((state) => state.subCategory.subCategorys);
  const categorys = useSelector((state) => state.category.categorys);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_DASHBOARD_URL}/global-standard-category/`
      )
      .then((res) => {
        dispatch(setStandardCategorys(res.data));
      });
  }, [dispatch]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/global-sub-category/`)
      .then((res) => {
        dispatch(setSubCategorys(res.data));
      });
  }, [dispatch]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/global-category/`)
      .then((res) => {
        dispatch(setCategorys(res.data));
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
          {standardCategorys
            ? standardCategorys.map((sc) => (
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
          {subCategorys
            ? subCategorys.map((subc) => (
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
          {categorys
            ? categorys.map((c) => (
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
