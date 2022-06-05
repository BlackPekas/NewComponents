
import {  useRef } from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline"
export default function Portada({ datos }) {
    const SlideRef = useRef(null)

  var settings = {
    infinite: true,
    arrows: false,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 10000,
    slidesToShow: 1,
    initialSlide: 0,
  };
  return (
     <>
    <div className='w-full h-[52px]'>
    </div>
     <div className=' '>
                <ChevronLeftIcon onClick={() => SlideRef.current.slickPrev()} className='z-30 absolute  w-6 md:w-8 lg:w-12 h-10 md:h-14 lg:h-20 left-8 md:left-16 lg:left-28 mt-4 md:mt-20 lg:mt-32 bg-gray-100 border-2 flex items-center justify-center rounded-md cursor-pointer'/>
                <ChevronRightIcon onClick={() => SlideRef.current.slickNext()} className='z-30 absolute w-6 md:w-8 lg:w-12 h-10 md:h-14 lg:h-20 right-8 md:right-16 lg:right-28 mt-4 md:mt-20 lg:mt-32 bg-gray-100  border-2 flex items-center justify-center rounded-md cursor-pointer' />

           <Slider ref={SlideRef} {...settings} className="z-0 relative w-full">
                { datos.map((dato, key) => {
                    return (
                        <div key={key} className=''>
                            <img className='' src={dato.url}/>
                        </div>
                    )
                })}
            </Slider>
      </div>
     </> 
    
  );

}
