import { GridToolbarContainer } from "@mui/x-data-grid";
import { ExportButton } from "./ExportButton";

function CustomToolbar(props) {
  return (
    <GridToolbarContainer {...props}>
      <ExportButton />
    </GridToolbarContainer>
  );
}

export default CustomToolbar;
