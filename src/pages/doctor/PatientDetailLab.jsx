import { Divider, Paper,  } from "@mui/material";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

function PatientDetailLab({
  patient
}) {
  const { i18n } = useTranslation();

  const date = new Date(patient.created_at);

  return (
    <>
      <Paper
        style={i18n.language == "ar" ? { direction: "rtl" } : null}
        sx={{ backgroundColor: "#ffffffbb!important", p: 2 ,flexBasis:'300px'}}
        elevation={3}
      >
        {/* <Typography fontWeight={"bold"} sx={{ textAlign: "center", mb: 2 }}>
            تفاصيل المريض
          </Typography> */}
        {/** add card body   */}
        <div className="patientId"> معلومات المختبر</div>
        <div className="form-control">
          <div> سحب العينه</div>
          <div></div>
        </div>
        <Divider />
        <div className="form-control">
          <div>زمن سحب العينه</div>
          <div></div>
        </div>
        <Divider />

        <div className="form-control">
          <div> طباعه النتيجه</div>
          <div></div>
        </div>
        <Divider />
        
        <div className="form-control">
          <div> زمن طباعه  النتيجه</div>
          <div></div>
        </div>
        <div className="form-control">
          <div>    تم تحقيق  بواسطه</div>
          <div></div>
        </div>
        <Divider />
        <Divider sx={{ m: 1 }} />
      </Paper>
    </>
  );
}

export default PatientDetailLab;
