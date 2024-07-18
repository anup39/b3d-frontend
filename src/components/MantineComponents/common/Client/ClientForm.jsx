import React, { useCallback, useEffect, useState } from "react";
import { Form, useForm } from "@mantine/form";
import { Button, Group, TextInput } from "@mantine/core";
import CustomModal from "../CustomModal";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateClientMutation,
  useUpdateClientByIdMutation,
} from "../../../../api/clientApi";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { fetchClientDetailsByClientId } from "../../../../api/api";

const ClientForm = () => {
  const id = 133;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [clientData, setClientData] = useState(null);
  const user_id = useSelector((state) => state.auth.user_id);

  const [updateClientById] = useUpdateClientByIdMutation();
  const [createClient] = useCreateClientMutation();
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      administrator: "",
      lbf_number: "",
      cvr_number: "",
    },
  });

  useEffect(() => {
    if (id) {
      fetchClientDetailsByClientId(id)
        .then((response) => {
          form.setValues({
            name: response.name,
            administrator: response.administrator,
            lbf_number: response.lbf_number,
            cvr_number: response.cvr_number,
          });
        })
        .catch((error) => {
          const error_message = error?.message;
          notifications.show({
            title: "Oops!!",
            message: error_message ?? "Failed to load client details",
            color: "red",
          });
        });
    }
  }, [id, dispatch, t, opened]);

  console.log(clientData);

  const createNewClient = useCallback(
    (data) => {
      data.append("created_by", user_id);
      data.append("is_display", true);
      createClient({ data: data })
        .unwrap()
        .then(() => {
          notifications.show({
            title: "Success",
            message: "Successfully created client",
            color: "green",
          });
        })
        .catch((error) => {
          const { error: error_message } = error;
          notifications.show({
            title: "Oops!!",
            message: error_message ?? "Failed to create client",
            color: "red",
          });
        });
    },
    [createClient, dispatch, t, user_id]
  );

  const editClient = useCallback(
    (data) => {
      updateClientById({ data: data, client_id: id })
        .unwrap()
        .then(() => {
          notifications.show({
            title: "Success",
            message: "Successfully edited client details",
            color: "green",
          });
        })
        .catch((error) => {
          const { error: error_message } = error;
          notifications.show({
            title: "Oops!!",
            message: error_message ?? "Failed to load client details",
            color: "red",
          });
        });
    },
    [updateClientById, dispatch, t, id]
  );

  const handleSubmit = useCallback(
    (close) => {
      const values = form.getValues();
      const data_ = new FormData();
      Object.keys(values).forEach((key) => {
        data_.append(key, values[key]);
      });
      if (id) {
        editClient(data_);
      } else {
        createNewClient(data_);
      }
      form.reset();
      close();
    },
    [id, close, editClient, createNewClient]
  );

  return (
    <CustomModal
      opened={opened}
      open={open}
      close={close}
      buttonContent="Create Client"
      title="Client Details"
    >
      {/* <Form
        onSubmit={() => {
          handleSubmit();
        }}
      > */}
      <TextInput
        label="Name"
        placeholder="Name"
        key={form.key("name")}
        {...form.getInputProps("name")}
      />
      <TextInput
        mt="sm"
        label="Administrator"
        placeholder="Administrator"
        key={form.key("administrator")}
        {...form.getInputProps("administrator")}
      />
      <TextInput
        mt="sm"
        label="LBF-Number"
        placeholder="LBF-Number"
        key={form.key("lbf_number")}
        {...form.getInputProps("lbf_number")}
      />
      <TextInput
        mt="sm"
        label="CVR-Number"
        placeholder="CVR-Number"
        key={form.key("cvr_number")}
        {...form.getInputProps("cvr_number")}
      />

      <Group justify="center" mt="md">
        <Button
          w="100%"
          type="submit"
          onClick={() => {
            handleSubmit(close);
          }}
        >
          {id ? "Edit Client" : "Create Client"}
        </Button>
        <Button w="100%" bg="red" onClick={close}>
          Cancel
        </Button>
      </Group>
      {/* </Form> */}
    </CustomModal>
  );
};

export default ClientForm;
