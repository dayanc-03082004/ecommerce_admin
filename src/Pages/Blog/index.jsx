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
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import { MyContext } from "../../App";
import { useEffect } from "react";
import {
  deleteData,
  deleteMultipleData,
  fetchDataFromApi,
} from "../../../utils/api";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const columns = [
  { id: "image", label: "IMAGE", minWidth: 100 },
  { id: "title", label: "TITLE", minWidth: 200 },
  { id: "description", label: "DESCRIPTION", minWidth: 300 },
  { id: "action", label: "Action", minWidth: 100 },
];

export const BlogList = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [blogData, setBlogData] = useState([]);
  const [sortedIds, setSortedIds] = useState([]);

  const context = useContext(MyContext);

  useEffect(() => {
    getData();
  }, [context?.setIsOpenFullScreenPanel]);

  const getData = () => {
    fetchDataFromApi("/api/blog").then((res) => {
      setBlogData(res?.blogs);
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
    deleteData(`/api/blog/${id}`).then((res) => {
      context.alertBox("success", "Blog deleted");
      getData();
    });
  };

  return (
    <>
      <div className="flex items-center justify-between px-2 py-0 mt-3">
        <h2 className="text-[18px] font-[600]">
          Blog List
          <span className="font-[400] text-[14px]"></span>
        </h2>

        <div className="col w-[25%] ml-auto flex items-center justify-end gap-3">
          <Button
            className="btn-blue !text-white btn-sm"
            onClick={() =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add Blog",
              })
            }
          >
            Add Blog
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
              {blogData?.length !== 0 &&
                blogData?.map((item, index) => {
                  return (
                    <TableRow key={index}>
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

                      <TableCell width={200}>
                        <span className="text-[15px] font-[500]">
                          {item?.title}
                        </span>
                      </TableCell>

                      <TableCell width={300}>
                        {item?.description
                          ?.replace(/<[^>]*>/g, "")
                          ?.slice(0, 150)}
                        ...
                      </TableCell>

                      <TableCell width={100}>
                        <div className="flex items-center gap-1">
                          <Tooltip title="Edit Product" placement="top">
                            <Button
                              className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border
                                 !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#e4e4e4] !min-w-[35px]"
                              onClick={() =>
                                context.setIsOpenFullScreenPanel({
                                  open: true,
                                  model: "Edit Blog",
                                  id: item._id,
                                })
                              }
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

export default BlogList;
