import { Box, Tooltip } from "@mui/material";
import SatelliteIcon from "@mui/icons-material/Satellite";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { pink } from "@mui/material/colors";
import LayersIcon from "@mui/icons-material/Layers";
import Badge from "@mui/material/Badge";
import Switch from "@mui/material/Switch";
import { alpha, styled } from "@mui/material/styles";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const PinkSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: pink[600],
    "&:hover": {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: pink[600],
  },
}));

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
        <ListItemIcon sx={{ margin: 0, padding: 0, minWidth: "40px" }}>
          <SatelliteIcon />
        </ListItemIcon>
        <ListItemText secondary={tif.name} />
        <Checkbox
          size="small"
          {...label}
          defaultChecked={false}
          sx={{
            color: pink[600],
            "&.Mui-checked": {
              color: pink[600],
            },
          }}
        />

        <Tooltip title="Show Measurings">
          <PinkSwitch size="small" {...label} defaultChecked={false} />
          {/* <Badge
            sx={{ "&:hover": { cursor: "pointer", margin: 0, padding: 0 } }}
            badgeContent={
              <Checkbox
                size="small"
                {...label}
                defaultChecked={false}
                sx={{
                  color: pink[800],
                  "&.Mui-checked": {
                    color: pink[600],
                  },
                  margin: 0,
                  padding: 0,
                }}
              />
            }
            // color="primary"
          > */}
          {/* <LayersIcon
            size="small"
            sx={{
              color: pink[800],
              padding: 0,
              margin: 0,
            }}
          /> */}

          {/* </Badge> */}
        </Tooltip>
      </ListItemButton>
    </Box>
  );
}
