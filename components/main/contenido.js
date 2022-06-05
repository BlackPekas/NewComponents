import Anuncios from "./anuncios"
import Slider from "../utilidades/slider"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
export default function contenido( { destacados, categorias, anuncios }) {



  return (
    <div className=' h-full w-full flex items-center justify-start relative '>
        <div className=' flex flex-1 flex-col p-8 md:p-12 2xl:24 space-y-8'>
        <div className="">
            <span className="text-3xl md:text-4xl">Categorias <span className="font-semibold ">relevantes</span></span>
          </div>
        <div className="w-[90%]  ml-2 xl:ml-16 h-auto xl:h-32 grid grid-cols-2 gap-4 grid-rows-2 md:flex">

          {
          categorias.slice(0,4).map((dato, key) => {
            return (
              <Link  key={key} href={`/categorias/${dato.nombre}`}>
              <a className=" bg-slate-100 rounded-lg items-center text-center flex flex-1 flex-col relative">
                <img src={dato.url} className="w-36 h-auto p-2 mb-3"/>
                <span className=" font-semibold text-md absolute bottom-0 ">{dato.nombre}</span>
              </a>
              </Link>
            )
          })}
        </div>
        <div className="flex flex-1 flex-col space-y-4 xl:space-y-8">
        <div className="space-y-4 xl:space-y-8 w-full md:w-[80%]">
            <span className="text-4xl"> <span className="font-semibold ">Destacados</span></span>
            <div className="ml-0 xl:ml-28 w-full">
            <Slider datos={destacados.slice(0,6)}/>
            </div>
        </div>
        <div className="space-y-4 xl:space-y-8 w-full md:w-[80%]">
            <span className="text-4xl">Top <span className="font-semibold ">ventas</span></span>
            <div className="ml-0 xl:ml-28 w-full">
            <Slider datos={destacados.slice(6,12)}/>
            </div>
        </div>
        
        </div>
        
          
        </div>
        <div className=" hidden lg:flex h-full w-48 items-center justify-center">
        <Anuncios anuncios={anuncios}/>
        </div>
    </div>
  )
}
