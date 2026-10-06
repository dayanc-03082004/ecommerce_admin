import React, { useContext, useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { MyContext } from "../../App";
import UploadBox from "../../Components/UploadBox";

import {
  deleteImage,
  editData,
  fetchDataFromApi,
} from "../../../utils/api";

const EditBannerList2 = () => {
  const context = useContext(MyContext);
  const history = useNavigate();

  const [formFields, setFormFields] = useState({
    catId: "",
    bannerTitle: "",
    subCatId: "",
    thirdsubCatId: "",
    price: "",
    alignInfo: "",
    images: [],
  });

  const [productCat, setProductCat] = useState("");
  const [productSubCat, setProductSubCat] = useState("");
  const [productThirdLavelCat, setProductThirdLavelCat] = useState("");
  const [alignInfo, setAlignInfo] = useState("");

  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // =========================
  // GET BANNER DATA
  // =========================

  useEffect(() => {
    const id = context?.isOpenFullScreenPanel?.id;

    if (!id) return;

    fetchDataFromApi(`/api/bannerList2/${id}`).then((res) => {
      console.log("EDIT BANNER RESPONSE:", res);

      const banner = res?.banner;

      if (!banner) return;

      setFormFields({
        bannerTitle: banner?.bannerTitle || "",
        catId: banner?.catId || "",
        subCatId: banner?.subCatId || "",
        thirdsubCatId: banner?.thirdsubCatId || "",
        price: banner?.price || "",
        alignInfo: banner?.alignInfo || "",
        images: banner?.images || [],
      });

      setPreviews(banner?.images || []);

      setProductCat(banner?.catId || "");
      setProductSubCat(banner?.subCatId || "");
      setProductThirdLavelCat(banner?.thirdsubCatId || "");
      setAlignInfo(banner?.alignInfo || "");
    });
  }, [context?.isOpenFullScreenPanel?.id]);

  // =========================
  // INPUT CHANGE
  // =========================

  const onChangeInput = (e) => {
    const { name, value } = e.target;

    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // CATEGORY
  // =========================

  const handleChangeProductCat = (event) => {
    const value = event.target.value;

    setProductCat(value);

    setFormFields((prev) => ({
      ...prev,
      catId: value,
    }));
  };

  const handleChangeProductSubCat = (event) => {
    const value = event.target.value;

    setProductSubCat(value);

    setFormFields((prev) => ({
      ...prev,
      subCatId: value,
    }));
  };

  const handleChangeProductThirdLavelCat = (event) => {
    const value = event.target.value;

    setProductThirdLavelCat(value);

    setFormFields((prev) => ({
      ...prev,
      thirdsubCatId: value,
    }));
  };

  // =========================
  // ALIGN INFO
  // =========================

  const handleChangeAlignInfo = (event) => {
    const value = event.target.value;

    setAlignInfo(value);

    setFormFields((prev) => ({
      ...prev,
      alignInfo: value,
    }));
  };

  // =========================
  // UPLOAD IMAGE
  // =========================

  const setPreviewsFun = (previewsArr) => {
    setPreviews((prev) => {
      const newImages = [...prev, ...previewsArr];

      setFormFields((old) => ({
        ...old,
        images: newImages,
      }));

      return newImages;
    });
  };

  // =========================
  // REMOVE IMAGE
  // =========================

  const removeImg = (image, index) => {
    deleteImage(`/api/category/deleteImage?img=${image}`).then((res) => {
      setPreviews((prev) => {
        const newImages = prev.filter((_, i) => i !== index);

        setFormFields((old) => ({
          ...old,
          images: newImages,
        }));

        return newImages;
      });
    });
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.bannerTitle === "") {
      context.alertBox("error", "Please enter banner title");
      setIsLoading(false);
      return;
    }

    if (formFields.price === "") {
      context.alertBox("error", "Please enter price");
      setIsLoading(false);
      return;
    }

    if (previews?.length === 0) {
      context.alertBox("error", "Please select banner image");
      setIsLoading(false);
      return;
    }

    const id = context?.isOpenFullScreenPanel?.id;

    editData(`/api/bannerList2/${id}`, {
      ...formFields,
      images: previews,
    }).then((res) => {
      console.log("EDIT BANNER RESULT:", res);

      if (res?.error === false) {
        context.alertBox("success", "Banner updated successfully");

        setIsLoading(false);

        context.setIsOpenFullScreenPanel({
          open: false,
        });

        history("/bannerList2/list");
      } else {
        context.alertBox(
          "error",
          res?.message || "Banner could not be updated"
        );

        setIsLoading(false);
      }
    });
  };

  return (
    <section className="p-5 bg-gray-100">
      <form className="form py-3 p-8" onSubmit={handleSubmit}>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">

          {/* =========================
              FORM
          ========================= */}

          <div className="grid grid-cols-5 mb-3 gap-5">

            {/* Banner Title */}

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Banner Title
              </h3>

              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)]
                focus:outline-none focus:border-[rgba(0,0,0,0.5)]
                rounded-sm p-3 text-sm"
                name="bannerTitle"
                value={formFields.bannerTitle}
                onChange={onChangeInput}
              />
            </div>

            {/* Category */}

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Category
              </h3>

              <Select
                size="small"
                className="w-full"
                value={productCat}
                onChange={handleChangeProductCat}
                displayEmpty
              >
                <MenuItem value="">
                  Select Category
                </MenuItem>

                {context?.catData?.map((cat) => (
                  <MenuItem value={cat?._id} key={cat?._id}>
                    {cat?.name}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* Sub Category */}

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Sub Category
              </h3>

              <Select
                size="small"
                className="w-full"
                value={productSubCat}
                onChange={handleChangeProductSubCat}
                displayEmpty
              >
                <MenuItem value="">
                  Select Sub Category
                </MenuItem>

                {context?.catData?.map((cat) =>
                  cat?.children?.map((subCat) => (
                    <MenuItem
                      value={subCat?._id}
                      key={subCat?._id}
                    >
                      {subCat?.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </div>

            {/* Third Level */}

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Third Level Category
              </h3>

              <Select
                size="small"
                className="w-full"
                value={productThirdLavelCat}
                onChange={handleChangeProductThirdLavelCat}
                displayEmpty
              >
                <MenuItem value="">
                  Select Third Level Category
                </MenuItem>

                {context?.catData?.map((cat) =>
                  cat?.children?.map((subCat) =>
                    subCat?.children?.map((thirdCat) => (
                      <MenuItem
                        value={thirdCat?._id}
                        key={thirdCat?._id}
                      >
                        {thirdCat?.name}
                      </MenuItem>
                    ))
                  )
                )}
              </Select>
            </div>

            {/* Price */}

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Price
              </h3>

              <input
                type="number"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)]
                focus:outline-none focus:border-[rgba(0,0,0,0.5)]
                rounded-sm p-3 text-sm"
                name="price"
                value={formFields.price}
                onChange={onChangeInput}
              />
            </div>


            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Align Info
              </h3>

              <Select
                size="small"
                className="w-full"
                value={alignInfo}
                onChange={handleChangeAlignInfo}
                displayEmpty
              >

                <MenuItem value="left">
                  Left
                </MenuItem>

                <MenuItem value="right">
                  Right
                </MenuItem>
              </Select>
            </div>
          </div>

          <br />


          <h3 className="text-[14px] font-[500] mb-0 text-black">
            Image
          </h3>

          <br />

          <div className="grid grid-cols-7 gap-4">

            {previews?.map((image, index) => (
              <div
                className="uploadBoxWrapper relative"
                key={index}
              >
                <span
                  className="absolute w-[20px] h-[20px]
                  rounded-full overflow-hidden bg-red-700
                  -top-[5px] -right-[5px]
                  flex items-center justify-center
                  z-50 cursor-pointer"
                  onClick={() => removeImg(image, index)}
                >
                  <IoMdClose className="text-white text-[17px]" />
                </span>

                <div
                  className="uploadBox p-0 rounded-md
                  overflow-hidden border border-dashed
                  border-[rgba(0,0,0,0.3)]
                  h-[150px] w-full bg-gray-200
                  cursor-pointer hover:bg-gray-300
                  flex items-center justify-center
                  flex-col relative"
                >
                  <img
                    src={image}
                    alt="banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}

            <UploadBox
              multiple={true}
              name="images"
              url="/api/bannerList2/uploadImages"
              setPreviewsFun={setPreviewsFun}
            />

          </div>
        </div>

        <br />

        <div className="w-[250px]">
          <Button
            type="submit"
            className="btn-blue btn-lg w-full flex gap-2"
          >
            {isLoading ? (
              <CircularProgress color="inherit" />
            ) : (
              <>
                <FaCloudUploadAlt className="text-[25px] text-white" />
                Update and View
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default EditBannerList2;