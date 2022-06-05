import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from 'react';
export default function imagenes( { imagenes } ) {
    const [slide1, setslide1] = useState('')
    const [slide2, setslide2] = useState('')
    
    const settings = {
        slidesToShow: 1,
        arrows: false,
        autoplay: false,
        asNavFor: slide2,
        adaptativeHeigth: true   
      }
      const settings2 = {
        slidesToShow: 2,
        asNavFor: slide1 ,
        arrows: false,
 
        vertical: false,
        focusOnSelect: true,
        autoplay: false,
        adaptativeHeigth: true   
      
      }
      return (
        <div className='flex flex-1 flex-col content-center justify-center  space-y-6 mt-0 lg:mt-28  lg:border-r-2 w-full sm:w-[80%] '>
          <div className="  ">
          <Slider {...settings} ref={(slider1) => setslide1(slider1)} className="slider" >
              {imagenes.map( (img, key) => {
                return (
                  <div key={key} className=" mt-9">
                  <img src={img} className=" w-[40rem]"/>
                  </div>
                )
              })}
          </Slider>
          </div>
          <div className='w-full h-auto flex items-center justify-center'>
          <div className=" w-full" >
          <Slider {...settings2} ref={(slider2) => setslide2(slider2)} className="slider2" >
          {imagenes.map( (img, key ) => {
                return (
                  <div key={key} className="cursor-pointer">
                  <img src={img} className=" w-32"/>
                  </div>
                )
              })}
          </Slider>
          </div>
          </div>
        </div>
        )
}

