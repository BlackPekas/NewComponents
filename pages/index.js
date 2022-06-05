import Portada from "../components/main/Portada"
import Contenido from "../components/main/contenido"
import Navbar from "../components/navbars/navbar"
import Footer from "../components/footer/footer";
export default function Index( { destacados, categorias, anuncios, portada }) {
  return (
    <>
      <Navbar/>
      <Portada datos={portada}/>
      <Contenido destacados={destacados} categorias={categorias} anuncios={anuncios} portada={portada}/>
      <Footer/>
    </>)}

export async function getServerSideProps() {
  const data = await fetch(`https://new-components-delta.vercel.app/api/tipo/destacados`)
  const data2 = await fetch(`https://new-components-delta.vercel.app/api/tipo/categorias`)
  const data3 = await fetch(`https://new-components-delta.vercel.app/api/tipo/anuncios`)
  const data4 = await fetch(`https://new-components-delta.vercel.app/api/tipo/portada`)
  const des = await data.json()
  const destacados = des.sort(() => 0.5 - Math.random())
  const cat = await data2.json()
  const categorias = cat.sort(() => 0.5 - Math.random())
  const anu = await data3.json()
  const port = await data4.json()
  return {
    props: { destacados : destacados, categorias: categorias, anuncios: anu, portada: port },
  }
}