import { useSelector } from "react-redux";
import {
  CircularProgress,
  Typography,
  Box,
  Alert,
  AlertTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ClientForm from "../../common/Client/ClientForm";
import {
  useGetClientsByClientIdQuery,
  useGetClientsQuery,
} from "../../../../api/clientApi";
import ClientCard from "../../common/Client/ClientCard";
import { Grid } from "@mantine/core";

export default function Clients() {
  const { t } = useTranslation();
  const permissions = useSelector((state) => state.auth?.role?.permissions);
  const client = useSelector((state) => state.auth?.role?.client);

  const {
    data: allClients,
    isLoading: loadingAll,
    error: errorAll,
  } = useGetClientsQuery(client, {
    skip: !!client,
  });

  const {
    data: clientById,
    isLoading: loadingSingle,
    error: errorSingle,
  } = useGetClientsByClientIdQuery(
    { client_id: client },
    {
      skip: !client,
    }
  );

  const isLoading = loadingAll || loadingSingle;
  const error = errorAll || errorSingle;
  const data = client ? clientById : allClients;

  if (isLoading) {
    return (
      <Box sx={{ position: "fixed", top: "50%", left: "50%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress />
          <Typography>{t("Loading")}</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>{error?.message ?? "Error"}</AlertTitle>
        <strong>{t("Error") + " " + t("Loading") + " " + t("Data")}</strong>
      </Alert>
    );
  }

  return (
    <div>
      {permissions && permissions.includes("add_client") && <ClientForm />}
      <Grid mt="md">
        {data &&
          data.map((client) => {
            return (
              <ClientCard
                key={client.id}
                id={client.id}
                name={client.name}
                description={client.description}
                created_at={client.created_at}
              />
            );
          })}
      </Grid>
    </div>
  );
}
