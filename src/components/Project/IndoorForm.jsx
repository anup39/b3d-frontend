import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  settoastType,
  settoastMessage,
  setshowToast,
} from "../../reducers/DisplaySettings";
import CircularProgress from "@mui/material/CircularProgress";

import {
  setOpenIndoorForm,
  setEditIndoorProjectId,
} from "../../reducers/Project";
import IndoorCard from "./IndoorCard";
import { setIndoors } from "../../reducers/Project";
import { useTranslation } from "react-i18next";
import {
  useCreateIndoorByProjectIdMutation,
  useGetIndoorByProjectIdQuery,
} from "../../api/indoorApi";

export default function IndoorForm({ client_id }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const openForm = useSelector((state) => state.project.openIndoorForm);
  const project_id = useSelector((state) => state.project.editIndoorProjectId);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const user_id = useSelector((state) => state.auth.user_id);
  const [createIndoorByProjectId] = useCreateIndoorByProjectIdMutation();

  const { data: indoorsByIdData, refetch } = useGetIndoorByProjectIdQuery({
    project_id,
  });

  useEffect(() => {
    if (project_id) {
      refetch();
    }
  }, [project_id, refetch]);

  useEffect(() => {
    if (indoorsByIdData) {
      dispatch(setIndoors(indoorsByIdData));
    }
    return () => {
      dispatch(setIndoors([]));
    };
  }, [indoorsByIdData, dispatch]);

  const closeForm = useCallback(() => {
    dispatch(setOpenIndoorForm(false));
    dispatch(setEditIndoorProjectId(null));
  }, [dispatch]);

  const handleCreateIndoor = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = {
      name: name,
      url: url,
      client: client_id,
      project: project_id,
      created_by: user_id,
      is_display: true,
    };
    createIndoorByProjectId({ data })
      .unwrap()
      .then((res) => {
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(
          settoastMessage(`${t("Successfully")} ${t("Created")} ${t("Indoor")}`)
        );
        dispatch(settoastType("success"));
        // closeForm();
      })
      .catch(() => {
        setLoading(false);
        dispatch(setshowToast(true));
        dispatch(
          settoastMessage(
            `${t("Failed")} ${t("To")} ${t("Create")} ${t("Indoor")}`
          )
        );
        dispatch(settoastType("error"));
      });
  };

  return (
    <>
      {openForm ? (
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
            onSubmit={handleCreateIndoor}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "700px",
              background: "#fff",
              padding: "20px",
              zIndex: 10000,
              borderRadius: "10px",
              maxHeight: 500,
              overflow: "scroll",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} display={"flex"} gap={1} alignItems={"center"}>
                <TextField
                  required
                  placeholder={t("Name")}
                  onChange={(e) => setName(e.target.value)}
                ></TextField>
                <TextField
                  fullWidth
                  required
                  placeholder={t("URL")}
                  onChange={(e) => setUrl(e.target.value)}
                ></TextField>

                <Button
                  //   fullWidth

                  sx={{ pl: 4, pr: 3, height: 50 }}
                  type="submit"
                  variant={loading ? "outlined" : "contained"}
                >
                  {loading ? null : `${t("Add")} ${t("URL")}`}
                  {loading ? <CircularProgress /> : null}
                </Button>
              </Grid>

              <Grid item xs={12}>
                {indoorsByIdData?.length > 0 ? (
                  <>
                    {indoorsByIdData?.map((indoor) => (
                      <IndoorCard key={indoor.id} indoor={indoor} />
                    ))}
                  </>
                ) : (
                  <>
                    <Typography sx={{ ml: "41%" }}>
                      {t("No") + " " + t("Indoors") + " " + t("Yet")}
                    </Typography>
                  </>
                )}
              </Grid>

              <Grid item xs={12}>
                <Button
                  sx={{ ml: "45%" }}
                  onClick={closeForm}
                  variant="contained"
                  color="error"
                  size="small"
                  //   fullWidth
                >
                  {t("Close")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      ) : null}
    </>
  );
}

IndoorForm.propTypes = {
  client_id: PropTypes.string,
};
