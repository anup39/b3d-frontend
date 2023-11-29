import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setclients } from "../reducers/Client";
import axios from "axios";
import AppBar from "../components/Common/AppBar";
import ClientCard from "../components/Client/ClientCard";
import ClientForm from "../components/Client/ClientForm";

export default function Clients() {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.client.clients);
  // const user_id = useSelector((state) => state.auth.user_id);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/clients/`, {})
      .then((res) => {
        dispatch(setclients(res.data));
      });
  }, [dispatch]);

  return (
    <div>
      <AppBar />
      <ClientForm />
      <div style={{ backgroundColor: "#F2F6F8" }}>
        {clients
          ? clients.map((client) => (
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
