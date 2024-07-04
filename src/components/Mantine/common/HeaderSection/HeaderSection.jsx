import {
  Container,
  Image,
  Flex,
  Burger,
  Menu,
  Button,
  Divider,
} from "@mantine/core";
import ThemeSwitcher from "../ThemeSwitcher";
import NavBar from "../Navbar/Navbar";
import { useState } from "react";

const HeaderSection = ({ activeTab, setActiveTab }) => {
  const [menu, setMenuOpened] = useState(false);
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Container width="100%" py="1rem">
        <Flex width="100%" direction={"column"}>
          <Flex align={"center"} h="100%" justify="space-between">
            <Image
              fit="contain"
              h={{
                xxs: "10px",
                exs: "24px",
                xs: "32px",
                sm: "30px",
                md: "40px",
              }}
              src={"src/assets/b3dLogo.svg"}
            ></Image>
            <Flex justify={"space-between"} align={"center"}>
              {/* <LanguageSwitcher /> */}
              <ThemeSwitcher />
              <Menu
                width={260}
                position="bottom-end"
                transitionProps={{ transition: "pop-top-right" }}
                onClose={() => setMenuOpened(false)}
                onOpen={() => setMenuOpened(true)}
                withinPortal
              >
                <Menu.Target>
                  <Button>Menu</Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Settings</Menu.Label>
                  <Menu.Item>Account settings</Menu.Item>
                  <Menu.Item>Change account</Menu.Item>
                  <Menu.Label>User Settings</Menu.Label>
                  <Menu.Item>Logout</Menu.Item>
                  <Menu.Divider />
                  <Menu.Label>Danger zone</Menu.Label>
                </Menu.Dropdown>
              </Menu>
            </Flex>
          </Flex>
          <Divider my="5px" />
          <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </Flex>
      </Container>
    </div>
  );
};

export default HeaderSection;
