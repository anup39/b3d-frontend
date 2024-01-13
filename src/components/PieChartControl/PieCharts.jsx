import { PureComponent } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { connect } from "react-redux";
import axios from "axios";
import { string } from "prop-types";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

class PieCharts extends PureComponent {
  state = {
    activeIndex: 0,
    data: [],
  };

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    const { rows } = this.props;
    return (
      // <ResponsiveContainer width="100%" height="100%">

      <>
        {rows.length > 0 ? (
          <PieChart width={200} height={200}>
            <Pie
              data={rows}
              cx="50%"
              cy="50%"
              labelLine={false}
              // label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {rows.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : (
          <div style={{ padding: 3, margin: 2, height: 200, width: 200 }}>
            <p style={{ marginTop: "50%", marginLeft: "40%" }}>No Data</p>
          </div>
        )}
      </>

      // </ResponsiveContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  rows: state.mapView.tableSummationData,
});

export default connect(mapStateToProps)(PieCharts);
