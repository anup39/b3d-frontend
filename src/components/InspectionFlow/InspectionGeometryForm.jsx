import {
  Box,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";

export default function InspectionGeometryForm(props) {
  const {
    handleCreateGeometry,
    deleteGeometry,
    handleEditGeometry,
    handleCloseMenu,
    standard_inspection,
    sub_inspection,
    inspection,
    selectedId,
    setSelectedStandardInspection,
    setSelectedSubInspection,
    setSelectedInspection,
    selectedStandardInspection,
    selectedSubInspection,
    selectedInspection,
    selectedCost,
    setSelectedCost,
    loaderSave,
    loaderDelete,
  } = props;
  return (
    <form onSubmit={handleCreateGeometry} style={{ display: "none" }} id="menu">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "blue" }}>ID:{selectedId || null} </Typography>
        <Tooltip title="Save">
          {loaderSave ? (
            <CircularProgress size={20}></CircularProgress>
          ) : (
            <IconButton
              type="submit"
              // onClick={(event) => handleMouse(event)}
            >
              <DoneIcon
                sx={{
                  "&:hover": { cursor: "pointer" },
                  color: "red",
                }}
              />
            </IconButton>
          )}
        </Tooltip>
        <Tooltip title="Delete">
          {loaderDelete ? (
            <CircularProgress size={20}></CircularProgress>
          ) : (
            <IconButton onClick={deleteGeometry}>
              <DeleteIcon
                sx={{
                  "&:hover": { cursor: "pointer" },
                  color: "red",
                }}
              />
            </IconButton>
          )}
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton onClick={handleEditGeometry}>
            <EditIcon
              sx={{
                "&:hover": { cursor: "pointer" },
                color: "red",
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Close">
          <IconButton onClick={(event) => handleCloseMenu(event)}>
            <CloseIcon
              sx={{
                "&:hover": { cursor: "pointer" },
                color: "red",
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Box>
        {standard_inspection && standard_inspection.length > 0 ? (
          <Autocomplete
            size="small"
            sx={{ m: 0.5, mb: 1, width: "90%" }}
            options={standard_inspection}
            getOptionLabel={(option) => option.name}
            value={
              standard_inspection.find(
                (type) => type.id === selectedStandardInspection
              ) || null
            }
            renderInput={(params) => (
              <TextField
                required
                {...params}
                label="Standard Inspection"
                variant="outlined"
              />
            )}
            filterOptions={(options) => options}
            onChange={(event, value) => {
              setSelectedStandardInspection(value ? value.id : null);
            }}
          />
        ) : null}
        {sub_inspection && sub_inspection.length > 0 ? (
          <Autocomplete
            size="small"
            sx={{ m: 0.5, mb: 1, width: "90%" }}
            options={sub_inspection}
            getOptionLabel={(option) => option.name}
            value={
              sub_inspection.find(
                (type) => type.id === selectedSubInspection
              ) || null
            }
            renderInput={(params) => (
              <TextField
                required
                {...params}
                label="Sub Inspection"
                variant="outlined"
              />
            )}
            filterOptions={(options) => options}
            onChange={(event, value) => {
              setSelectedSubInspection(value ? value.id : null);
            }}
          />
        ) : null}

        {inspection && inspection.length > 0 ? (
          <Autocomplete
            size="small"
            sx={{
              m: 0.5,
              mb: 1,
              width: "90%",
              backgroundColor: inspection.find(
                (type) => type.id === selectedInspection
              )?.stroke_color,
            }}
            options={inspection}
            getOptionLabel={(option) => option.name}
            value={
              inspection.find((type) => type.id === selectedInspection) || null
            }
            renderInput={(params) => (
              <TextField
                required
                {...params}
                label="Inspection"
                variant="outlined"
              />
            )}
            filterOptions={(options) => options}
            onChange={(event, value) => {
              setSelectedInspection(value ? value.id : null);
            }}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <span style={{ color: option.stroke_color }}>
                  {option.name}
                </span>
              </Box>
            )}
          />
        ) : null}
      </Box>
      <Box>
        <TextField
          type="number"
          value={selectedCost || ""}
          placeholder="Cost"
          sx={{ m: 0.5, width: "90%" }}
          size="small"
          onChange={(event) => setSelectedCost(event.target.value)}
        ></TextField>
      </Box>
    </form>
  );
}

InspectionGeometryForm.propTypes = {
  handleCreateGeometry: PropTypes.func,
  handleCloseMenu: PropTypes.func,
  deleteGeometry: PropTypes.func,
  handleEditGeometry: PropTypes.func,
  standard_inspection: PropTypes.array,
  sub_inspection: PropTypes.array,
  inspection: PropTypes.array,
  selectedId: PropTypes.number,
  setSelectedStandardInspection: PropTypes.func,
  setSelectedSubInspection: PropTypes.func,
  setSelectedInspection: PropTypes.func,
  setSelectedCost: PropTypes.func,
  selectedStandardInspection: PropTypes.number,
  selectedSubInspection: PropTypes.number,
  selectedInspection: PropTypes.number,
  selectedCost: PropTypes.number,
  loaderSave: PropTypes.bool,
  loaderDelete: PropTypes.bool,
};

// Test

// Path: src/components/InspectionFlow/InspectionGeometryForm.test.js
