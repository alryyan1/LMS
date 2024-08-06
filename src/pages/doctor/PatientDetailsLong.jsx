import { Autocomplete, Divider, Paper, Stack, TextField } from "@mui/material";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

function PatientDetailLong({
  patient,
}) {
  const { i18n } = useTranslation();

  const date = new Date(patient.created_at);

  return (
    <>
      <Paper
        style={i18n.language == "ar" ? { direction: "rtl" } : null}
        sx={{ backgroundColor: "#ffffffbb!important", p: 2,flexBasis:'300px' }}
        elevation={3}
      >
        {/* <Typography fontWeight={"bold"} sx={{ textAlign: "center", mb: 2 }}>
            تفاصيل المريض
          </Typography> */}
        {/** add card body   */}
        <div className="patientId">المعلومات الاساسيه</div>
        <div className="form-control">
          <div>{t("name")} </div>
          <div>{patient.name}</div>
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
              patient.gender
            }
          </div>
        </div>
        <div className="form-control">
          <div>القبيبه</div>

          <div>
         
          </div>
        </div>
        <div className="form-control">
          <div>الحاله</div>

          <div>
         
          </div>
        </div>
        <div className="form-control">
          <div>الجنسيه</div>

          <div>
         
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

        <Divider sx={{ m: 1 }} />
      </Paper>
    </>
  );
}

export default PatientDetailLong;
