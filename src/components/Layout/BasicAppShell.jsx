import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import HeaderSection from "../Mantine/common/HeaderSection/HeaderSection";
import { useState } from "react";
import Main from "../Mantine/Main/main";

export function BasicAppShell() {
  const [opened, { toggle }] = useDisclosure();
  const [activeTab, setActiveTab] = useState("Map");

  return (
    <AppShell header={{ height: "110px" }}>
      <AppShell.Header>
        <HeaderSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isNavBurgerVisible={open}
          toggle={toggle}
        />
      </AppShell.Header>
      <AppShell.Main>
        <Main activeTab={activeTab} />
      </AppShell.Main>
      <AppShell.Footer>Footer</AppShell.Footer>
    </AppShell>
  );
}
