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

export default function MeasuringUploadPanel({ measuringsUploads }) {
  return (
    <>
      {measuringsUploads.length > 0 ? (
        <Box>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Brunch this weekend?"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Ali Connors
                    </Typography>
                    {" — I'll be in your neighborhood doing errands this…"}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </List>
        </Box>
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
