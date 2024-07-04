import { AppShell, Burger, Group, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";
// import { useRef } from "react";
import MapNew from "../../map/MapNew";
import ThemeSwitcher from "../Mantine/common/ThemeSwitcher";
<<<<<<< HEAD
import { HeaderTabs } from "../Mantine/common/HeaderTabs";
=======
import { HeaderTabs } from "../Mantine/Header/HeaderTabs";
>>>>>>> 6dda7f11b4f2482b170079027959d311cbefd76d

export function BasicAppShell() {
  const [opened, { toggle }] = useDisclosure();
  // const popUpRef = useRef(new maplibregl.Popup({ closeOnClick: false }));

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      aside={{
        width: 300,
        breakpoint: "md",
        collapsed: { desktop: false, mobile: true },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
<<<<<<< HEAD
          <MantineLogo size={30} />
          <ThemeSwitcher />
          {/* <HeaderTabs /> */}
=======
          <HeaderTabs w="100%" />
>>>>>>> 6dda7f11b4f2482b170079027959d311cbefd76d
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {/* Tailwind class example  */}
        <div className="text-red-300">Navbar</div>

        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt="sm" animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main p="0">
        <MapNew />
      </AppShell.Main>
      <AppShell.Aside p="md">Aside</AppShell.Aside>
      <AppShell.Footer p="md">Footer</AppShell.Footer>
    </AppShell>
  );
}
