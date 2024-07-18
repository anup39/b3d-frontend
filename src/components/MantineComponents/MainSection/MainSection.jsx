import { Tabs } from "@mantine/core";
import MapNew from "../../../map/MapNew";
import LayoutRouters from "../LayoutRouters/LayoutRouters";
import Clients from "./pages/Clients";

const MainSection = ({ activeTab }) => {
  return (
    // This is main section, we render each route component
    // <LayoutRouters />
    <Tabs value={activeTab}>
      <Tabs.Panel w={"100%"} value="Map">
        <div style={{ height: "500px", border: "1px solid red" }}>
          <MapNew />
        </div>
      </Tabs.Panel>
      <Tabs.Panel w={"100%"} value="Clients">
        <div>
          <Clients />
        </div>
      </Tabs.Panel>
      <Tabs.Panel w={"100%"} value="Classifications">
        <div>Classifications</div>
      </Tabs.Panel>
    </Tabs>
  );
};

export default MainSection;
