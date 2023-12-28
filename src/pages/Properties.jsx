import { useParams } from "react-router-dom";
import AppBar from "../components/Common/AppBar";
import UploadProgress from "../components/Property/UploadProgress";
import PropertyContainer from "../components/Property/PropertyContainer";
import AddPropertyButton from "../components/Property/AddPropertyButton";
import UploadPropertyForm from "../components/Property/UploadPropertyForm";
import { useSelector } from "react-redux";

export default function Properties() {
  const { client_id } = useParams();
  const { project_id } = useParams();
  const showTifUpload = useSelector(
    (state) => state.displaySettings.showTifUpload
  );
  const showProgressFormOpen = useSelector(
    (state) => state.property.showProgressFormOpen
  );

  // const [isProgressFormOpen, setIsProgressFormOpen] = useState(false);
  // const [progress, setProgress] = useState(0);

  // const onProgressForm = (value) => {
  //   setIsProgressFormOpen(value);
  // };

  // const onProgressValue = (value) => {
  //   setProgress(value);
  // };

  return (
    <>
      <AppBar></AppBar>
      <AddPropertyButton />
      {showTifUpload ? (
        <UploadPropertyForm project_id={project_id} client_id={client_id} />
      ) : null}
      {showProgressFormOpen ? <UploadProgress /> : null}
      <PropertyContainer project_id={project_id} />
    </>
  );
}
