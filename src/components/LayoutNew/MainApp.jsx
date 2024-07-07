import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import HeaderSection from "../MantineComponents/Header/Header";
import { useState } from "react";
import MainSection from "../MantineComponents/MainSection/MainSection";

export function MainApp() {
  const [opened, { toggle }] = useDisclosure();
  const [activeTab, setActiveTab] = useState("Map");

  return (
    <AppShell
      px={{ mobileSmall: "1rem", lg: "1rem", xl: "2rem" }}
      header={{ height: "110px" }}
    >
      <HeaderSection
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isNavBurgerVisible={open}
        toggle={toggle}
      />
      <AppShell.Main>
        <MainSection activeTab={activeTab} />
      </AppShell.Main>
    </AppShell>
  );
}
