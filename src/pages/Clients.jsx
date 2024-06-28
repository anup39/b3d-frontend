import { useDispatch, useSelector } from "react-redux";
import AppBar from "../components/Common/AppBar";
import ClientCard from "../components/Client/ClientCard";
import { useGetClientsQuery } from "../api/clientApi";
import { useState, useEffect } from "react";
import { CircularProgress, Typography, Box } from "@mui/material";
import NewClientForm from "../components/Client/NewClientForm";
import { setclients } from "../reducers/Client";
import axios from "axios";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../reducers/DisplaySettings";
import { useTranslation } from "react-i18next";
import { fetchClientDetailsByClientId } from "../api/api";

export default function Clients() {
  const { t } = useTranslation();
  // const user_id = useSelector((state) => state.auth.user_id);
  const permissions = useSelector((state) => state.auth?.role?.permissions);
  // const group_name = useSelector((state) => state.auth.role.group_name);
  const client = useSelector((state) => state.auth?.role?.client);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  // const { clients: allClients } = useSelector((state) => state.client);
  const { isClientUpdated } = useSelector((state) => state.client);

  const { data: allClients } = useGetClientsQuery(client);

  console.log(client);
  useEffect(() => {
    if (!client) {
      axios
        .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/clients/`)
        .then((res) => {
          dispatch(setclients(res.data));
        })
        .catch((error) => {
          const error_message = error.response.data.message;
          setLoading(false);
          dispatch(setshowToast(true));
          dispatch(
            settoastMessage(
              error_message
                ? error_message
                : `${t("Failed")} +" "+ ${t("To")} +" "+ ${t(
                    "Fetch"
                  )} + " "+ ${t("Clients")}`
            )
          );
          dispatch(settoastType("error"));
        });
    } else {
      const results = fetchClientDetailsByClientId(client);
      if (results) {
        setLoading(false);
        dispatch(setclients(results));
      } else {
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(
          settoastMessage(
            `${t("Failed")} +" "+ ${t("To")} +" "+ ${t("Fetch")} + " "+ ${t(
              "Clients"
            )}`
          )
        );
        dispatch(settoastType("error"));
      }
    }
  }, [isClientUpdated, t, dispatch, client]);

  useEffect(() => {
    if (permissions) {
      setLoading(false);
    }
  }, [permissions]);

  if (loading) {
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
      {permissions && permissions.includes("add_client") ? (
        <NewClientForm />
      ) : null}

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
    </div>
  );
}
