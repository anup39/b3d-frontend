import PropTypes from "prop-types";
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteIndoorById, fetchIndoorsByProjectId } from "../../api/api";
import { useSelector, useDispatch } from "react-redux";
import { setIndoors } from "../../reducers/Project";

export default function IndoorCard({ indoor }) {
  const { id, name, url } = indoor;
  const dispatch = useDispatch();
  const projectId = useSelector((state) => state.project.editIndoorProjectId);
  const [loading, setLoading] = useState(false);

  const handleDeleteIndoor = () => {
    setLoading(true);
    deleteIndoorById(id).then((res) => {
      console.log(res, "res delete indoor");
      fetchIndoorsByProjectId(projectId).then((res) => {
        console.log(res, "res fetch indoors");
        dispatch(setIndoors(res));
        setLoading(false);
      });
    });
  };
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

        <Tooltip title="Delete Indoor">
          <IconButton
            id="delete-indoor"
            sx={{
              "&:hover": { cursor: "pointer" },
              color: "#d61b60",
            }}
            aria-label="Delete Indoor"
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
