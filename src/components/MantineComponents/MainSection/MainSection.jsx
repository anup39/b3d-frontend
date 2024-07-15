import { Tabs } from "@mantine/core";
import MapNew from "../../../map/MapNew";
import LayoutRouters from "../LayoutRouters/LayoutRouters";
import ClientCard from "../common/Client/ClientCard";

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
        <div style={{ height: "100%", border: "1px solid red" }}>Clients</div>
      </Tabs.Panel>
      <Tabs.Panel w={"100%"} value="Classifications">
        <div style={{ height: "100%", border: "1px solid red" }}>
          <ClientCard />
        </div>
      </Tabs.Panel>
    </Tabs>
  );
};

export default MainSection;
