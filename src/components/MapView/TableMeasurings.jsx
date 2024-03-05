import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function TableGeometry({ imageId }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchRectangles = async () => {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/inspection-photo-geometry/?inspection_photo=${imageId}`
      );
      console.log(res.data);
      setRows(res.data);
    };

    fetchRectangles();
  }, [imageId]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>id</StyledTableCell>
            <StyledTableCell align="right">standard_inspection</StyledTableCell>
            <StyledTableCell align="right">sub_inspection</StyledTableCell>
            <StyledTableCell align="right">inspection</StyledTableCell>
            <StyledTableCell align="right">symbol</StyledTableCell>
            <StyledTableCell align="right">cost</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                {row.id}
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.standard_inspection_name}
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.sub_inspection_name}
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.inspection_name}
                {/* <span style={{ backgroundColor: row.stroke_color }}></span> */}
              </StyledTableCell>
              <StyledTableCell
                sx={{ backgroundColor: row.stroke_color }}
                align="right"
              ></StyledTableCell>
              <StyledTableCell align="right">{row.cost}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

TableGeometry.propTypes = {
  imageId: PropTypes.number,
};
