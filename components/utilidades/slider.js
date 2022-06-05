import Slider from "react-slick"
import { useEffect, useState, useRef } from 'react'
import Link from "next/link"

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline"
export default function slider({ datos }) {

    const SlideRef = useRef(null)

    var settings = {
        speed: 100,
        slidesToShow: 5,
        slidesToScoll: 2,
        responsive: [
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 1,
                    autoplay: true,
                    autoplaySpeed: 10000,
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 2,
                    autoplay: true,
                    autoplaySpeed: 10000,
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 3,
                    autoplay: true,
                    autoplaySpeed: 10000,
                }
            },
            {
                breakpoint: 1300,
                settings: {
                    slidesToShow: 3,
                    autoplay: true,
                    autoplaySpeed: 10000,
                }
            },
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 4,
                }
            },
            
          ]      
      };
      return (
        <div className=" w-[70%] ml-12 sm:ml-24 md:ml-10 md:w-full  flex items-center content-center justify-center ">
                <ChevronLeftIcon onClick={() => SlideRef.current.slickPrev()} className=' hidden sm:inline mr-4 z-30 w-12 h-20 border-2 rounded-lg relative cursor-pointer'/>
          <Slider {...settings} ref={SlideRef} className="w-[80%] sm:w-[100%] md:w-[70%] lg:w-[80%]">   
            {datos.map((dato, key) => {
                const precio_desc = (dato.precio-((dato.precio*dato.descuento)/100)).toFixed(2)
                return (
                    <div  key={key} className="z-0 flex items-center content-center justify-center relative p-4 overflow-ellipsis overflow-hidden ...  cursor-pointer border-2 h-64 lg:h-64 lg:p-8">
                        <Link href={ `/productos/${dato.nombre2}`}>
                        <a>
                            { dato.descuento != 0 &&  <span className="z-40 absolute top-2 left4 shadow-sm p-1 bg-red-700  text-center text-white rounded-lg font-semibold ">-{dato.descuento}%</span>}

                            <img src={dato.url[0]} className=" h-32"/>
                            <p className=" text-sm line-clamp-3 h-[4rem]">{dato.nombre}</p>
                            <div className="flex space-x-3 absolute bottom-2">
                            { dato.descuento != 0 ?
                                <>
                                    <span className=" text-red-600 font-bold text-base ">{precio_desc}€</span>
                                    <span className=" text-gray-400 line-through text-xs bottom-0 ">{dato.precio}€</span>
                                </>

                                :
                                <>
                                    <span className=" text-red-600 font-bold text-base ">{dato.precio}€</span>
                                </>
                            }
                            </div>
                            
                        </a>
                        </Link>
                       

                    </div>
                )
            })}
          </Slider>
          <ChevronRightIcon onClick={() => SlideRef.current.slickNext()} className=' hidden sm:inline ml-4 z-30 w-12 h-20 border-2 rounded-lg relative cursor-pointer' />

        </div>
      );
        
}
