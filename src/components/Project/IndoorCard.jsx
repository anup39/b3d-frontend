import PropTypes from "prop-types";
import {
  Box,
  Typography,
  TextField,
  Button,
  Icon,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function IndoorCard({ indoor }) {
  const { id, name, url } = indoor;

  const handleDeleteIndoor = () => {
    console.log(id);
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
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

IndoorCard.propTypes = {
  indoor: PropTypes.object.isRequired,
};
