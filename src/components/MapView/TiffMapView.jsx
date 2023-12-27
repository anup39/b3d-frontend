import { Box, Tooltip } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { pink } from "@mui/material/colors";
import Switch from "@mui/material/Switch";
import { alpha, styled } from "@mui/material/styles";
import MoreonMap from "./MoreonMap";
import PropTypes from "prop-types";
import ButtonBase from "@mui/material/ButtonBase";

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

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
  borderRadius: 5,
});

export default function TiffMapView({ tif }) {
  console.log(tif, "tif item");
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
          <ButtonBase sx={{ width: 30, height: 30 }}>
            <Img alt="complex" src={tif.screenshot_image} />
          </ButtonBase>
        </ListItemIcon>
        <ListItemText
          secondary={tif.name.slice(0, 10)}
          secondaryTypographyProps={{ fontSize: 13 }}
        />
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
        </Tooltip>
        <MoreonMap />
      </ListItemButton>
    </Box>
  );
}

TiffMapView.propTypes = {
  tif: PropTypes.object,
};
