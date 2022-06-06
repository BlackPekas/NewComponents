import Imagenes from "../../components/producto/imagenes"
import Info from "../../components/producto/Info"
import Navbar from "../../components/navbars/navbar"
import Footer from "../../components/footer/footer"
import Extra from "../../components/producto/extra"
export default function product( { producto }) {

 return (
   <>
   <Navbar/>
   <div className=" flex items-center justify-center w-full" >
         <div className="flex flex-col lg:flex-row mt-16 mx-4">
          <Imagenes imagenes={producto.url}/>
          <Info producto={producto}/>
         </div>
   </div>
   <div>
   <Extra producto={producto}/>
   </div>

   <Footer/>
   </>
   
 )
}
export async function getServerSideProps(context) {
  const { params } = context
  const { nombre } = params
  const data = await fetch(`https://new-components-delta.vercel.app/api/${nombre}`)
  const producto = await data.json()
  return {
    props: { producto : producto },
  }
}
