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
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../../../reducers/DisplaySettings";
import { useDisclosure } from "@mantine/hooks";

const ClientForm = () => {
  const id = undefined;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(id ? true : false);
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState(null);
  const user_id = useSelector((state) => state.auth.user_id);

  const [updateClientById] = useUpdateClientByIdMutation();
  const [createClient] = useCreateClientMutation();
  const [opened, { open, close }] = useDisclosure(false);

  // const closeForm = useCallback(() => {
  //   if (closeEditForm) {
  //     closeEditForm();
  //   }
  //   setIsFormOpen(false);
  // }, [closeEditForm]);

  // useEffect(() => {
  //   if (id) {
  //     setLoading(true);
  //     fetchClientDetailsByClientId(id)
  //       .then((response) => {
  //         setLoading(false);
  //         setClientData(response);
  //       })
  //       .catch((error) => {
  //         const error_message = error?.message;
  //         setLoading(false);
  //         dispatch(setshowToast(true));
  //         dispatch(
  //           settoastMessage(
  //             error_message
  //               ? error_message
  //               : `${t("Failed")} +" "+ ${t("To")} +" "+ ${t(
  //                   "Fetch"
  //                 )} + " "+ ${t("Client")} + " " + ${t("Data")}`
  //           )
  //         );
  //         dispatch(settoastType("error"));
  //         closeForm();
  //       });
  //   }
  // }, [id, closeForm, dispatch, t]);

  const createNewClient = useCallback(
    (data) => {
      data.append("created_by", user_id);
      data.append("is_display", true);
      createClient({ data: data })
        .unwrap()
        .then(() => {
          dispatch(setshowToast(true));
          dispatch(
            settoastMessage(
              `${t("Client")} ${t("Created")} ${t("Successfully")}`
            )
          );
          dispatch(settoastType("success"));
        })
        .catch((error) => {
          const { error: error_message } = error;
          dispatch(setshowToast(true));
          dispatch(
            settoastMessage(
              error_message
                ? error_message
                : `${t("Failed")} +" "+ ${t("To")} +" "+ ${t(
                    "Create"
                  )} + " "+ ${t("Client")}`
            )
          );
          dispatch(settoastType("error"));
        });
    },
    [createClient, dispatch, t, user_id]
  );

  // const editClient = useCallback(
  //   (data) => {
  //     updateClientById({ data: data, client_id: id })
  //       .unwrap()
  //       .then(() => {
  //         dispatch(setshowToast(true));
  //         dispatch(
  //           settoastMessage(
  //             `${t("Client")} ${t("Edited")} ${t("Successfully")}`
  //           )
  //         );
  //         dispatch(settoastType("success"));
  //         closeForm();
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         const { error: error_message } = error;
  //         setLoading(false);
  //         dispatch(setshowToast(true));
  //         dispatch(
  //           settoastMessage(
  //             error_message
  //               ? error_message
  //               : `${t("Failed")} +" "+ ${t("To")} +" "+ ${t(
  //                   "Edit"
  //                 )} + " "+ ${t("Client")}`
  //           )
  //         );
  //         dispatch(settoastType("error"));
  //       });
  //   },
  //   [updateClientById, dispatch, t, id, closeForm]
  // );

  const handleCreateClient = useCallback(
    (event) => {
      event.preventDefault();
      // setLoading(true);
      const data_ = new FormData(form.getValues());
      if (id) {
        editClient(data_);
      } else {
        createNewClient(data_);
      }
      setClientData(null);
    },
    [id, createNewClient]
  );

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      administrator: "",
      lbf_number: "",
      cvr_number: "",
    },
  });

  const handleSubmit = () => {
    const values = form.getValues();
    const data_ = new FormData();
    Object.keys(values).forEach((key) => {
      data_.append(key, values[key]);
    });
    createNewClient(data_);
    form.reset();
  };

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
            handleSubmit();
          }}
        >
          Create Client
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
