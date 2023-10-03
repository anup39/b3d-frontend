import { useParams } from "react-router-dom";

export default function ManageClasses() {
  const { id } = useParams();
  return <div>ManageClasses: {id}</div>;
}
