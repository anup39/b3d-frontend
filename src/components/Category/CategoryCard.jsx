import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import TabIcon from "@mui/icons-material/Tab";
import { Button, Box } from "@mui/material";
import {
  setCategoryEditData,
  setOpenCategoryEditForm,
  setOpenCustomFieldForm,
  setOpenEditCustomFieldForm,
} from "../../reducers/EditClassification";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

export default function CategoryCard({
  id,
  name,
  full_name,
  description,
  type_of_geometry,
  sub_category,
  standard_category,
  style,
  extra_fields,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // useEffect(() => {
  //   axios
  //     .get(
  //       `${
  //         import.meta.env.VITE_API_DASHBOARD_URL
  //       }/global-category-style/?category=${id}`
  //     )
  //     .then((res) => {
  //       const style = res.data[0];
  //       console.log(style, "style");
  //       setStyle(style);
  //     });
  // }, [id]);

  return (
    <Paper
      sx={{
        p: 1,
        margin: 1,
        // maxWidth: 500,
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1A2027" : "#fff",
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <TabIcon sx={{ width: 30, height: 30, color: "green" }} />
        </Grid>
        <Grid item xs={12} sm container>
          <Grid
            item
            xs
            container
            direction="row"
            alignItems={"center"}
            spacing={2}
          >
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                <b>{full_name}</b>
              </Typography>
              <Typography variant="body2" gutterBottom>
                {description}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {t("Type") + " " + t("Of") + " " + t("Geometry")}:{" "}
                {type_of_geometry}
              </Typography>
              {style ? (
                <>
                  <Typography variant="body2" gutterBottom>
                    <span>{t("Fill") + " " + t("Color")}: </span>
                    <span
                      style={{
                        color: style.fill,
                        backgroundColor: style.fill,
                      }}
                    >
                      {style.fill}
                    </span>
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <span>
                      {t("Fill")} {t("Opacity")}:{" "}
                    </span>

                    {style.fill_opacity}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <span>
                      {t("Stroke")} {t("Color")}:{" "}
                    </span>
                    <span
                      style={{
                        color: style.stroke,
                        backgroundColor: style.stroke,
                      }}
                    >
                      {style.stroke}
                    </span>
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <span>
                      {t("Stroke")} {t("Width")}:{" "}
                    </span>
                    {style.stroke_width}
                  </Typography>
                </>
              ) : null}

              {JSON.parse(extra_fields) &&
              JSON.parse(extra_fields).length > 0 ? (
                <>
                  <Typography variant="body2" gutterBottom>
                    <b>{t("Additional")}</b>
                  </Typography>
                  {JSON.parse(extra_fields).map((field, index) => {
                    switch (field.type) {
                      case "Text":
                        return (
                          <Typography key={index}>{field.label}</Typography>
                        );
                      case "Checkbox":
                        return (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                            }}
                          >
                            <Typography>{field.label}</Typography>
                            {/* <input
                              type="checkbox"
                              checked={field.value}
                              disabled
                            /> */}
                          </Box>
                        );
                      case "Url":
                        return (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                            }}
                          >
                            <Typography>{field.label}</Typography>
                            {/* <Link href={field.value} target="_blank">
                              {field.value}
                            </Link> */}
                          </Box>
                        );
                      case "Number":
                        return (
                          <Typography key={index}>{field.label}</Typography>
                        );
                      case "Dropdown":
                        return (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                            }}
                          >
                            <Typography>{field.label}</Typography>
                            {/* {field.value && field.value.length > 0
                              ? field.value.map((item, index) => {
                                  return item.selected ? (
                                    <Typography key={index}>
                                      {item.value}
                                    </Typography>
                                  ) : null;
                                })
                              : null} */}
                          </Box>
                        );

                      default:
                        return null;
                    }
                  })}
                </>
              ) : null}
            </Grid>
            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <Button
                onClick={() => {
                  dispatch(setOpenCategoryEditForm(true));
                  dispatch(
                    setCategoryEditData({
                      id,
                      name,
                      type_of_geometry,
                      style,
                      full_name,
                      description,
                      sub_category,
                      standard_category: standard_category,
                    })
                  );
                }}
                variant="contained"
              >
                {t("Edit")}
              </Button>
              <Button
                onClick={() => {
                  dispatch(setOpenCustomFieldForm(true));
                  dispatch(
                    setCategoryEditData({
                      id,
                      name,
                      type_of_geometry,
                      style,
                      full_name,
                      description,
                      sub_category,
                      standard_category: standard_category,
                      extra_fields,
                    })
                  );
                }}
                variant="contained"
              >
                {t("Add") + " " + t("Custom" + " " + t("Field"))}
              </Button>

              {JSON.parse(extra_fields) &&
              JSON.parse(extra_fields).length > 0 ? (
                <Button
                  onClick={() => {
                    dispatch(setOpenEditCustomFieldForm(true));
                    dispatch(
                      setCategoryEditData({
                        id,
                        name,
                        type_of_geometry,
                        style,
                        full_name,
                        description,
                        sub_category,
                        standard_category: standard_category,
                        extra_fields,
                      })
                    );
                  }}
                  variant="contained"
                >
                  {t("Edit") + " " + t("Custom" + " " + t("Field"))}
                </Button>
              ) : null}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

CategoryCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  full_name: PropTypes.string,
  description: PropTypes.string,
  type_of_geometry: PropTypes.string,
  created_at: PropTypes.string,
  sub_category: PropTypes.number,
  standard_category: PropTypes.number,
  style: PropTypes.object,
  extra_fields: PropTypes.string,
};
