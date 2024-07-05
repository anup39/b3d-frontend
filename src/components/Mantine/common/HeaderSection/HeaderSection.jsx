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
import LanguageSwitcher from "../../../LanguageSwitcher/LanguageSwitcher";

const HeaderSection = ({ activeTab, setActiveTab }) => {
  const [menu, setMenuOpened] = useState(false);
  return (
    <>
      <Flex style={{ padding: "0rem 2rem" }} direction={"column"}>
        <Flex align={"center"} h="100%" justify="space-between">
          <Image
            fit="contain"
            h={{
              mobileSmall: "14px",
              mobileMedium: "20px",
              sm: "24px",
              md: "32px",
            }}
            src={"src/assets/b3dLogo.svg"}
          ></Image>
          <Flex
            gap={{ mobileSmall: "0.5rem" }}
            justify={"space-between"}
            align={"center"}
          >
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
                <Image
                  h={{
                    mobileSmall: "24px",

                    md: "32px",
                  }}
                  fit="contain"
                  src={"/public/profileIcon.png"}
                ></Image>
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
    </>
  );
};

export default HeaderSection;
