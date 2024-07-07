import { Tabs, Button, Flex, Drawer, Group } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

const NavBar = ({ activeTab, setActiveTab }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const isMd = useMediaQuery("(max-width: 768px)");

  const tabs = ["Clients", "Classifications", "Map"];

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab}>
      {tab}
    </Tabs.Tab>
  ));

  return (
    <div>
      <Group>
        <Drawer
          opened={opened}
          onClose={close}
          title="Nav"
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        >
          <Flex w="100%" direction={"column"} justify={"space-between"}>
            <Group>
              <Tabs
                m="0"
                variant="outline"
                value={activeTab}
                onChange={setActiveTab}
                defaultValue="Map"
              >
                <Tabs.List>{items}</Tabs.List>
              </Tabs>
            </Group>
          </Flex>
        </Drawer>
        {isMd && <Button onClick={open}>Open Menu</Button>}
      </Group>
      {!isMd && (
        <Flex w="100%" justify={"space-between"}>
          <Group>
            <Tabs
              m="0"
              value={activeTab}
              onChange={setActiveTab}
              defaultValue="Map"
            >
              <Tabs.List>{items}</Tabs.List>
            </Tabs>
          </Group>
        </Flex>
      )}
    </div>
  );
};

export default NavBar;
