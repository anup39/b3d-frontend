import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import { setIndoors } from "../../reducers/Project";
import { useTranslation } from "react-i18next";
import {
  useDeleteIndoorByIdMutation,
  useGetIndoorByProjectIdQuery,
} from "../../api/indoorApi";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";

export default function IndoorCard({ indoor }) {
  const { t } = useTranslation();
  const { id, name, url } = indoor;
  const dispatch = useDispatch();
  const projectId = useSelector((state) => state.project.editIndoorProjectId);
  const [loading, setLoading] = useState(false);

  const [deleteIndoorById] = useDeleteIndoorByIdMutation();

  const { data: indoors, refetch } = useGetIndoorByProjectIdQuery(
    { project_id: projectId },
    { refetchOnMountOrArgChange: true }
  );

  const handleDeleteIndoor = async () => {
    setLoading(true);
    deleteIndoorById({ indoor_id: id })
      .unwrap()
      .then(() => {
        refetch();
      })
      .catch((error) => {
        dispatch(setshowToast(true));
        dispatch(
          settoastMessage(
            error?.error
              ? error?.error
              : `${t("Failed")} +" "+ ${t("To")} +" "+ ${t("Delete")}`
          )
        );
        dispatch(settoastType("error"));
      });
  };

  useEffect(() => {
    dispatch(setIndoors(indoors));
  }, [refetch, indoors, dispatch]);

  return (
    <Box
      sx={{
        ml: 1,
        mr: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 0,
        mt: 1,
        mb: 1,
      }}
    >
      <Typography> {name} </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 15,
        }}
      >
        <TextField
          disabled
          sx={{
            width: "300px",
          }}
          value={url}
        />

        <Tooltip title={t("Delete") + " " + t("Indoor")}>
          <IconButton
            id="delete-indoor"
            sx={{
              "&:hover": { cursor: "pointer" },
              color: "#d61b60",
            }}
            aria-label={t("Delete") + " " + t("Indoor")}
            onClick={handleDeleteIndoor}
          >
            {loading ? (
              <CircularProgress
                sx={{
                  fontSize: 5,
                }}
              />
            ) : (
              <DeleteIcon />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

IndoorCard.propTypes = {
  indoor: PropTypes.object.isRequired,
};
