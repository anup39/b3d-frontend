import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import React from "react";
import PropTypes from "prop-types";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import LinearProgressLabel from "../Property/LinearProgressLabel";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function MeasuringUploadPanel({ measuringsUploads }) {
  const { t } = useTranslation();
  const current_project_name = useSelector(
    (state) => state.project.current_project_name
  );
  return (
    <List
      dense
      sx={{
        maxWidth: 500,
        minWidth: 355,
        maxHeight: 450,
        overflow: "scroll",
      }}
    >
      <>
        <div>
          <Typography
            sx={{
              color: "#027FFE",
              fontWeight: "bold",
              fontSize: "13px",
              padding: "10px",
            }}
          >
            {t("Measurings")} {t("Uploads")} {t("For")} {current_project_name}
          </Typography>
        </div>
        {measuringsUploads.length > 0 ? (
          measuringsUploads.map(
            ({
              id,
              task_id,
              name,
              file_name,
              total_features,
              progress,
              status,
              file_size,
              projection,
              created_at,
            }) => (
              <ListItem key={id} alignItems="flex-start">
                <ListItemAvatar>
                  <FileOpenIcon
                    sx={{
                      color: "#757575",
                    }}
                  ></FileOpenIcon>
                </ListItemAvatar>

                <ListItemText
                  sx={{
                    color: "#D51B60",
                    paddingLeft: 1,
                    paddingRight: 1,
                    borderRadius: 1,
                  }}
                  primary={new Date(created_at).toLocaleDateString()}
                  secondary={
                    <React.Fragment>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {t("Total") + " " + t("Features")}: {total_features}
                        </Typography>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {t("Status")}: {status}
                        </Typography>
                        <LinearProgressLabel
                          value={progress}
                        ></LinearProgressLabel>

                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {t("File") + " " + t("Name")}: {file_name}
                        </Typography>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {t("File") + " " + t("Size")}:{" "}
                          {(file_size / 1048576).toFixed(2)} MB
                        </Typography>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {t("Projection")}: {projection}
                        </Typography>
                        <Typography
                          sx={{ display: "inline", fontSize: "9px" }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {t("Task") + " " + t("Id")}: {task_id}
                        </Typography>
                      </Box>
                    </React.Fragment>
                  }
                />
              </ListItem>
            )
          )
        ) : (
          <Box sx={{ padding: 2 }}>
            <Typography>{t("No") + " " + t("Data")}</Typography>
          </Box>
        )}
      </>
    </List>
  );
}

// Path: src/components/MeasuringUploadStatusControl/MeasuringUploadStatusControl.jsx

MeasuringUploadPanel.propTypes = {
  measuringsUploads: PropTypes.array,
};
