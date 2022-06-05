import {useState, useEffect, useRef, useCallback} from "react";
import Grid from "../../components/main/grid_products";
import Anuncios from '../../components/main/anuncios'
import { ChevronDownIcon, XIcon, RefreshIcon } from '@heroicons/react/outline'
import Select from 'react-select'
import Navbar from "../../components/navbars/navbar";
import { useRouter } from "next/router";
import Footer from '../../components/footer/footer'

export default function nombre( {productos, anuncios, query} ) {
  const router = useRouter()
  
    const [menu2, setMenu2] = useState(false)
    const [menu, setMenu] = useState(false)
    const [marcas, setMarcas] = useState([])
    const [marcas_check, setMarcas_check] = useState([])              
    const [filtrado_marc, setFiltrado_marc] = useState([])
    const [filtrado_productos, setFiltrado_productos] = useState(productos)
    const [exp, setExp] = useState(false)
    const mostrar_marcas = exp ? marcas : marcas.slice(0,4) 
    const [selected, setselected] = useState(null)
    useEffect(() => {
        setFiltrado_productos(productos)
    },[productos])
    useEffect(() => {
      const marcas =  productos.map(dato => {return {"nombre" : dato.marca} })
      const marcas_total = [...marcas.reduce( (mp, o) => {
        if (!mp.has(o.nombre)) mp.set(o.nombre, { ...o, count: 0 });
        mp.get(o.nombre).count++;
        return mp;
    }, new Map).values()];
    setMarcas(marcas_total)
    }, [])
    useEffect(() => {
        setMarcas_check(Array(marcas.length).fill(false))
    }, [marcas])
  
    const onChange2 = (e, key) => {
      const update = marcas_check.map((dato, index) => index === key ? !dato : dato)
      setMarcas_check(update)
    } 
    useEffect(() => {
        if ( !marcas_check.includes(true) ) {
          setFiltrado_marc(marcas)
        }else { 
          setFiltrado_marc(marcas.filter((dato, index) => marcas_check[index] === true))
      }
    }, [marcas_check])

    useEffect(() => {
        if ( !marcas_check.includes(true) ) {
            setFiltrado_productos(productos)
        }else { 
            setFiltrado_productos(productos.filter((dato) => filtrado_marc.some((e) => e.nombre === dato.marca)))
      }
      }, [filtrado_marc])
    const handleselect = (opcion) => {
      setselected(opcion)
    }
    const options = [{value: 'PASC', label: 'Precio Asc'},{value: 'PDES', label: 'Precio Desc'},{value: 'RASC', label: 'Rebaja Asc'},{value: 'RDES', label: 'Rebaja Desc'}]
    useEffect(() => {
      if (selected != null) {
        if (selected.value == 'PASC') {
          const sorted = filtrado_productos.sort((a,b) => a.precio-b.precio)
          setFiltrado_productos([...sorted])
        }else if (selected.value == 'PDES') {
          const sorted = filtrado_productos.sort((a,b) => b.precio-a.precio)
          setFiltrado_productos([...sorted])
        }else if (selected.value == 'RDES') {
          const sorted = filtrado_productos.sort((a,b) => b.descuento-a.descuento)
          setFiltrado_productos([...sorted])
        }else if (selected.value == 'RASC') {
          const sorted = filtrado_productos.sort((a,b) => a.descuento-b.descuento)
          setFiltrado_productos([...sorted])
        }
  
      }
    },[selected])
    const limpiarFiltro = () => {
      setMarcas_check(Array(marcas.length).fill(false))
      setFiltrado_marc(marcas)  
    }
  return (
    <div className='h-full'>
    <Navbar/>
    <div className='w-full h-[52px]'></div>

     {productos.length < 1 ? 
      <div className=' w-full  text-center justify-center content-center my-32'>
      <span className='text-xl'> No se han encontrado productos en la categoria "{query}" </span>
      <img className="w-[200px] xl:w-[400px] ml-24 lg:ml-[30rem] 2xl:ml-[80vh]" src='https://firebasestorage.googleapis.com/v0/b/pekomponents.appspot.com/o/jungle-404.gif?alt=media&token=e28cfb8d-34a0-4d30-8655-74c45aabd487'></img>     
  </div>
      :
      <div className='flex flex-1 flex-col'>
      <div className=' hidden lg:flex  mt-36 ml-8'>
      <span className=' text-3xl '> +{productos.length} productos encontrados</span>
      </div>

      <div className=" items-center content-center justify-center mt-44 ml-[60%] hidden lg:flex absolute">
        <Select className='react-select' value={selected} onChange={handleselect} options={options} isSearchable={false} placeholder='Ordenar'/>
        </div>
        <div className=" flex md:hidden relative items-center text-center">
        <div className=' w-full mt-[74px] h-[40px] flex space-x-5 items-center mx-12'>   
          <button onClick={() => {setMenu(!menu)}} className=' p-2 w-24 rounded-md border-[1px] text-gray-600 border-slate-400 text-sm font-semibold '>Filtrar</button>
          <Select className='react-select' value={selected} onChange={handleselect} options={options} isSearchable={false} placeholder='Ordenar'/>

            {
              menu &&
              <div className={`${ menu ? 'right-0' : '-right-[400px]'} fixed  flex flex-col flex-1 top-14 overflow-y-auto scrollbar z-40 transition-all duration-500 h-[130vh] w-full bg-white `}>
                <div className="w-full border-b-2 text-start flex space-x-4 p-2 relative">
                  <XIcon onClick={() => {setMenu(!menu)}} className="h-8"/>
                  <span className="font-semibold text-lg "> Filtrar Productos</span>
                  <RefreshIcon onClick={limpiarFiltro} className="absolute right-6 h-8"/>
                </div>
                <div className="flex flex-1 flex-col  ">
                <div className="">
                  <div className=" content-center text-center justify-center ">
              <button onClick={() => {setMenu2(!menu2)}} className="flex justify-center content-center text-center w-full p-2 border-b-2">
                  <span> Marcas </span>
                  <ChevronDownIcon width={24} className={`${!menu2 ? 'rotate-0' : 'rotate-180'} transform duration-500`}/>
              </button>
              <div className={` ${!menu2 ? 'hidden' : 'flex'} flex-col flex-1 text-center space-y-2`}>
                 {mostrar_marcas.map((dato, key) => {
                     return (
                         <div onClick={(e) => onChange2(e, key)} className=" relative h-8 cursor-pointer inline justify-center text-center content-center hover:bg-slate-300 transition duration-500" key={key}>
                             <input type="checkbox" checked={marcas_check[key]} className="absolute  left-2 mt-1"/>
                             <span className="">{dato.nombre} </span>
                             <span className="absolute right-2">({dato.count})</span>
                         </div>
                     )
                 })}
                 {  marcas.length > 4 &&
                    <div className="flex items-center justify-center content-center" >
                      <button className="w-[50%] m-2 bg-slate-200 border-2 border-slate-400 hover:bg-slate-300 transition duration-300 rounded-lg" type="button" onClick={() => setExp(!exp)}>
                      {!exp ? 'Ver más' : 'Ver menos'} 
                      </button> 
                    </div>
                 }
                  
              </div>
                </div>
                </div>
                
                
                  
                </div>
              </div>
            }
        </div>
        
        </div>
      <div className=' flex items-between justify-between content-between '>
      <div className=' mt-4 ml-10 hidden md:flex '>
      <div className="flex flex-1 flex-col m-2 space-y-2 ">
      
          <div>
          <div className=" w-[22vh] border-y-2 flex flex-1 flex-col">
              <button onClick={() => {setMenu2(!menu2)}} className="flex space-x-8 m-4 w-46 justify-center content-center text-center">
                  <span> Marcas </span>
                  <ChevronDownIcon width={24} className={`${!menu2 ? 'rotate-0' : 'rotate-180'} transform duration-500`}/>
              </button>
              <div className={` ${!menu2 ? 'hidden' : 'flex'} flex-col flex-1 text-center space-y-2`}>
                 {mostrar_marcas.map((dato, key) => {
                     return (
                         <div onClick={(e) => onChange2(e, key)} className=" relative h-10 cursor-pointer inline justify-start text-start content-start hover:bg-slate-300 transition duration-500" key={key}>
                             <input type="checkbox" checked={marcas_check[key]} className="absolute  left-2 mt-1"/>
                             <span className="absolute  left-8 ">{dato.nombre} </span>
                             <span className="absolute right-2">({dato.count})</span>
                         </div>
                     )
                 })}
                 {  marcas.length > 5 &&
                    <div className="flex items-center justify-center content-center" >
                      <button className="w-[50%] m-2 bg-slate-200 border-2 border-slate-400 hover:bg-slate-300 transition duration-300 rounded-lg" type="button" onClick={() => setExp(!exp)}>
                      {!exp ? 'Ver más' : 'Ver menos'} 
                      </button> 
                    </div>
                 }
                  
              </div>
          </div>
          </div>
                   
      </div>
      </div>       
        <div className="mt-4 lg:mt-12 relative z-0">
        <Grid productos={filtrado_productos}/>
        </div>
      <div className='w-[10%] hidden lg:flex '>
      <Anuncios anuncios={anuncios}/>
      </div>

      </div>      
      </div>
     }
     <Footer/>
     
 </div>
       
       
  )
}

