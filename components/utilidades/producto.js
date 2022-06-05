import Link from "next/link"
export default function producto( { producto }) {
    const precio_desc = (producto.precio-((producto.precio*producto.descuento)/100)).toFixed(2)
  return (
    <div className="z-0 flex items-center content-center justify-center relative p-4 overflow-ellipsis overflow-hidden ...  cursor-pointer border-2 h-64 w-36 sm:w-auto lg:h-64 lg:p-8">
                        <Link href={ `/productos/${producto.nombre2}`}>
                        <a>
                            { producto.descuento != 0 &&  <span className="z-40 absolute top-2 left4 shadow-sm p-1 bg-red-700  text-center text-white rounded-lg font-semibold ">-{producto.descuento}%</span>}
                            {
                                producto.stock == 0 && 
                                    <span className=" text-white font-bold text-md absolute top-[30px] left-[30px] sm:top-[25px] sm:left-[50px] lg:top-[40px] lg:left-[60px]  text-center justify-center w-full bg-red-700  rotate-45">Sin Unidades</span>
                            }
                            <img src={producto.url[0]} className=" h-32"/>
                            <span className=" text-sm inline-block overflow-hidden text-ellipsis" >{producto.nombre}</span>
                            <div className="flex space-x-3 absolute bottom-2">
                            { producto.descuento != 0 ?
                                <>
                                    <span className=" text-red-600 font-bold text-base ">{precio_desc}€</span>
                                    <span className=" text-gray-400 line-through text-xs bottom-0 ">{producto.precio}€</span>
                                </>

                                :
                                <>
                                    <span className=" text-red-600 font-bold text-base ">{producto.precio}€</span>
                                </>
                            }
                            
                            </div>
                            
                        </a>
                        </Link>
                       

                    </div>
  )
}
