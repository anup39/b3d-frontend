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

export default function MeasuringUploadPanel({ measuringsUploads }) {
  return (
    <>
      {measuringsUploads.length > 0 ? (
        measuringsUploads.map(
          ({
            id,
            task_id,
            name,
            file_name,
            progress,
            status,
            file_size,
            projection,
          }) => (
            <Box key={id}>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <FileOpenIcon></FileOpenIcon>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{
                      color: "#027FFE",
                      //   boxShadow: "0 0 2px 0 #027FFE",
                      paddingLeft: 1,
                      paddingRight: 1,
                      borderRadius: 1,
                    }}
                    primary={name}
                    secondary={
                      <React.Fragment>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            Status: {status}
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
                            Filename: {file_name}
                          </Typography>
                        </Box>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </List>
            </Box>
          )
        )
      ) : (
        <Box sx={{ padding: 2 }}>
          <Typography>No measuring data uploading.</Typography>
        </Box>
      )}
    </>
  );
}

// Path: src/components/MeasuringUploadStatusControl/MeasuringUploadStatusControl.jsx

MeasuringUploadPanel.propTypes = {
  measuringsUploads: PropTypes.array,
};
