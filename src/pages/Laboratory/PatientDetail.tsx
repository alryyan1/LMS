import { Autocomplete, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import axiosClient from "../../../axios-client";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { DoctorShift, DoctorVisit } from "../../types/Patient";
import i18n from "i18next";


interface PatientDetailProps {
  patient: DoctorVisit,
  openedDoctors: DoctorShift[],
  activeShift: DoctorShift,
  copyPatient?: boolean,
  settings: any,
  user: any,
  update: (patient: DoctorVisit) => void
}
function PatientDetail({
  patient,
  openedDoctors,
  activeShift,
  copyPatient = false,
  settings,
  user,
  update
}: PatientDetailProps) {
  const { t } = useTranslation('PatientDetails');
  console.log(patient, 'patient in details')
  const date = new Date(patient.created_at);

  return (
    <>
      <Paper
        style={i18n.language == "ar" ? { direction: "rtl" } : null}
        elevation={3}
        className="bolder"
        sx={{ p: 1, maxWidth: '300px' }}
      >
        {/* <Typography fontWeight={"bold"} sx={{ textAlign: "center", mb: 2 }}>
          تفاصيل المريض
        </Typography> */}
        {/** add card body   */}
        <Typography className="text-center p-name mb-1"  variant="h6">{patient.patient.name}</Typography>
        <div className="form-control">
          <div>Visit Id</div>
          <div >{patient.id}</div>
        </div>
        <Divider />
        <div className="form-control">
          <div>{t("doctor")}</div>
          <div>{patient.patient?.doctor?.name}</div>
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
              patient.patient.phone
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
              patient.patient.user?.username
            }
          </div>
        </div>
        <Divider />
        <div className="form-control">
          <div>{t("gender")}</div>

          <div>
            {
              //print iso date

              t(patient.patient.gender)
            }
          </div>
        </div>
        <Divider />
        <div className="form-control">
          <div>{t('fileId')} </div>

          <div>
            {
              //print iso date
              patient?.file?.id
            }
          </div>
        </div>
        <Divider />
        <div className="form-control">
          <div>{t("age")}</div>

          <div>
            {
              //print iso date
              ` ${patient.patient.age_year ?? 0} Y ${
              patient.patient.age_month == null
                ? ""
                : " / " + patient.patient.age_month + " M "
              } ${
              patient.patient.age_day == null ? "" : " / " + patient.patient.age_day + " D "
              } `
            }
          </div>
        </div>
        <Divider />
        {settings?.gov ? <div className="form-control">
          <div>{t('govermentId')}</div>

          <div>
            {
              //print iso date
              patient.patient?.gov_id
            }
          </div>
        </div> : ''}
        <Divider />
        <div className="form-control">
          <div>{t('address')}</div>

          <div>
            {
              //print iso date
              patient.patient?.address
            }
          </div>
        </div>
        <Divider />
        {settings?.country ? <div className="form-control">
          <div>{t('country')}</div>

          <div>
            {
              //print iso date
              patient.patient?.country?.name
            }
          </div>
        </div> : ''}
        {patient.patient.company_id && (
          <div>
            <div className="form-control">
              <div>{t("company")}</div>

              <div>
                {
                  //print iso date
                  patient.patient.company.name
                }
              </div>
            </div>
            <div className="form-control">
              <div>{t("cardNo")}</div>

              <div>
                {
                  //print iso date
                  patient.patient.insurance_no
                }
              </div>
            </div>
            {
              //print iso date
              patient.patient.subcompany_id && (
                <div className="form-control">
                  <div>{t("sub_company")}</div>

                  <div>
                    {
                      //print iso date
                      patient.patient?.subcompany?.name
                    }
                  </div>
                </div>
              )
            }
            {
              //print iso date
              patient.patient.company_relation_id && (
                <div className="form-control">
                  <div>{t("relation_name")}</div>

                  <div>
                    {
                      //print iso date
                      patient.patient?.relation?.name
                    }
                  </div>
                </div>
              )
            }
          </div>
        )}
        {
          //print iso date
          patient.patient.result_print_date && (
            <div className="form-control">
              <div>{t("print_time")}</div>
              <div>
                {
                  //print iso date
                  new Date(patient.patient.result_print_date).toLocaleTimeString()
                }
              </div>
            </div>
          )
        }
        <Divider sx={{ m: 1 }} />
        {copyPatient && patient.patient.doctor_id == activeShift?.doctor.id && (
          <Autocomplete
            onChange={(e, data) => {
              axiosClient
                .post(`patient/copy/${data.id}?patient_id=${patient.id}`, {

                })
                .then(({ data }) => {
                  // update(data);
                  if (data.status) {
                    // alert('status')
                  }
                });
            }}
            getOptionDisabled={(option) => {
              return option.id == patient.patient.doctor.id;
            }}
            getOptionKey={(op) => op.id}
            getOptionLabel={(option) => option.name}
            options={openedDoctors.filter((shift) => shift.user_id == user?.id).map((shift) => {
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