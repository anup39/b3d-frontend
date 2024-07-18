import { Button, Card, Grid, Group, Text } from "@mantine/core";
import ClientForm from "./ClientForm";

const ClientCard = ({ id, name, description, created_at }) => {
  return (
    <>
      <Grid.Col span={3}>
        <Card shadow="sm" component="a" target="_blank" className="w-[100%]">
          <Text fw={500} size="lg" mt="md">
            {name}
          </Text>

          <Text mt="xs" c="dimmed" size="sm">
            Total Properties : 4
          </Text>
          <Text mt="xs" c="dimmed" size="sm">
            Total Maps : 14
          </Text>
          <Text mt="xs" c="dimmed" size="sm">
            Total Users : 2
          </Text>
          <Group mt="md">
            <ClientForm id={id} />
            <Button>Delete Client</Button>
          </Group>
        </Card>
      </Grid.Col>
    </>
  );
};

export default ClientCard;
