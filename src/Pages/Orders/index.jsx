import React, { useContext, useState } from "react";
import { Button, Pagination } from "@mui/material";
import { FaAngleDown } from "react-icons/fa6";
import Badge from "../../Components/Badge";
import SearchBox from "../../Components/SearchBox";
import { FaAngleUp } from "react-icons/fa6";
import { editData, fetchDataFromApi } from "../../../utils/api";
import { useEffect } from "react";
import { MyContext } from "../../App.jsx";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export const Orders = () => {
  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");

  const [ordersData, setOrdersData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pageOrder, setPageOrder] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState();

  const [totalOrdersData, setTotalOrdersData] = useState([]);

  const context = useContext(MyContext);

  const isShowOrderdProduct = (index) => {
    if (isOpenOrderdProduct === index) {
      setIsOpenOrderdProduct(null);
    } else {
      setIsOpenOrderdProduct(index);
    }
  };

  const handleChange = (event, id) => {
    setOrderStatus(event.target.value);

    const obj = {
      id: id,
      order_status: event.target.value,
    };

    editData(`/api/order/order-status/${id}`, obj).then((res) => {
      if (res?.data?.error === false) {
        context.alertBox("success", res?.data?.message);
      }
    });
  };

  useEffect(() => {
    fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then(
      (res) => {
        if (res?.error === false) {
          setTotalPages(res.totalPages);
          setOrdersData(res?.data);
        }
      },
    );
    fetchDataFromApi(`/api/order/order-list`).then((res) => {
      if (res?.error === false) {
        setTotalOrdersData(res);
      }
    });
  }, [pageOrder]);

  useEffect(() => {
    if (searchQuery !== "") {
      const filteredOrders = totalOrdersData?.data?.filter(
        (order) =>
          order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order?.userId?.name.toLowerCase().includes(searchQuery.toLowerCase) ||
          order?.createdAt.includes(searchQuery),
      );
      setOrdersData(filteredOrders);
    } else {
      fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=7`).then(
        (res) => {
          if (res?.error === false) {
            setOrdersData(res?.data);
          }
        },
      );
    }
  }, [searchQuery]);

  return (
    <div className="card my-4 shadow-md sm:rounded-lg bg-white">
      <div className="flex items-center justify-between px-5 py-5">
        <h2 className="text-[18px] font-[600]">Recent Orders</h2>
        <div className="w-[25%]">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setPageOrder={setPageOrder}
          />
        </div>
      </div>

      <div class="relative overflow-x-auto mt-5">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-200 dark:text-gray-900">
            <tr>
              <th scope="col" class="px-6 py-3">
                &nbsp;
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Order Id
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Paymant Id
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Name
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Phone Number
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Address
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Pincode
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Total Amount
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Email
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                User Id
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Order Status
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {ordersData?.length !== 0 &&
              ordersData?.map((order, index) => {
                return (
                  <>
                    <tr class="bg-white border-b dark:bg-gray-100 dark:border-gray-300">
                      <td class="px-6 py-4 font-[500]">
                        <Button
                          className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]"
                          onClick={() => isShowOrderdProduct(index)}
                        >
                          {isOpenOrderdProduct === index ? (
                            <FaAngleUp className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                          ) : (
                            <FaAngleDown className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                          )}
                        </Button>
                      </td>
                      <td class="px-6 py-4 font-[500]">
                        <span className="text-primary">{order?._id}</span>
                      </td>
                      <td class="px-6 py-4 font-[500]">
                        <span className="text-primary">
                          {order?.paymentId
                            ? order?.paymentId
                            : "CASH ON DELIVERY"}
                        </span>
                      </td>
                      <td class="px-6 py-4 font-[500] whitespace-nowrap">
                        {order?.userId?.name}
                      </td>
                      <td class="px-6 py-4 font-[500] whitespace-nowrap">
                        {order?.userId?.mobile}
                      </td>
                      <td class="px-6 py-4 font-[500]">
                        <span className="block w-[400px]">
                          {order?.delivery_address?.address_line1 +
                            " " +
                            order?.delivery_address?.city +
                            " " +
                            order?.delivery_address?.landmark +
                            " " +
                            order?.delivery_address?.state +
                            " " +
                            order?.delivery_address?.country +
                            " " +
                            order?.delivery_address?.mobile}
                        </span>
                      </td>
                      <td class="px-6 py-4 font-[500]">
                        {order?.delivery_address?.pincode}
                      </td>
                      <td class="px-6 py-4 font-[500]">{order?.totalAmt}</td>
                      <td class="px-6 py-4 font-[500]">
                        {order?.userId?.email}
                      </td>
                      <td class="px-6 py-4 font-[500]">
                        <span className="text-primary">
                          {order?.userId?._id}
                        </span>
                      </td>
                      <td class="px-6 py-4 font-[500]">
                        <Badge status={order?.order_status} />
                      </td>
                      <td class="px-6 py-4 font-[500] whitespace-nowrap">
                        {order?.createdAt?.split("T")[0]}
                      </td>
                    </tr>
                    {isOpenOrderdProduct === index && (
                      <tr>
                        <td className="pl-20" colSpan="6">
                          <div class="relative overflow-x-auto">
                            <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-200 dark:text-gray-900">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 whitespace-nowrap"
                                  >
                                    Product Id
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 whitespace-nowrap"
                                  >
                                    Product Title
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 whitespace-nowrap"
                                  >
                                    Image
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 whitespace-nowrap"
                                  >
                                    Quantity
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 whitespace-nowrap"
                                  >
                                    Price
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 whitespace-nowrap"
                                  >
                                    Sub Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {order?.products?.map((item, index) => {
                                  return (
                                    <tr class="bg-white border-b dark:bg-gray-100 dark:border-gray-300">
                                      <td class="px-6 py-4 font-[500]">
                                        <span className="text-gray-600">
                                          {item?._id}
                                        </span>
                                      </td>
                                      <td class="px-6 py-4 font-[500]">
                                        <div className="w-[200px]">
                                          {item?.productTitle}
                                        </div>
                                      </td>
                                      <td class="px-6 py-4 font-[500]">
                                        <img
                                          src={item?.image}
                                          className="w-[40px] h-[40px] object-cover rounded-md"
                                        />
                                      </td>
                                      <td class="px-6 py-4 font-[500] whitespace-nowrap">
                                        {item?.quantity}
                                      </td>
                                      <td class="px-6 py-4 font-[500]">
                                        {item?.price?.toLocaleString("en-US", {
                                          style: "currency",
                                          currency: "INR",
                                        })}
                                      </td>
                                      <td class="px-6 py-4 font-[500]">
                                        {(
                                          item?.price * item?.quantity
                                        )?.toLocaleString("en-US", {
                                          style: "currency",
                                          currency: "INR",
                                        })}
                                      </td>
                                    </tr>
                                  );
                                })}

                                <tr>
                                  <td className="bg-[#ccc]" colSpan="12"></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-10 pb-5">
          <Pagination
            showFirstButton
            showLastButton
            count={totalPages}
            page={pageOrder}
            onChange={(e, value) => setPageOrder(value)}
          />
        </div>
      )}
    </div>
  );
};

export default Orders;
