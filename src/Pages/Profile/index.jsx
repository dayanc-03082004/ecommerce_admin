import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { FaCloudUploadAlt } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import {
  editData,
  fetchDataFromApi,
  postData,
  uploadImage,
} from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Collapse } from "react-collapse";
import Radio from "@mui/material/Radio";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const Profile = () => {
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [address, setAddress] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [userId, setUserId] = useState("");
  const [isChangePasswordFormShow, setisChangePasswordFormShow] =
    useState(false);
  const [phone, setPhone] = useState("");

  const [fromFields, setFormFields] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [changePassword, setChangePassword] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  const [selectedValue, setSelectedValue] = useState('')

  const handleChange = (event) => {
    setSelectedValue(event.target.value)
  }

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token === null) {
      history("/login");
    }
  }, [context?.isLogin]);

  useEffect(() => {
    if (context?.userData?._id !== "" && context?.userData?._id !== undefined) {
      fetchDataFromApi(
        `/api/address/get?userId=${context?.userData?._id}`,
      ).then((res) => {
        setAddress(res.data);
        context?.setAddress(res.data);
      });

      setUserId(context?.userData?._id);
      setFormFields({
        name: context?.userData?.name,
        email: context?.userData?.email,
        mobile: context?.userData?.mobile,
      });

      const ph = `"${context?.userData?.mobile}"`;

      setPhone(ph);

      setChangePassword({
        email: context?.userData?.email,
      });
    }
  }, [context?.userData]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...fromFields,
        [name]: value,
      };
    });

    setChangePassword(() => {
      return {
        ...fromFields,
        [name]: value,
      };
    });
  };

  const valideValue = Object.values(fromFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (fromFields.name === "") {
      context.alertBox("error", "Please enter full name");
      return false;
    }

    if (fromFields.email === "") {
      context.alertBox("error", "Please enter email id");
      return false;
    }

    if (fromFields.mobile === "") {
      context.alertBox("error", "Please enter mobile number");
      return false;
    }
    editData(`/api/user/${userId}`, fromFields, { withCredentials: true }).then(
      (res) => {
        if (res?.error !== true) {
          setIsLoading(false);
          context.alertBox("success", res?.data?.message);
        } else {
          context.alertBox("error", res?.data?.message);
          setIsLoading(false);
        }
      },
    );
  };

  const valideValue2 = Object.values(fromFields).every((el) => el);

  const handleSubmitChangePassword = (e) => {
    e.preventDefault();

    setIsLoading2(true);

    if (changePassword.oldPassword === "") {
      context.alertBox("error", "Please enter old password");
      return false;
    }

    if (changePassword.newPassword === "") {
      context.alertBox("error", "Please enter new password");
      return false;
    }

    if (changePassword.confirmPassword === "") {
      context.alertBox("error", "Please enter confirm password");
      return false;
    }

    if (changePassword.confirmPassword !== changePassword.newPassword) {
      context.alertBox("error", "Password and confirm password not match");
      return false;
    }
    postData(`/api/user/reset-password`, changePassword, {
      withCredentials: true,
    }).then((res) => {
      if (res?.error !== true) {
        setIsLoading2(false);
        context.alertBox("success", res?.message);
      } else {
        context.alertBox("error", res?.message);
        setIsLoading2(false);
      }
    });
  };

  useEffect(() => {
    const userAvatar = [];
    if (
      context?.userData?.avatar !== "" &&
      context?.userData?.avatar !== undefined
    ) {
      userAvatar.push(context?.userData?.avatar);
      setPreviews(userAvatar);
    }
  }, [context?.userData]);

  let selectedImages = [];

  const formdata = new FormData();

  const onChangeFile = async (e, apiEndPoint) => {
    try {
      setPreviews([]);
      const files = e.target.files;
      setUploading(true);
      console.log(files);

      for (var i = 0; i < files.length; i++) {
        if (
          files[i] &&
          (files[i].type === "image/jpeg" ||
            files[i].type === "image/jpg" ||
            files[i].type === "image/png" ||
            files[i].type === "image/webp")
        ) {
          const file = files[i];
          selectedImages.push(file);
          formdata.append(`avatar`, file);
        } else {
          context.alertBox(
            "error",
            "Please select a valid JPG, PNG or WEBP image file.",
          );
          setUploading(false);
          return false;
        }
      }

      uploadImage("/api/user/user-avatar", formdata).then((res) => {
        setUploading(false);
        let avatar = [];
        avatar.push(res?.data?.avatar);
        setPreviews(avatar);
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="card my-4 pt-5 w-[65%] shadow-md sm:rounded-lg bg-white px-5 pb-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-[600]">User Profile</h2>

          <Button
            className="!ml-auto"
            onClick={() =>
              setisChangePasswordFormShow(!isChangePasswordFormShow)
            }
          >
            Change Password
          </Button>
        </div>
        <br />

        <div
          className="w-[110px] h-[110px] rounded-full overflow-hidden mb-4 relative group
                flex items-center justify-center bg-gray-200"
        >
          {uploading === true ? (
            <CircularProgress color="inherit" />
          ) : (
            <>
              {previews?.length !== 0 ? (
                previews?.map((img, index) => {
                  return (
                    <img
                      src={img}
                      key={index}
                      className="w-full h-full object-cover"
                    />
                  );
                })
              ) : (
                <img src={"/user.png"} className="w-full h-full object-cover" />
              )}
            </>
          )}

          <div
            className="overlay w-[100%] h-[100%] absolute top-0 left-0 z-50 
                                bg-[rgba(0,0,0,0.7)] flex items-center justify-center cursor-pointer opacity-0
                                transition-all group-hover:opacity-100"
          >
            <FaCloudUploadAlt className="text-[#fff] text-[25px]" />
            <input
              type="file"
              className="w-full h-full absolute top-0 left-0 opacity-0"
              accept="image/*"
              onChange={(e) => onChangeFile(e, "/api/user/user-avatar")}
              name="avatar"
            />
          </div>
        </div>

        <form className="form mt-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-5">
            <div className="w-[50%]">
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)]
                    focus:outline-none focus:border-[rgba(0,0,0,0.5)] rounded-sm p-3 text-sm"
                name="name"
                value={fromFields.name}
                disabled={isLoading === true ? true : false}
                onChange={onChangeInput}
              />
            </div>

            <div className="w-[50%]">
              <input
                type="email"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)]
                    focus:outline-none focus:border-[rgba(0,0,0,0.5)] rounded-sm p-3 text-sm"
                name="email"
                value={fromFields.email}
                disabled={true}
                onChange={onChangeInput}
              />
            </div>
          </div>

          <div className="flex items-center mt-4 gap-5">
            <div className="w-[50%]">
              <PhoneInput
                defaultCountry="tm"
                value={phone}
                disabled={isLoading === true ? true : false}
                onChange={(phone) => {
                  setPhone(phone);
                  setFormFields({
                    mobile: phone,
                  });
                }}
              />
            </div>
            <div className="w-[50%]"></div>
          </div>

          <br />

          <div
            className="flex items-center justify-center p-5 border border-dashed
            border-[rgba(0,0,0,0.2)] bg-[#f1f1f1] hover:bg-[#e7f3f9] cursor-pointer"
            onClick={() =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add New Address",
              })
            }
          >
            <span className="text-[14px] font-[500]">Add Address</span>
          </div>
          <div className="flex gap-2 flex-col mt-4">
            {context?.address?.length > 0 &&
              address?.map((address, index) => {
                return (
                  <>
                    <label
                      className="border border-dashed
            border-[rgba(0,0,0,0.2)] addressBox w-full flex items-center justify-center bg-[#f1f1f1] p-3 rounded-md cursor-pointer"
                    >
                      <Radio {...label} name="address" checked={
                        selectedValue === 
                        (address?._id)
                      }
                        value={address?._id} onChange={handleChange} />
                      <span className="text-[12px]">
                        {address?.address_line1 + " " +
                        address?.city + " " +
                        address?.country + " " +
                        address?.state + " " +
                        address?.pincode}
                      </span>
                    </label>
                  </>
                );
              })}
          </div>

          <br />

          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={!valideValue}
              className="btn-blue btn-lg w-full"
            >
              {isLoading === true ? (
                <CircularProgress color="inherit" />
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </form>
      </div>

      <Collapse isOpened={isChangePasswordFormShow}>
        <div className="card w-[65%] bg-white p-5 shadow-md rounded-md">
          <div className="flex items-center pb-3">
            <h2 className="text-[18px] font-[600] pb-0">Change Password</h2>
          </div>
          <hr />

          <form className="mt-8" onSubmit={handleSubmitChangePassword}>
            <div className="flex items-center gap-5">
              <div className="w-[50%]">
                <TextField
                  label="Old Password"
                  variant="outlined"
                  size="small"
                  className="w-full"
                  name="oldPassword"
                  value={changePassword.oldPassword}
                  disabled={isLoading2 === true ? true : false}
                  onChange={onChangeInput}
                />
              </div>

              <div className="w-[50%]">
                <TextField
                  type="text"
                  label="New Password"
                  variant="outlined"
                  size="small"
                  className="w-full"
                  name="newPassword"
                  value={changePassword.newPassword}
                  onChange={onChangeInput}
                />
              </div>
            </div>

            <div className="flex items-center mt-4 gap-5">
              <div className="w-[50%]">
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  size="small"
                  className="w-full"
                  name="confirmPassword"
                  value={changePassword.confirmPassword}
                  onChange={onChangeInput}
                />
              </div>
              <div className="w-[50%]"></div>
            </div>

            <br />

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={!valideValue2}
                className="btn-blue btn-lg w-[100%]"
              >
                {isLoading2 === true ? (
                  <CircularProgress color="inherit" />
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Collapse>
    </>
  );
};

export default Profile;
