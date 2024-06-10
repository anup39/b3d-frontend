import { useSelector } from "react-redux";
import AppBar from "../components/Common/AppBar";
import ClientCard from "../components/Client/ClientCard";
import ClientForm from "../components/Client/ClientForm";
import { useGetClientsQuery } from "../api/clientApi";

export default function Clients() {
  // const user_id = useSelector((state) => state.auth.user_id);
  const permissions = useSelector((state) => state.auth.role.permissions);
  // const group_name = useSelector((state) => state.auth.role.group_name);
  const client = useSelector((state) => state.auth.role.client);

  const { data: clients } = useGetClientsQuery(client);

  return (
    <div>
      <AppBar />
      {permissions && permissions.includes("add_client") ? (
        <ClientForm />
      ) : null}

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