export async function getServerSideProps(context) {
  try {
    const nombre =context.params.nombre
  const data = await fetch(`https://new-components-delta.vercel.app/api/categorias/${nombre}`); const json = await data.json()
  const data2 = await fetch(`https://new-components-delta.vercel.app/api/tipo/anuncios`); const json2 = await data2.json()
  
  return {
    props:{productos : json, anuncios: json2, query: nombre},
  }
  }catch (error) {
      res.statusCode = 404
      return { props: {}}
  }
}
/*
export async function getStaticProps(context) {
  try {
    const nombre =context.params.nombre
  const data = await fetch(`https://new-components-delta.vercel.app/api/categorias/${nombre}`); const json = await data.json()
  const data2 = await fetch(`https://new-components-delta.vercel.app/api/tipo/anuncios`); const json2 = await data2.json()
  
  return {
    props:{productos : json, anuncios: json2, query: nombre},
    revalidate: 10
  }
  }catch (error) {
      res.statusCode = 404
      return { props: {}}
  }
}
export async function getStaticPaths() {
  const res = await fetch('https://new-components-delta.vercel.app/api/categorias')
  const post = await res.json()
  const paths = post.map((post) => ({
    params: { nombre: post.nombre}
  }))
  return {paths, fallback: 'blocking'}
}
 */

