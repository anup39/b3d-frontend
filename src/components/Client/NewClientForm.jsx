import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setclients } from "../../reducers/Client";
import { setIsClientUpdated } from "../../reducers/Client";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { fetchClientDetailsByClientId } from "../../api/api";

export default function NewClientForm({ id, closeEditForm }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(id ? true : false);
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState(null);
  const user_id = useSelector((state) => state.auth.user_id);
  const { isClientUpdated } = useSelector((state) => state.client);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchClientDetailsByClientId(id)
        .then((response) => {
          setLoading(false);
          setClientData(response);
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
  }, [id]);

  const createClient = (data) => {
    data.append("created_by", user_id);
    data.append("is_display", true);
    axios
      .post(`${import.meta.env.VITE_API_DASHBOARD_URL}/clients/`, data)
      .then((res) => {
        dispatch(settoastType("success"));
        closeForm();
        setLoading(false);
        dispatch(setIsClientUpdated(!isClientUpdated));
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
                  "Create"
                )} + " "+ ${t("Client")}`
          )
        );
        dispatch(settoastType("error"));
      });
  };

  const editClient = (data) => {
    axios
      .patch(`${import.meta.env.VITE_API_DASHBOARD_URL}/clients/${id}/`, data)
      .then((res) => {
        dispatch(settoastType("success"));
        closeForm();
        setLoading(false);
        dispatch(setIsClientUpdated(!isClientUpdated));
      })
      .catch((error) => {
        console.error("Patch request error:", error);
        const error_message = error.message;
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(
          settoastMessage(
            error_message
              ? error_message
              : `${t("Failed")} +" "+ ${t("To")} +" "+ ${t("Edit")} + " "+ ${t(
                  "Client"
                )}`
          )
        );
        dispatch(settoastType("error"));
      });
  };

  const handleCreateClient = (event) => {
    event.preventDefault();
    setLoading(true);
    const data_ = new FormData(event.currentTarget);
    if (id) {
      editClient(data_);
    } else {
      createClient(data_);
    }
    setClientData(null);
    axios
      .get(`${import.meta.env.VITE_API_DASHBOARD_URL}/clients/`)
      .then((res) => {
        dispatch(setclients(res.data));
      })
      .catch((err) => {
        const error_message = error.response.data.message;
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(
          settoastMessage(
            error_message
              ? error_message
              : `${t("Failed")} +" "+ ${t("To")} +" "+ ${t("Fetch")} + " "+ ${t(
                  "Clients"
                )}`
          )
        );
        dispatch(settoastType("error"));
      });
  };

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    closeEditForm && closeEditForm();
    setIsFormOpen(false);
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
                <TextField
                  id="description"
                  name="description"
                  label={t("Description")}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                  value={clientData?.description || ""}
                  onChange={(e) =>
                    setClientData({
                      ...clientData,
                      description: e.target.value,
                    })
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
