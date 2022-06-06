import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import StarRatings from 'react-star-ratings'
import Valoracion from "./valoracion";
export default function extra({producto}) {
    const [rel_prod, setRel_Prod] = useState(null)
    const [stars, setStars] = useState(0)
    const [valoracion, setValoracion] = useState(new Array(6).fill(0))
    const [reseñas, setReseñas] = useState([])
    useEffect(() => {
        getCat()
        getVal()
        setReseñas([])
    },[producto])
    const getCat = async () => {
        const productos = await axios.get('https://new-components-delta.vercel.app/api/productos/SimilarProducts',{ params: {categoria: producto.categoria, nombre: producto.nombre}},{headers: {'Content-Type': 'application/json'}})
        if (productos.status == 200) {
            setRel_Prod(productos.data)
        }
    }
    const getVal = async () => {
        const valoraciones = await axios.get('https://new-components-delta.vercel.app/api/resenas/getResenas_prod',{ params: {nombre: producto.nombre}},{headers: {'Content-Type': 'application/json'}})
        if (valoraciones.status == 200) {
            var starss = 0
            var array = new Array(6).fill(0)
            if (valoraciones.data.length > 0) {
                valoraciones.data.map((dato) => {
                    valoracion.map((dato2, key) => { if(dato.estrellas == key)  {array[key]++}})
                    starss += dato.estrellas
                })          
                setReseñas(valoraciones.data.filter((dato => {return dato})))
                starss = Math.round(starss/valoraciones.data.length)
                setStars(starss)

            }else setStars(starss)
            
            setValoracion(array)

        }
    }
     return (
    <>
    <div className=" w-full flex justify-center content-center ">
        <div className=" grid grid-cols-1 md:flex justify-center ml-2 mr-8  sm:mx-12  h-auto mb-12 ">
            <div className="m-4 w-full md:w-[70%] text-justify ">
                <p className="font-semibold text-xl underline underline-offset-4 mb-4">Características</p>
                <p>
                <span className=" block mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at gravida sapien, quis aliquam ipsum. Pellentesque vel eros sodales, facilisis ipsum vel, sagittis nisi. Morbi ligula ligula, pulvinar non elit nec, viverra consectetur quam. Mauris tempor, est sed volutpat auctor, nulla diam vehicula nibh, non pellentesque enim turpis at ipsum. In hac habitasse platea dictumst. Aliquam rhoncus, tellus eu congue scelerisque, mauris arcu interdum nunc, elementum porta mauris arcu sit amet sapien. Praesent a sem eu odio tincidunt sodales et nec augue. Vestibulum tincidunt eu lectus in egestas. Morbi in interdum nunc. Vivamus nec nunc metus. Nulla pharetra faucibus fermentum. Vivamus quis rutrum quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultricies justo a dolor convallis egestas. Curabitur ac euismod odio, id mollis dui.</span>
                <span className=" block mb-2">Nam ipsum diam, tincidunt at eros vitae, aliquet venenatis sem. Duis eu urna sed neque venenatis suscipit quis a nunc. Sed consequat semper blandit. Etiam id malesuada sapien. Aenean mollis tortor ac est lobortis gravida. Quisque tincidunt eros nisi, ac porttitor lectus porta ac. Pellentesque vel lorem sed mi pellentesque interdum at vel ante. Nunc lobortis eros sit amet nibh iaculis, non vehicula nunc malesuada. Donec enim enim, lacinia in odio eu, laoreet posuere elit. In rutrum ipsum nec sagittis consequat. Quisque commodo imperdiet dui. Vestibulum feugiat, mauris vitae facilisis porttitor, augue est malesuada lectus, viverra posuere enim massa vel diam. Integer leo arcu, cursus ac lacinia at, auctor vel mauris.</span>
                <span className=" block mb-2">Nam ipsum diam, tincidunt at eros vitae, aliquet venenatis sem. Duis eu urna sed neque venenatis suscipit quis a nunc. Sed consequat semper blandit. Etiam id malesuada sapien. Aenean mollis tortor ac est lobortis gravida. Quisque tincidunt eros nisi, ac porttitor lectus porta ac. Pellentesque vel lorem sed mi pellentesque interdum at vel ante. Nunc lobortis eros sit amet nibh iaculis, non vehicula nunc malesuada. Donec enim enim, lacinia in odio eu, laoreet posuere elit. In rutrum ipsum nec sagittis consequat. Quisque commodo imperdiet dui. Vestibulum feugiat, mauris vitae facilisis porttitor, augue est malesuada lectus, viverra posuere enim massa vel diam. Integer leo arcu, cursus ac lacinia at, auctor vel mauris.</span>
                <span className=" block mb-2">Nam ipsum diam, tincidunt at eros vitae, aliquet venenatis sem. Duis eu urna sed neque venenatis suscipit quis a nunc. Sed consequat semper blandit. Etiam id malesuada sapien. Aenean mollis tortor ac est lobortis gravida. Quisque tincidunt eros nisi, ac porttitor lectus porta ac. Pellentesque vel lorem sed mi pellentesque interdum at vel ante. Nunc lobortis eros sit amet nibh iaculis, non vehicula nunc malesuada. Donec enim enim, lacinia in odio eu, laoreet posuere elit. In rutrum ipsum nec sagittis consequat. Quisque commodo imperdiet dui. Vestibulum feugiat, mauris vitae facilisis porttitor, augue est malesuada lectus, viverra posuere enim massa vel diam. Integer leo arcu, cursus ac lacinia at, auctor vel mauris.</span>
                </p>
            </div>
            <div className="m-4 text-center content-center justify-center  ml-0 md:ml-16">
                <h2 className="font-semibold text-xl underline underline-offset-4">Productos Relacionados</h2>
              {
                  rel_prod !== null &&
                  <div className="flex flex-col flex-1 space-y-8  mt-16">
                      {rel_prod.map((prod) => {
                              const precio_desc = (prod.precio-((prod.precio*prod.descuento)/100)).toFixed(2)

                          return (
                              <div className="flex content-center justify-center text-center">
                                  <Link href={`/productos/${prod.nombre2}`}>
                              <div className="flex  relative w-[20rem] border-[1px] rounded-lg p-2">
                                  <img src={prod.url[0]} className="w-[8rem]"/>
                                  <span className="w-32 h-28 mt-8">{prod.nombre}</span>
                                  <div className="flex space-x-3 absolute bottom-2 right-4">
                                    { prod.descuento != 0 ?
                                        <>
                                            <span className=" text-red-600 font-bold text-base ">{precio_desc}€</span>
                                            <span className=" text-gray-400 line-through text-xs bottom-0 ">{prod.precio}€</span>
                                        </>

                                        :
                                        <>
                                            <span className=" text-red-600 font-bold text-base ">{prod.precio}€</span>
                                        </>
                                    }
                                    
                                    </div>
                              </div>
                              </Link>
                              </div>
                          )
                      }) }
                      
                  </div>
              }
            </div>
        </div>
    </div>
    <div className=" flex flex-col flex-1 mx-0 mb-16 lg:mx-32 lg:mb-32 justify-items-center content-center text-center justify-center mt-32 xl:mt-10 w-full md:[80%] lg:w-[70%] ">
    <div className=" grid grid-cols-1 md:grid-cols-2 lg:flex items-center justify-center content-center space-y-24 lg:space-y-0 ">
    <div className="flex ">
    <div className="flex flex-col flex-1  h-36 space-y-16 -mt-24  mb-8 lg:mb-0">
    <p className="font-semibold text-xl underline underline-offset-4 mb-4">Valoración Global</p>

    <StarRatings rating={stars} starRatedColor="orange" numberOfStars={5} name='Rating'/>
    <span className=" text-8xl text-orange-500 font-bold">{stars}</span>
    </div>
    </div>
        <div className="flex flex-1 flex-col justify-items-center content-center text-center justify-center space-y-8">
        <p className="font-semibold text-xl underline underline-offset-4 mb-4 -mt-5">Valoraciones Individuales</p>
              <div className="">
              {
                valoracion.map((val,key) => {
                    return (
                        <div key={key} className="flex space-x-6 justify-items-center content-center text-center justify-center ">
                        <StarRatings rating={key} starRatedColor="orange" numberOfStars={5} name='Rating' starDimension="20px" starSpacing="8px"/>
                        <span>({val})</span>
                        </div>
                    )
                })
            }
              </div>
          
            
        </div>
    </div>
    <div className="flex flex-col flex-1 my-24 ">
        
        {reseñas.length > 0 &&
            <>
            <p className="font-semibold text-xl underline underline-offset-4 mb-8">Reseñas</p>
            <div className=" grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 space-y-8 md:space-y-0">
           {reseñas.map((reseña) => {
               return (
                <div className="flex justify-items-center content-center text-center justify-center">
                <Valoracion valoracion={reseña}/>
                </div>
               )
           }) }
              </div>
            </>
            
        }
        </div>
        
        </div>
    </>
  )
}
