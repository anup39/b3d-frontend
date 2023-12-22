import { Box } from "@mui/material";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { pink } from "@mui/material/colors";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function TiffMapView({ tif }) {
  return (
    <Box>
      <ListItemButton
        key={tif.id}
        sx={{
          pl: 4,
          "&:hover": {
            backgroundColor: "#F1F7FF",
          },
          fontSize: 6,
        }}
      >
        <ListItemIcon sx={{ fontSize: 2 }}>
          <MapsHomeWorkIcon />
        </ListItemIcon>
        <ListItemText secondary={tif.name} sx={{ opacity: open ? 1 : 0 }} />
        <Checkbox
          {...label}
          defaultChecked
          sx={{
            color: pink[800],
            "&.Mui-checked": {
              color: pink[600],
            },
          }}
        />
      </ListItemButton>
    </Box>
  );
}
