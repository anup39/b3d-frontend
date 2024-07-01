import { useSelector } from "react-redux";
import AppBar from "../components/Common/AppBar";
import ClientCard from "../components/Client/ClientCard";
import { useGetClientsQuery } from "../api/clientApi";
import { useState, useEffect } from "react";
import {
  CircularProgress,
  Typography,
  Box,
  Alert,
  AlertTitle,
} from "@mui/material";
import NewClientForm from "../components/Client/NewClientForm";

import { useTranslation } from "react-i18next";

export default function Clients() {
  const { t } = useTranslation();
  // const user_id = useSelector((state) => state.auth.user_id);
  const permissions = useSelector((state) => state.auth?.role?.permissions);
  // const group_name = useSelector((state) => state.auth.role.group_name);
  const client = useSelector((state) => state.auth?.role?.client);
  const [loading, setLoading] = useState(true);

  const { data: allClients, isLoading, error } = useGetClientsQuery(client);

  useEffect(() => {
    if (permissions) {
      setLoading(false);
    }
  }, [permissions]);

  if (loading || isLoading) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress></CircularProgress>
          <Typography>Loading</Typography>
        </Box>
      </Box>
    ); // or your loading spinner
  }

  return (
    <div>
      <AppBar />
      {error ? (
        <>
          <Alert severity="error">
            <AlertTitle>{error?.message ?? "Error"}</AlertTitle>
            Failed to fetch data&nbsp;:&nbsp;
            <strong>Please try refreshing page . .</strong>
          </Alert>
        </>
      ) : (
        <>
          <>
            {permissions && permissions.includes("add_client") && (
              <NewClientForm />
            )}
          </>
          <div style={{ backgroundColor: "#F2F6F8" }}>
            {allClients
              ? allClients.map((client) => (
                  <ClientCard
                    key={client.id}
                    id={client.id}
                    name={client.name}
                    description={client.description}
                    created_at={client.created_at}
                  />
                ))
              : null}
          </div>
        </>
      )}
    </div>
  );
}
