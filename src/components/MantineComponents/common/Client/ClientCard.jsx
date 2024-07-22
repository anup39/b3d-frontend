import { Button, Card, Grid, Group, Text } from "@mantine/core";
import ClientForm from "./ClientForm";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGetProjectsByClientIdQuery } from "../../../../api/projectApi";
import { useGetRasterDataByClientIdQuery } from "../../../../api/rasterDataApi";
import { useGetRolesDataByClientIdQuery } from "../../../../api/rolesApi";
import {
  setdeleteId,
  setdeletePopupMessage,
  setdeleteTarget,
  setshowDeleteLoader,
  setshowDeletePopup,
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../../../reducers/DisplaySettings";
import { useDisclosure, useHover } from "@mantine/hooks";

const ClientCard = ({ id, name }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const group_name = useSelector((state) => state.auth.role.group_name);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const permissions = useSelector((state) => state.auth?.role?.permissions);

  const { hovered, ref } = useHover();
  const [opened, { open, close }] = useDisclosure(false);

  const { data: projectsByClientId } = useGetProjectsByClientIdQuery(id);
  const { data: rasterDataByClientId } = useGetRasterDataByClientIdQuery({
    client: id,
  });
  const { data: rolesDataByClientId } = useGetRolesDataByClientIdQuery({
    client: id,
  });

  const handleViewInMap = () => {
    // dispatch(setshowMeasuringsPanel(false));
    // navigate(`/projects/${id}/Map`);
    window.location.replace(`/projects/${id}/Map`);
  };

  const handleDeleteClient = () => {
    // TODO: "When a client is deleted delete user roles, permissions and users related to this client";

    if (projectsByClientId) {
      const initiateDeleteProcess = () => {
        dispatch(setshowDeleteLoader(true));
        dispatch(setshowDeletePopup(true));
        dispatch(setdeleteId(null));
        dispatch(setdeleteTarget(null));
        dispatch(
          setdeletePopupMessage(
            `Are you sure you want to delete Client ${name} and its content?`
          )
        );
      };
      const resetDeleteProcess = (message, id = null, target = null) => {
        dispatch(setshowDeleteLoader(false));
        dispatch(setshowDeletePopup(true));
        dispatch(setdeleteId(id));
        dispatch(setdeleteTarget(target));
        dispatch(setdeletePopupMessage(message));
      };
      initiateDeleteProcess();

      if (projectsByClientId?.length > 0) {
        resetDeleteProcess(
          `You cannot delete this Client when there is Property?`
        );
      } else {
        resetDeleteProcess(
          `Are you sure you want to delete Client ${name} and its content?`,
          id,
          "clients"
        );
      }
    } else {
      dispatch(setshowToast(true));
      dispatch(settoastMessage("Failed to load total properties, Try again !"));
      dispatch(settoastType(error));
    }
  };

  return (
    <>
      <Grid.Col ref={ref} span={3}>
        <Card shadow="sm" component="a" target="_blank" className="w-[100%]">
          <Text fw={500} size="lg" mt="md">
            {name}
          </Text>

          <Text mt="xs" c="dimmed" size="sm">
            Total Properties : {projectsByClientId?.length}
          </Text>
          <Text mt="xs" c="dimmed" size="sm">
            Total Maps : {rasterDataByClientId?.length}
          </Text>
          <Text mt="xs" c="dimmed" size="sm">
            Total Users : {rolesDataByClientId?.length}
          </Text>
          {opened && (
            <ClientForm id={id} opened={opened} open={open} close={close} />
          )}
          {hovered && (
            <Group
              mt="md"
              style={{
                background: "#FFF",
                position: "absolute",
                top: 0,
                right: 20,
                bottom: 0,
                flexDirection: "column",
              }}
            >
              <Button
                fullWidth
                onClick={() => {
                  open();
                }}
              >
                Edit Client
              </Button>
              <Button fullWidth onClick={handleDeleteClient}>
                Delete Client
              </Button>
              <Button fullWidth onClick={handleViewInMap}>
                View in map
              </Button>
            </Group>
          )}
        </Card>
      </Grid.Col>
    </>
  );
};

export default ClientCard;
