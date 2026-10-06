import React, { use, useContext, useState } from "react";
import { Button, Tooltip } from "@mui/material";
import { IoMdAdd } from "react-icons/io";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Progress from "../../Components/ProgressBar";
import { AiOutlineEdit } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";
import SearchBox from "../../Components/SearchBox";
import { MyContext } from "../../App";
import { useEffect } from "react";
import {
  deleteData,
  deleteMultipleData,
  fetchDataFromApi,
} from "../../../utils/api";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const columns = [
  { id: "image", label: "IMAGE", minWidth: 150 },
  { id: "action", label: "Action", minWidth: 100 },
];

export const HomeSliderBanners = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [slidesData, setSlidesData] = useState([]);
  const [sortedIds, setSortedIds] = useState([]);

  const context = useContext(MyContext);

  useEffect(() => {
    getData();
  }, [context?.setIsOpenFullScreenPanel]);

  const getData = () => {
    fetchDataFromApi("/api/homeSlides").then((res) => {
      setSlidesData(res?.data);
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const deleteSlide = (id) => {
    deleteData(`/api/homeSlides/${id}`).then((res) => {
      context.alertBox("success", "Slides deleted");
      getData();
    });
  };

  return (
    <>
      <div className="flex items-center justify-between px-2 py-0 mt-3">
        <h2 className="text-[18px] font-[600]">
          Home Slider Banners
          <span className="font-[400] text-[14px]"></span>
        </h2>

        <div className="col w-[25%] ml-auto flex items-center justify-end gap-3">
          {sortedIds?.length !== 0 && (
            <Button
              variant="contained"
              className="btn-sm"
              size="small"
              color="error"
              onClick={deleteMultipleProduct}
            >
              Delete
            </Button>
          )}
          <Button
            className="btn-blue !text-white btn-sm"
            onClick={() =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add Home Slide",
              })
            }
          >
            Add Home Slide
          </Button>
        </div>
      </div>

      <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">
        <br />

        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    width={column.minWidth}
                    key={column.id}
                    align={column.align}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {slidesData?.length !== 0 &&
                slidesData?.map((item, index) => {
                  return (
                    <TableRow>
                      <TableCell width={300}>
                        <div className="flex items-center gap-4 w-[300px]">
                          <div className="img w-full rounded-md overflow-hidden group">
                            <img
                              src={item.images[0]}
                              className="w-full group-hover:scale-105 transition-all"
                            />
                          </div>
                        </div>
                      </TableCell>

                      <TableCell width={100}>
                        <div className="flex items-center gap-1">
                          <Tooltip title="Edit Product" placement="top">
                            <Button
                              className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border
                                 !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#e4e4e4] !min-w-[35px]"
                            >
                              <AiOutlineEdit className="text-[rgba(0,0,0,0.9)] text-[20px]" />
                            </Button>
                          </Tooltip>

                          <Tooltip title="Remove Product" placement="top">
                            <Button
                              className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border
                                 !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#e4e4e4] !min-w-[35px]"
                              onClick={() => deleteSlide(item?._id)}
                            >
                              <GoTrash className="text-[rgba(0,0,0,0.9)] text-[18px]" />
                            </Button>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={10}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
};

export default HomeSliderBanners;
