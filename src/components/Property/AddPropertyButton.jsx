import Tooltip from "@mui/material/Tooltip";
import { Button } from "@mui/material";
import { setshowTifUpload } from "../../reducers/DisplaySettings";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

export default function AddPropertyButton() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const openForm = () => {
    dispatch(setshowTifUpload(true));
  };

  return (
    <>
      <Tooltip title={t("Add") + " " + "Property" + " " + t("Map")}>
        <Button
          onClick={openForm}
          sx={{ margin: "5px", position: "static" }}
          variant="contained"
          color="error"
        >
          {t("Add") + " " + "Property" + " " + t("Map")}
        </Button>
      </Tooltip>
    </>
  );
}
