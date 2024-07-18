import { Tabs } from "@mantine/core";
import MapNew from "../../../map/MapNew";
import LayoutRouters from "../LayoutRouters/LayoutRouters";
import ClientCard from "../common/Client/ClientCard";
import ClientForm from "../common/Client/ClientForm";

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
          <ClientForm />
        </div>
      </Tabs.Panel>
      <Tabs.Panel w={"100%"} value="Classifications">
        <div>
          <ClientCard />
        </div>
      </Tabs.Panel>
    </Tabs>
  );
};

export default MainSection;
