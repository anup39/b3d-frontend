import { Box } from "@mui/material";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";

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
          <Typography sx={{ ml: 2, fontSize: 15 }}>{tif.name}</Typography>
        </ListItemIcon>
      </ListItemButton>
    </Box>
  );
}
