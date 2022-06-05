import Producto from "../utilidades/producto"
import ReactPaginate from "react-paginate"
import { useState } from "react"
export default function grid_products( { productos} ) {
    const [PagNum, setPagNum] = useState(0)
    const ProductosPag = 6
    const PaginaVisitada = ProductosPag * PagNum
    const mostrarProductos = productos.slice(PaginaVisitada, PaginaVisitada + ProductosPag)
    .map((producto, key) => {
        return (
            <div key={key} className="w-48 p-2 lg:w-56 xl:w-64 justify-center ">
                <Producto  producto={producto}/>
            </div>
        )})
    const ContPag = Math.ceil(productos.length / ProductosPag)
    const changePage = ({selected}) => {
        setPagNum(selected)
    }
  return (
      <div className="flex flex-1 flex-col p-2 mt-4 mx-1 sm:mx-32 md:mx-16 lg:ml-12 lg:mt-12 lg:mr-48">

        <div className='grid grid-cols-2 lg:grid-cols-3 gap-x-0  sm:gap-x-8 md:gap-x-12 lg:gap-x-24 gap-y-4'>
            {mostrarProductos}   
        </div>
        <ReactPaginate
                previousLabel={"Anterior"}
                nextLabel={"Siguiente"}
                pageCount={ContPag}
                onPageChange={changePage}
                containerClassName={"paginate"}
                activeClassName={'paginate_active'}
            />
    </div>

  )
}
