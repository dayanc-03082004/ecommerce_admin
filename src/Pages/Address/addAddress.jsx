import React, { use, useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { fetchDataFromApi, postData } from "../../../utils/api";
import { MyContext } from "../../App";

const AddAddress = () => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [status, setStatus] = React.useState(false);

  const context = useContext(MyContext);

  const [fromFields, setFormFields] = useState({
    address_line1: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
    status: "",
    userId: "",
    selected: false
  });

  useEffect(() => {
    setFormFields((prevState) => ({
      ...prevState,
      userId: context?.userData?._id
    }));
  }, [context?.userData])
  
  useEffect(() => {
    fetchDataFromApi(`/api/address/get?${fromFields.userId}`).then((res) => {
          console.log(res)
        })
  },[])


  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
    setFormFields((prevState) => ({
      ...prevState,
      status: event.target.value,
    }));
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...fromFields,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (fromFields.address_line1 === "") {
      context.alertBox("error", "Please enter Address line 1");
      return false;
    }

    if (fromFields.city === "") {
      context.alertBox("error", "Please enter Your city name");
      return false;
    }

    if (fromFields.state === "") {
      context.alertBox("error", "Please enter your state");
      return false;
    }

    if (fromFields.pincode === "") {
      context.alertBox("error", "Please enter your pincode");
      return false;
    }

    if (fromFields.country === "") {
      context.alertBox("error", "Please enter your country");
      return false;
    }

    if (phone === "") {
      context.alertBox("error", "Please enter your 10 digit mobile number");
      return false;
    }

    console.log(fromFields);
    postData(`/api/address/add`, fromFields, { withCredentials: true }).then(
      (res) => {
        console.log(res);

        if (res?.error !== true) {
          setIsLoading(false);
          context.alertBox("success", res?.data?.message);

          context?.setIsOpenFullScreenPanel({
            open: false,
          });

          fetchDataFromApi(
                  `/api/address/get?userId=${context?.userData?._id}`,
                ).then((res) => {
                  context?.setAddress(res.data);
                });

        } else {
          context.alertBox("error", res?.data?.message);
          setIsLoading(false);
        }
      },
    );
  };
  return (
    <section className="p-5 bg-gray-100">
      <form className="form py-3 p-8" onSubmit={handleSubmit}>
        <div className="scroll  max-h-[72vh] overflow-y-scroll pr-4 pt-4">
          <div className="grid grid-cols-2 mb-3 gap-4">
            <div className="col w-[100%]">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Address Line 1
              </h3>
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)]
                    focus:outline-none focus:border-[rgba(0,0,0,0.5)] rounded-sm p-3 text-sm"
                name="address_line1"
                onChange={onChangeInput}
                value={fromFields.address_line1}
              />
            </div>
            <div className="col w-[100%]">
              <h3 className="text-[14px] font-[500] mb-1 text-black">City</h3>
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)]
                    focus:outline-none focus:border-[rgba(0,0,0,0.5)] rounded-sm p-3 text-sm"
                name="city"
                onChange={onChangeInput}
                value={fromFields.city}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 mb-3 gap-4">
            <div className="col w-[100%]">
              <h3 className="text-[14px] font-[500] mb-1 text-black">State</h3>
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)]
                    focus:outline-none focus:border-[rgba(0,0,0,0.5)] rounded-sm p-3 text-sm"
                name="state"
                onChange={onChangeInput}
                value={fromFields.state}
              />
            </div>
            <div className="col w-[100%]">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Pincode
              </h3>
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)]
                    focus:outline-none focus:border-[rgba(0,0,0,0.5)] rounded-sm p-3 text-sm"
                name="pincode"
                onChange={onChangeInput}
                value={fromFields.pincode}
              />
            </div>

            <div className="col w-[100%]">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Country
              </h3>
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)]
                    focus:outline-none focus:border-[rgba(0,0,0,0.5)] rounded-sm p-3 text-sm"
                name="country"
                onChange={onChangeInput}
                value={fromFields.country}
              />
            </div>

            <div className="col w-[100%]">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Mobile No
              </h3>
              <PhoneInput
                defaultCountry="tm"
                value={phone}
                disabled={isLoading === true ? true : false}
                onChange={(phone) => {
                  setPhone(phone);
                    setFormFields((prevState) => ({
                      ...prevState,
                      mobile: phone
                    }));
                }}
              />
            </div>

            <div className="col w-[100%]">
              <h3 className="text-[14px] font-[500] mb-1 text-black">Status</h3>
              <Select
                value={status}
                onChange={handleChangeStatus}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                size="small"
                className="w-full"
              >
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </div>
          </div>
          <br />
        </div>

        <br />
        <br />
        <div className="w-[250px]">
          <Button type="submit" className="btn-blue btn-lg w-full flex gap-2">
            <FaCloudUploadAlt className="text-[25px] text-white" />
            Publish and View
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AddAddress;
