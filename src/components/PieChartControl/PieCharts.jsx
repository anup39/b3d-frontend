import { PureComponent } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { connect } from "react-redux";

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
      <>
        {rows.length > 0 ? (
          <PieChart width={200} height={200}>
            <Pie
              data={rows}
              cx="50%"
              cy="50%"
              labelLine={false}
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
    );
  }
}

const mapStateToProps = (state) => ({
  rows: state.mapView.tableSummationData,
});

export default connect(mapStateToProps)(PieCharts);
