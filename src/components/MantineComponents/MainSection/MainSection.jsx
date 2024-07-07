import { Tabs } from "@mantine/core";
import MapNew from "../../../map/MapNew";

const MainSection = ({ activeTab }) => {
  return (
    <Tabs value={activeTab}>
      <Tabs.Panel w={"100%"} value="Map">
        <div style={{ height: "500px", border: "1px solid red" }}>
          <MapNew />
        </div>
      </Tabs.Panel>
      <Tabs.Panel w={"100%"} value="Clients">
        <div style={{ height: "100%", border: "1px solid red" }}>Clients</div>
      </Tabs.Panel>
      <Tabs.Panel w={"100%"} value="Classifications">
        <div style={{ height: "100%", border: "1px solid red" }}>
          Classifications
        </div>
      </Tabs.Panel>
    </Tabs>
  );
};

export default MainSection;
