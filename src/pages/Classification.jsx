import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { setStandardCategorys } from "../reducers/StandardCategory";
import { setSubCategorys } from "../reducers/SubCategory";
import { setCategorys } from "../reducers/Category";
import AppBar from "../components/Common/AppBar";
import StandardCategoryForm from "../components/StandardCategory/StandardCategoryForm";
import StandardCategoryCard from "../components/StandardCategory/StandardCategoryCard";
import SubCategoryForm from "../components/SubCategory/SubCategoryForm";
import SubCategoryCard from "../components/SubCategory/SubCategoryCard";
import CategoryForm from "../components/Category/CategoryForm";
import CategoryCard from "../components/Category/CategoryCard";
import CategoryEditForm from "../components/Category/CategoryEditForm";
import { useTranslation } from "react-i18next";
import AddCustomField from "../components/Category/AddCustomField";
import Field from "../components/Category/Field";
import EditCustomFieldForm from "../components/Category/EditCustomFieldForm";
import { useGetGlobalCategoryQuery } from "../api/globalCategoryApi";
import { useGetGlobalSubCategoryQuery } from "../api/globalSubCategoryAPi";
import { useGetGlobalStandardCategoryQuery } from "../api/globalStandardCategoryApi";
import { CircularProgress } from "@mui/material";

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
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);

  const { data: globalCategoryData, isLoading: isGlobalCategoryLoading } =
    useGetGlobalCategoryQuery();
  const { data: globalSubCategoryData, isLoading: isGlobalSubCategoryLoading } =
    useGetGlobalSubCategoryQuery();
  const {
    data: globalStandardCategoryData,
    isLoading: isGlobalStandardCategoryLoading,
  } = useGetGlobalStandardCategoryQuery();

  useEffect(() => {
    dispatch(setStandardCategorys(globalStandardCategoryData));
  }, [globalStandardCategoryData, dispatch]);
  useEffect(() => {
    dispatch(setSubCategorys(globalSubCategoryData));
  }, [globalSubCategoryData, dispatch]);
  useEffect(() => {
    dispatch(setCategorys(globalCategoryData));
  }, [globalCategoryData, dispatch]);

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
          <Tab label={t("Standard") + " " + t("Category")} {...a11yProps(0)} />
          <Tab label={t("Sub") + " " + t("Category")} {...a11yProps(1)} />
          <Tab label={t("Category")} {...a11yProps(2)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <StandardCategoryForm />
          {globalStandardCategoryData ? (
            globalStandardCategoryData?.map((sc) => (
              <StandardCategoryCard
                key={sc.id}
                id={sc.id}
                name={sc.name}
                description={sc.description}
                created_at={sc.created_at}
              />
            ))
          ) : (
            <CircularProgress
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
              }}
            />
          )}
        </TabPanel>

        <TabPanel value={value} index={1}>
          <SubCategoryForm />
          {globalSubCategoryData ? (
            globalSubCategoryData?.map((subc) => (
              <SubCategoryCard
                key={subc.id}
                id={subc.id}
                name={subc.name}
                full_name={subc.full_name}
                description={subc.description}
                created_at={subc.created_at}
              />
            ))
          ) : (
            <CircularProgress
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
              }}
            />
          )}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <CategoryForm />
          <CategoryEditForm />
          <AddCustomField />
          <Field />
          <EditCustomFieldForm />
          {globalCategoryData ? (
            globalCategoryData?.map((c) => (
              <CategoryCard
                key={c.id}
                id={c.id}
                name={c.name}
                full_name={c.full_name}
                description={c.description}
                type_of_geometry={c.type_of_geometry}
                created_at={c.created_at}
                sub_category={c.sub_category}
                standard_category={c.standard_category}
                style={c.style}
                extra_fields={c.extra_fields}
              />
            ))
          ) : (
            <CircularProgress
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
              }}
            />
          )}
        </TabPanel>
      </Box>
    </>
  );
}
