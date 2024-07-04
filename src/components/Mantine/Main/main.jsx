import { Tabs } from "@mantine/core";
import MapNew from "../../../map/MapNew";

const Main = ({ activeTab }) => {
  return (
    <Tabs value={activeTab}>
      <Tabs.Panel value="Map">
        <div style={{ height: "600px", width: "100%" }}>
          <MapNew />
        </div>
      </Tabs.Panel>
      <Tabs.Panel h value="Clients">
        <div style={{ height: "600px", width: "100%", background: "#38806b" }}>
          Clients
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="Classifications">
        <div style={{ height: "600px", width: "100%", background: "#38806b" }}>
          Classification panel
        </div>
      </Tabs.Panel>
    </Tabs>
  );
};

export default Main;
