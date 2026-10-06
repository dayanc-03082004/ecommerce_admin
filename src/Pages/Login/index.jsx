import { Button } from "@mui/material";
import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CgLogIn } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa6";
import LoadingButton from "@mui/lab/LoadingButton";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "../../App.jsx";
import { postData } from "../../../utils/api.js";


const Login = () => {
  const [loadingGoogle, setLoadingGoogle] = React.useState(false);
  const [loadingFb, setLoadingFb] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isPasswordShow, setisPasswordShow] = useState(false);
  const [formFields, setFormsFields] = useState({
    email: "",
    password: "",
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  function handleClickGoogle() {
    setLoadingGoogle(true);
  }

  function handleClickFb() {
    setLoadingFb(true);
  }

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormsFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const valideValue = Object.values(formFields).every((el) => el);

  const forgotPassword = () => {
      if (formFields.email === "") {
        context.alertBox("error", "Please enter email id");
        return false;
      } else {
        context.alertBox("success", `OTP send to ${formFields.email}`);
        localStorage.setItem("userEmail", formFields.email);
        localStorage.setItem("actionType", "forgot-password");
  
        postData("/api/user/forgot-password", {
          email: formFields.email,
        }).then((res) => {
          if (res?.error === false) {
            context.alertBox("success", res?.message);
            history("/verify-account");
          } else {
            context.alertBox("error", res?.message);
          }
        });
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      setIsLoading(true);
  
      if (formFields.email === "") {
        context.alertBox("error", "Please enter email id");
        return false;
      }
  
      if (formFields.password === "") {
        context.alertBox("error", "Please enter password");
        return false;
      }
      postData("/api/user/login", formFields, { withCredentials: true }).then(
        (res) => {
  
          if (res?.error !== true) {
            setIsLoading(false);
            context.alertBox("success", res?.message);
            setFormsFields({
              email: "",
              password: "",
            });
  
            localStorage.setItem("accessToken", res?.data?.accessToken);
            localStorage.setItem("refreshToken", res?.data?.refreshToken);
  
            context.setIsLogin(true);
  
            history("/");
          } else {
            context.alertBox("error", res?.message);
            setIsLoading(false);
          }
        },
      );
    };

  return (
    <section className=" bg-white w-full">
      <header className="w-full static lg:fixed top-0 left-0 px-4 py-3 flex items-center justify-center sm:justify-between z-50">
        <Link to="/">
          <img src="/logo-full.png" className="w-[200px]" />
        </Link>

        <div className="hidden sm:flex items-center gap-0">
          <NavLink to="/login" exact={true} activeClassName="isActive">
            <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1">
              <CgLogIn className="text-[18px]" /> Login
            </Button>
          </NavLink>

          <NavLink to="/sign-up" exact={true} activeClassName="isActive">
            <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1">
              <FaRegUser className="text-[15px]" /> Sign Up
            </Button>
          </NavLink>
        </div>
      </header>
      <img src="/patern.jpg" className="w-full fixed top-0 left-0 opacity-5" />

      <div className="loginBox card w-full md:w-[600px] h-[auto] pb-20 mx-auto pt-5 lg:pt-20 relative z-50">
        <div className="text-center">
          <img src="logo-full.png" className="m-auto" />
        </div>

        <h1 className="text-center text-[18px] sm:text-[35px] font-[800] mt-4">
          Welcome Back!
          <br />
          Sign in with your credentials.
        </h1>

        <div className="flex items-center justify-center w-full mt-5 gap-4">
          <LoadingButton
            size="small"
            onClick={handleClickGoogle}
            endIcon={<FcGoogle />}
            loading={loadingGoogle}
            loadingPosition="end"
            variant="outlined"
            className="!bg-none !py-2 !text-[15px] !capitalize !px-5 !text-[rgba(0,0,0,0.7)]"
          >
            Signin with Google
          </LoadingButton>

          <LoadingButton
            size="small"
            onClick={handleClickFb}
            endIcon={<BsFacebook />}
            loading={loadingFb}
            loadingPosition="end"
            variant="outlined"
            className="!bg-none !py-2 !text-[15px] !capitalize !px-5 !text-[rgba(0,0,0,0.7)]"
          >
            Signin with Facebook
          </LoadingButton>
        </div>

        <br />

        <div className="w-full flex items-center justify-center gap-3">
          <span className="flex items-center w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]"></span>
          <span className="text-[10px] lg:text-[14px] font-[500]">
            Or, Sign in with your email
          </span>
          <span className="flex items-center w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]"></span>
        </div>

        <br />

        <form className="w-full px-8 mt-3" onSubmit={handleSubmit}>
          <div className="form-group mb-4 w-full">
            <h4 className="text-[14px] font-[500] mb-1">Email</h4>
            <input
              type="email"
              className="w-full h-[50px] border border-[rgba(0,0,0,0.3)] rounded-sm
              focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
              name="email"
              value={formFields.email}
              disabled={isLoading === true ? true : false}
              onChange={onChangeInput}
            />
          </div>

          <div className="form-group mb-4 w-full">
            <h4 className="text-[14px] font-[500] mb-1">Password</h4>
            <div className="relative w-full">
              <input
                type={isPasswordShow === false ? "password" : "text"}
                className="w-full h-[50px] border border-[rgba(0,0,0,0.3)] rounded-sm
              focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                name="password"
                value={formFields.password}
                disabled={isLoading === true ? true : false}
                onChange={onChangeInput}
              />
              <Button
                className="!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px]
              !h-[35px] !min-w-[35px] !text-gray-600"
                onClick={() => setisPasswordShow(!isPasswordShow)}
              >
                {isPasswordShow === false ? (
                  <FaRegEye className="text-[18px]" />
                ) : (
                  <FaEyeSlash className="text-[18px]" />
                )}
              </Button>
            </div>
          </div>

          <div className="form-group mb-4 w-full flex items-center justify-between">
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Remember Me"
            />

            <a
              onClick={forgotPassword}
              className="text-primary font-[700] text-[15px] hover:underline
                      hover:text-gray-700 cursor-pointer"
            >
              Forgot Password?
            </a>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px]">Don't have an account?</span>
            <Link to="/sign-up"
              className="text-primary font-[700] text-[15px] hover:underline
                      hover:text-gray-700 cursor-pointer"
            >
              Sign Up
            </Link>
            </div>

          <Button type="submit" disabled={!valideValue} className="btn-lg btn-blue w-full">
            {isLoading === true ? (
                  <CircularProgress color="inherit" />
                ) : (
                  "Sign In"
                )}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Login;
