import React, { useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

import { FreeMode, Navigation } from 'swiper/modules';
import { IoStatsChartSharp } from "react-icons/io5";
import { AiTwotonePieChart } from "react-icons/ai";
import { RiProductHuntLine } from "react-icons/ri"
import { FiPieChart } from 'react-icons/fi';
import { GoGift } from 'react-icons/go';
import { MdOutlineReviews } from 'react-icons/md';
import { MyContext } from '../../App';

const DashboardBoxes = (props) => {

    const context = useContext(MyContext);
    return (
        <>
          <Swiper 
        slidesPerView={4}
        spaceBetween={10}
       navigation={context?.windowWidth < 1100 ? false : true}
                modules={[Navigation, FreeMode]}
                freeMode={true}
                breakpoints={{
                    300: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    650: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                    992: {
                        slidesPerView: 4,
                        spaceBetween: 10,
                    }
                }}
                className="dashboardBoxesSlider"
      >
                <SwiperSlide>
                    <div className='box bg-[#10b981] p-5 py-6 cursor-pointer hover:bg-[#289974] rounded-md border border-[rgba(0,0,0,0.2)] flex 
                    items-center gap-4'>
                        <FiPieChart className='text-[40px] text-[#fff]'/>
                        <div className='info w-[70%]'>
                            <h3 className='text-white'>Total Users</h3>
                            <b className='text-white text-[20px]'>{props?.users}</b>
                        </div>
                        <IoStatsChartSharp className="text-[50px] text-[#fff]"/>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className='box bg-[#3872fa] p-5 py-6 cursor-pointer hover:bg-[#346ae8] rounded-md border border-[rgba(0,0,0,0.2)] flex 
                    items-center gap-4'>
                        <GoGift className='text-[50px] text-[#fff]'/>
                        <div className='info w-[70%]'>
                            <h3 className='text-white'>Total Orders</h3>
                            <b className='text-white'>{props?.orders}</b>
                        </div>
                        <FiPieChart className="text-[50px] text-[#fff]"/>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className='box bg-[#312be1d8] p-5 py-6 cursor-pointer hover:bg-[#423eadd8] rounded-md border border-[rgba(0,0,0,0.2)] flex 
                    items-center gap-4'>
                        <RiProductHuntLine className='text-[40px] text-[#fff]'/>
                        <div className='info w-[70%]'>
                            <h3 className='text-white'>Total Products</h3>
                            <b className='text-white'>{props?.products}</b>
                        </div>
                        <IoStatsChartSharp className="text-[50px] text-[#fff]"/>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className='box bg-[#f22c61] p-5 py-6 cursor-pointer hover:bg-[#d52c59] rounded-md border border-[rgba(0,0,0,0.2)] flex 
                    items-center gap-4'>
                        <MdOutlineReviews className='text-[40px] text-[#fff]'/>
                        <div className='info w-[70%]'>
                            <h3 className='text-white'>Total Category</h3>
                            <b className='text-white'>{props?.category}</b>
                        </div>
                        <IoStatsChartSharp className="text-[50px] text-[#fff]"/>
                    </div>
                </SwiperSlide>
        </Swiper>
        </>
    );
};

export default DashboardBoxes;