import { Autocomplete, Divider, Paper, Stack, TextField } from "@mui/material";
import axiosClient from "../../../axios-client";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

function PatientDetail({
  patient,
  openedDoctors,
  setUpdate,
  activeShift,
  copyPatient = false,
  settings,
}) {
  const { i18n } = useTranslation();

  const date = new Date(patient.created_at);

  return (
    <>
      <Paper
        style={i18n.language == "ar" ? { direction: "rtl" } : null}
        elevation={3}
        className="bolder"
        sx={{p:1,minWidth:'300px'}}
      >
        {/* <Typography fontWeight={"bold"} sx={{ textAlign: "center", mb: 2 }}>
          تفاصيل المريض
        </Typography> */}
        {/** add card body   */}
        <div  className="patientId">{patient.name}</div>
        <div className="form-control">
          <div>Patient Id</div>
          <div >{patient.id}</div>
        </div>
        <Divider />
        <div className="form-control">
          <div>{t("doctor")}</div>
          <div>{patient?.doctor?.name}</div>
        </div>
        <Divider />

        <div className="form-control">
          <div>{t("date")}</div>

          <div>
            {
              //print iso date
              date.toLocaleDateString()
            }
          </div>
        </div>
        <Divider />
        <div className="form-control">
          <div>{t("phone")}</div>

          <div>
            {
              //print iso date
              patient.phone
            }
          </div>
        </div>
        <Divider />
        <div className="form-control">
          <div>{t("time")}</div>

          <div>
            {
              //print iso date
              date.toLocaleTimeString()
            }
          </div>
        </div>
        <Divider />
        <div className="form-control">
          <div> {t("registered_by")}</div>

          <div>
            {
              //print iso date
              patient.user?.username
            }
          </div>
        </div>
        <Divider />
        <div className="form-control">
          <div>{t("gender")}</div>

          <div>
            {
              //print iso date
             
              t( patient.gender)
            }
          </div>
        </div>
        <Divider />
        <div className="form-control">
          <div>{t('fileId')} </div>

          <div>
            {
              //print iso date
              patient?.file_patient?.file_id
            }
          </div>
        </div>
        <Divider />
        <div className="form-control">
          <div>{t("age")}</div>

          <div>
            {
              //print iso date
              ` ${patient.age_year ?? 0} Y ${
                patient.age_month == null
                  ? ""
                  : " / " + patient.age_month + " M "
              } ${
                patient.age_day == null ? "" : " / " + patient.age_day + " D "
              } `
            }
          </div>
        </div>
        <Divider />
        {settings?.gov ? <div className="form-control">
          <div>{t('govId')}</div>

          <div>
            {
              //print iso date
              patient?.gov_id
            }
          </div>
        </div> : ''}
        <Divider />
        <div className="form-control">
          <div>{t('address')}</div>

          <div>
            {
              //print iso date
              patient?.address
            }
          </div>
        </div>
        <Divider />
        {settings?.country ?  <div className="form-control">
          <div>{t('country')}</div>

          <div>
            {
              //print iso date
              patient?.country?.name
            }
          </div>
        </div>: ''}
        {patient.company_id && (
          <div>
            <div className="form-control">
              <div>{t("company")}</div>

              <div>
                {
                  //print iso date
                  patient.company.name
                }
              </div>
            </div>
            <div className="form-control">
              <div>{t("cardNo")}</div>

              <div>
                {
                  //print iso date
                  patient.insurance_no
                }
              </div>
            </div>
            {
              //print iso date
              patient.subcompany_id && (
                <div className="form-control">
                  <div>{t("sub_company")}</div>

                  <div>
                    {
                      //print iso date
                      patient?.subcompany?.name
                    }
                  </div>
                </div>
              )
            }
            {
              //print iso date
              patient.company_relation_id && (
                <div className="form-control">
                  <div>{t("relation_name")}</div>

                  <div>
                    {
                      //print iso date
                      patient?.relation?.name
                    }
                  </div>
                </div>
              )
            }
          </div>
        )}
        {
          //print iso date
          patient.result_print_date && (
            <div className="form-control">
              <div>{t("print_time")}</div>
              <div>
                {
                  //print iso date
                  new Date(patient.result_print_date).toLocaleTimeString()
                }
              </div>
            </div>
          )
        }
        <Divider sx={{ m: 1 }} />
        {copyPatient && patient.doctor_id == activeShift.doctor.id && (
          <Autocomplete
            onChange={(e, data) => {
              axiosClient
                .post(`patient/copy/${data.id}/${patient.id}/${true}`)
                .then(({ data }) => {
                 
                  if (data.status) {
                    // alert('status')
                    setUpdate((prev) => prev + 1);
                  }
                });
            }}
            getOptionDisabled={(option) => {
              return option.id == patient.doctor.id;
            }}
            getOptionKey={(op) => op.id}
            getOptionLabel={(option) => option.name}
            options={openedDoctors.map((shift) => {
              return shift.doctor;
            })}
            //fill isOptionEqualToValue

            isOptionEqualToValue={(option, val) => option.id === val.id}
            renderInput={(params) => {
              //

              return <TextField {...params} label={t("copy_patient")} />;
            }}
          />
        )}
      </Paper>
    </>
  );
}

export default PatientDetail;
