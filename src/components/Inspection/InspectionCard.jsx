import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import FolderIcon from "@mui/icons-material/Folder";
import Typography from "@mui/material/Typography";
import ShareIcon from "@mui/icons-material/Share";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { Tooltip } from "@mui/material";
const InpectionData = [
  {
    id: 1,
    name: "Inspection 1",
    totalPhoto: "112",
    inspectedPhoto: "21/112",
    date: "2024/1/3",
  },
  {
    id: 2,
    name: "Inspection 2",
    totalPhoto: "116",
    inspectedPhoto: "42/116",
    Date: "2024/2/8",
  },
  {
    id: 3,
    name: "Inspection 3",
    TotalPhoto: "189",
    InspectedPhoto: "3/189",
    Date: "2024/1/12",
  },
];

export default function InspectionCard() {
  return (
    <>
      {InpectionData.map((item) => (
        <div key={item.id}>
          <Paper
            sx={{
              p: 1,
              margin: 1,
              flexGrow: 1,
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#1A2027" : "#fff",
            }}
          >
            <Grid container spacing={2}>
              <Grid item>
                <FolderIcon
                  sx={{ width: 128, height: 128, color: "#65C9FF" }}
                />
              </Grid>
              <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <Typography
                      gutterBottom
                      variant="subtitle1"
                      component="div"
                    >
                      {item.name}
                    </Typography>
                  </Grid>
                  <Grid item xs container direction="row" spacing={1}>
                    <Grid item>
                      <Tooltip title="Share">
                        <ShareIcon sx={{ "&:hover": { cursor: "pointer" } }} />
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip title="Upload Photos">
                        <AddPhotoAlternateIcon
                          sx={{ "&:hover": { cursor: "pointer" } }}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip title="Report">
                        <AssessmentIcon
                          sx={{ "&:hover": { cursor: "pointer" } }}
                        />
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs>
                  <Typography variant="body2" color="text.secondary">
                    Total Photos: {item.totalPhoto}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inspected Photos: {item.inspectedPhoto}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {item.date}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </div>
      ))}
    </>
  );
}
