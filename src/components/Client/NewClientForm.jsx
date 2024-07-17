import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { fetchClientDetailsByClientId } from "../../api/api";
import PropTypes from "prop-types";
import {
  useCreateClientMutation,
  useGetClientsByClientIdQuery,
  useUpdateClientByIdMutation,
} from "../../api/clientApi";

NewClientForm.defaultProps = {
  id: null,
  closeEditForm: null,
};

NewClientForm.propTypes = {
  id: PropTypes.number,
  closeEditForm: PropTypes.func,
};

export default function NewClientForm({ id, closeEditForm }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(id ? true : false);
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState(null);
  const user_id = useSelector((state) => state.auth.user_id);

  const [updateClientById] = useUpdateClientByIdMutation();
  const [createClient] = useCreateClientMutation();
  const { refetch: refetchClientsById } = useGetClientsByClientIdQuery(
    {
      client_id: id,
    },
    { skip: !id }
  );

  const closeForm = useCallback(() => {
    if (closeEditForm) {
      closeEditForm();
    }
    setIsFormOpen(false);
  }, [closeEditForm]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      refetchClientsById()
        .unwrap()
        .then((response) => {
          setLoading(false);
          setClientData(response[0]);
        })
        .catch((error) => {
          const error_message = error?.message;
          setLoading(false);
          dispatch(setshowToast(true));
          dispatch(
            settoastMessage(
              error_message
                ? error_message
                : `${t("Failed")} +" "+ ${t("To")} +" "+ ${t(
                    "Fetch"
                  )} + " "+ ${t("Client")} + " " + ${t("Data")}`
            )
          );
          dispatch(settoastType("error"));
          closeForm();
        });
    }
  }, [id, closeForm, dispatch, t]);

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
          closeForm();
          setLoading(false);
        })
        .catch((error) => {
          const { error: error_message } = error;
          setLoading(false);
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
    [createClient, dispatch, t, user_id, closeForm]
  );

  const editClient = useCallback(
    (data) => {
      updateClientById({ data: data, client_id: id })
        .unwrap()
        .then(() => {
          dispatch(setshowToast(true));
          dispatch(
            settoastMessage(
              `${t("Client")} ${t("Edited")} ${t("Successfully")}`
            )
          );
          dispatch(settoastType("success"));
          closeForm();
          setLoading(false);
        })
        .catch((error) => {
          const { error: error_message } = error;
          setLoading(false);
          dispatch(setshowToast(true));
          dispatch(
            settoastMessage(
              error_message
                ? error_message
                : `${t("Failed")} +" "+ ${t("To")} +" "+ ${t(
                    "Edit"
                  )} + " "+ ${t("Client")}`
            )
          );
          dispatch(settoastType("error"));
        });
    },
    [updateClientById, dispatch, t, id, closeForm]
  );

  const handleCreateClient = useCallback(
    (event) => {
      event.preventDefault();
      setLoading(true);
      const data_ = new FormData(event.currentTarget);
      if (id) {
        editClient(data_);
      } else {
        createNewClient(data_);
      }
      setClientData(null);
    },
    [id, editClient, createNewClient]
  );

  const openForm = () => {
    setIsFormOpen(true);
  };

  return (
    <>
      {!id && (
        <Tooltip title={t("Create") + " " + t("Client")}>
          <Button
            onClick={openForm}
            sx={{ margin: "5px" }}
            variant="contained"
            color="error"
          >
            {t("Create") + " " + t("Client")}
          </Button>
        </Tooltip>
      )}
      {isFormOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <form
            onSubmit={handleCreateClient}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "300px",
              background: "#fff",
              padding: "20px",
              zIndex: 10000,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label={t("Name")}
                  name="name"
                  autoComplete="name"
                  autoFocus
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={clientData?.name || ""}
                  onChange={(e) =>
                    setClientData({ ...clientData, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="administrator"
                  name="administrator"
                  label={t("Administrator")}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={clientData?.administrator || ""}
                  onChange={(e) =>
                    setClientData({
                      ...clientData,
                      administrator: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="lbf_number"
                  name="lbf_number"
                  label={t("LBF-Number")}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={clientData?.lbf_number || ""}
                  onChange={(e) =>
                    setClientData({ ...clientData, lbf_number: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="cvr_number"
                  name="cvr_number"
                  label={t("CVR-Number")}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={clientData?.cvr_number || ""}
                  onChange={(e) =>
                    setClientData({ ...clientData, cvr_number: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant={loading ? "outlined" : "contained"}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading
                    ? null
                    : t(`${id ? "Update" : "Create"}`) + " " + t("Client")}
                  {loading ? <CircularProgress /> : null}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={closeForm}
                  variant="contained"
                  color="error"
                  size="small"
                  fullWidth
                >
                  {t("Cancel")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      )}
    </>
  );
}
