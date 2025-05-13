import axios from "axios";
import { useContext, useState } from "react";
import { user } from "../types/Types";
import { userContext } from "../context/userContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { CircularProgress } from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../styles/Register.css";

const schema = yup.object().shape({
  UserName: yup.string().required("יש להזין שם משתמש"),
  Password: yup.string().min(8, "סיסמה חייבת להכיל לפחות 8 תווים").required("יש להזין סיסמה"),
  Name: yup.string().required("יש להזין שם מלא"),
  Phone: yup.string().matches(/\d{10}/, "מספר טלפון חייב להיות בן 10 ספרות").required("יש להזין טלפון"),
  Email: yup.string().email("כתובת אימייל לא תקינה").required("יש להזין אימייל"),
  Tz: yup.string().length(9, "תעודת זהות חייבת להכיל 9 ספרות").required("יש להזין תעודת זהות"),
});

const Register = () => {
  const { setMyUser } = useContext(userContext);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSend = async (data: any) => {
    setLoading(true);
    try {
      const sendData: user = {
        Id: 0,
        UserName: data.UserName,
        Password: data.Password,
        Name: data.Name,
        Phone: data.Phone,
        Email: data.Email,
        Tz: data.Tz,
      };

      const res = await axios.post<user>("http://localhost:8080/api/user/sighin", sendData, {
        headers: { "Content-Type": "application/json" },
      });

      setMsg("נרשמת בהצלחה");
      setMyUser(res.data);
      reset();
      // nav("/home");
    } catch (error: any) {
      console.log("שגיאה מהשרת:", error.response?.data);

      if (error.response?.data?.includes("UserName")) {
        setError("UserName", { message: "שם המשתמש כבר קיים" });
      } else if (error.response?.data?.includes("Email")) {
        setError("Email", { message: "אימייל כבר קיים במערכת" });
      } else if (error.response?.data?.includes("Phone")) {
        setError("Phone", { message: "מספר טלפון כבר קיים במערכת" });
      } else if (error.response?.data?.includes("Tz")) {
        setError("Tz", { message: "תעודת זהות כבר רשומה" });
      } else {
        setMsg("אירעה שגיאה, נסי שוב");
      }
    }
    setLoading(false);
  };


  return (
    <>
      <div className="register-container">
        {msg != '' && <div style={{ color: "red", fontSize: "18px", padding: "10px" }}>{msg}</div>}

        <form className="register-form" onSubmit={handleSubmit(onSend)}>
          <h2>הרשמה</h2>
          <input {...register("UserName")} placeholder="שם משתמש" />
          <p>{errors.UserName?.message}</p>
          <input {...register("Password")} placeholder="סיסמה" type="password" />
          <p>{errors.Password?.message}</p>
          <input {...register("Name")} placeholder="שם מלא" />
          <p>{errors.Name?.message}</p>
          <input {...register("Phone")} placeholder="טלפון" />
          <p>{errors.Phone?.message}</p>
          <input {...register("Email")} placeholder="אימייל" />
          <p>{errors.Email?.message}</p>
          <input {...register("Tz")} placeholder="תעודת זהות" />
          <p>{errors.Tz?.message}</p>
          <button type="submit" disabled={!isValid || loading}>
            {loading ? <CircularProgress size={24} /> : "Click"}
          </button>
          {errors.UserName?.message === "המשתמש כבר רשום במערכת" && (
            <Link to="/Login">להתחברות הקליקו כאן👇</Link>
          )}
        </form>
      </div>
    </>
  );
};

export default Register;
