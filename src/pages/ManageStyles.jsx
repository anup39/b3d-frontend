import { useParams } from "react-router-dom";

export default function ManageStyles() {
  const { id } = useParams();
  return <div>ManageStyles for {id}</div>;
}
