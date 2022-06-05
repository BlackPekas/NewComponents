import {useState, useEffect} from "react";
import Grid from "../../components/main/grid_products";
import Anuncios from '../../components/main/anuncios'
import { ChevronDownIcon, XIcon , RefreshIcon} from '@heroicons/react/outline'
import Footer from '../../components/footer/footer'
import Select from 'react-select'
import Navbar from "../../components/navbars/navbar";
export default function query( {productos, query, anuncios, categorias, marcas} ) {
  const [menu, setMenu] = useState(false)
  const [menu2, setMenu2] = useState(false)
  const [menu3, setMenu3] = useState(false)
  const [cat_check, setcat_check] = useState(Array(categorias.length).fill(false))
  const [cat, setCat] = useState([])
  const [marc, setMarc] = useState([])
  const [marca, setMarca] = useState(marcas)
  const [marcas_check, setMarcas_check] = useState(Array(marca.length).fill(false))              
  const [filtrado_marc, setFiltrado_marc] = useState([])
  const [exp, setExp] = useState(false)
  const mostrar_marcas = exp ? marca : marca.slice(0,4) 
  const [selected, setselected] = useState(null)


  const onChange = (e, key ) => {
    const update = cat_check.map((dato, index) => index === key ? !dato : dato)
    setcat_check(update)    
  }
  const onChange2 = (e, key) => {
    const update = marcas_check.map((dato, index) => index === key ? !dato : dato)
    setMarcas_check(update)
  }
  useEffect(() => {
    if ( !cat_check.includes(true) ) {
      setCat(productos)
    }else { 
      const filtrados = categorias.filter((dato, index) => cat_check[index] === true)
      setCat(productos.filter((dato) => filtrados.some((e) => e.nombre === dato.categoria )))

    }

  }, [cat_check])

  useEffect(() => {
    const new_marc =  cat.map(dato => {return {"nombre" : dato.marca} })
    const marcas_duplicadas = [...new_marc.reduce( (mp, o) => {
        if (!mp.has(o.nombre)) mp.set(o.nombre, { ...o, count: 0 });
        mp.get(o.nombre).count++;
        return mp;
    }, new Map).values()];
    setMarca(marcas_duplicadas)
  }, [cat])
  useEffect(() => {
    setMarcas_check(Array(marca.length).fill(false))
  }, [marca])
  useEffect(() => {
    setCat(productos)
  }, [productos])
  useEffect(() => {
      if ( !marcas_check.includes(true) ) {
        setFiltrado_marc(marca)
      }else { 
        setFiltrado_marc(marca.filter((dato, index) => marcas_check[index] === true))
    }
  }, [marcas_check])
  useEffect(() => {
    if ( !marcas_check.includes(true) ) {
      setMarc(cat)
    }else { 
      setMarc(cat.filter((dato) => filtrado_marc.some((e) => e.nombre === dato.marca)))
  }
  }, [filtrado_marc])

  const handleselect = (opcion) => {
    setselected(opcion)
  }
  const options = [{value: 'PASC', label: 'Precio Asc'},{value: 'PDES', label: 'Precio Desc'},{value: 'RASC', label: 'Rebaja Asc'},{value: 'RDES', label: 'Rebaja Desc'}]
  useEffect(() => {
    if (selected != null) {
      if (selected.value == 'PASC') {
        const sorted = cat.sort((a,b) => a.precio-b.precio)
        setCat([...sorted])
      }else if (selected.value == 'PDES') {
        const sorted = cat.sort((a,b) => b.precio-a.precio)
        setCat([...sorted])
      }else if (selected.value == 'RDES') {
        const sorted = cat.sort((a,b) => b.descuento-a.descuento)
        setCat([...sorted])
      }else if (selected.value == 'RASC') {
        const sorted = cat.sort((a,b) => a.descuento-b.descuento)
        setCat([...sorted])
      }

    }
  },[selected])

  const limpiarFiltro = () => {
    setMarcas_check(Array(marca.length).fill(false))
    setMarc(cat)
    setcat_check(Array(categorias.length).fill(false))

  }
  return (
   <>
      <Navbar/>
      <div className='w-full h-[52px]'></div>
       {productos.length < 1 ? 
          <div className=' w-full  text-center justify-center content-center my-32'>
            <span className='text-xl'> No se han encontrado busquedas Relacionadas con "{query}" </span>
            <img className="w-[200px] xl:w-[400px] ml-24 lg:ml-[30rem] 2xl:ml-[80vh]" src='https://firebasestorage.googleapis.com/v0/b/pekomponents.appspot.com/o/jungle-404.gif?alt=media&token=e28cfb8d-34a0-4d30-8655-74c45aabd487'></img>     
        </div>
        :
        <div className='flex flex-1 flex-col'>
        <div className=' hidden md:flex  mt-10 ml-8'>
        <span className=' text-3xl '> +{productos.length} productos encontrados</span>
        </div>

          <div className=" items-center content-center justify-center mt-24  mx-0 sm:mx-[20rem] md:mx-[30rem] lg:mx-[40rem] xl:mx-[50rem] 2xl:mx-[70rem] hidden md:flex absolute">
          <Select className='react-select' value={selected} onChange={handleselect} options={options} isSearchable={false} placeholder='Ordenar'/>
          </div>
          <div className=" flex md:hidden relative items-center text-center">
          <div className=' w-full mt-[74px] h-[40px] flex space-x-5 items-center mx-8  sm:mx-36'>   
            <button onClick={() => {setMenu3(!menu3)}} className=' p-2 w-24 rounded-md border-[1px] text-gray-600 border-slate-400 text-sm font-semibold '>Filtrar</button>
            <Select className='react-select' value={selected} onChange={handleselect} options={options} isSearchable={false} placeholder='Ordenar'/>

              {
                menu3 &&
                <div className={`${ menu3 ? 'right-0' : '-right-[400px]'} fixed    flex flex-col flex-1 top-14 overflow-y-auto scrollbar z-40 transition-all duration-500 h-[130vh] w-full bg-white `}>
                  <div className="w-full border-b-2 text-start flex space-x-4 p-2 relative">
                    <XIcon onClick={() => {setMenu3(!menu3)}} className="h-8"/>
                    <span className="font-semibold text-lg "> Filtrar Productos</span>
                    <RefreshIcon onClick={limpiarFiltro} className="absolute right-6 h-8"/>
                  </div>
                  <div className="flex flex-1 flex-col  ">
                  <div>
                  <div className="content-center text-center justify-center">
                  <button onClick={() => {setMenu(!menu)}} className="flex justify-center content-center text-center w-full p-2 border-b-2">
                    <span> Categorias </span>
                    <ChevronDownIcon width={24} className={`${!menu ? 'rotate-0' : 'rotate-180'} transform duration-500`}/>
                </button>
                <div className={` ${!menu ? 'hidden' : 'flex'} flex-col flex-1 text-center space-y-2 border-b-2 my-2 `}>
                   {categorias.map((dato, key) => {
                       return (
                           <div onClick={(e) => onChange(e, key)} className=" relative h-10 cursor-pointer inline justify-center text-center content-center hover:bg-slate-300 transition duration-500" key={key}>
                               <input checked={cat_check[key]} type="checkbox" value={dato.nombre} className="absolute  left-2 mt-2"/>
                               <span>{dato.nombre} </span>
                               <span className="absolute right-2">({dato.count})</span>

                           </div>
                       )
                   })}
                </div>
                  </div>
                  </div>
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
                   {  marca.length > 4 &&
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
        <div className="flex flex-1 flex-col m-2 space-y-2 mt-16 ">
        
            <div>
            <div className=" w-[22vh]  border-y-2 flex flex-1 flex-col">
                <button onClick={() => {setMenu(!menu)}} className="flex space-x-8 m-4 w-46 justify-center content-center text-center">
                    <span> Categorias </span>
                    <ChevronDownIcon width={24} className={`${!menu ? 'rotate-0' : 'rotate-180'} transform duration-500`}/>
                </button>
                <div className={` ${!menu ? 'hidden' : 'flex'} flex-col flex-1 text-center space-y-2 `}>
                   {categorias.map((dato, key) => {
                       return (
                           <div onClick={(e) => onChange(e, key)} className=" relative h-10 cursor-pointer inline justify-center text-center content-center hover:bg-slate-300 transition duration-500" key={key}>
                               <input checked={cat_check[key]} type="checkbox" value={dato.nombre} className="absolute  left-2 mt-2"/>
                               <span>{dato.nombre} </span>
                               <span className="absolute right-2">({dato.count})</span>

                           </div>
                       )
                   })}
                </div>
            </div>
            </div>
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
                   {  marca.length > 5 &&
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
          <div className="mt-4 md:mt-12 lg:mt-12 relative z-0">
          <Grid productos={marc}/>
          </div>
        <div className='w-[10rem] hidden md:flex '>
        <Anuncios anuncios={anuncios}/>
        </div>

        </div>      
        </div>
       }
       <Footer/>
       
   </>
  )
}

export async function getServerSideProps(context) {
    const { params } = context; const { query } = params
    const data = await fetch(`http://localhost:3000/api/tipo/destacados`); const json = await data.json()
    const data2 = await fetch(`http://localhost:3000/api/tipo/anuncios`); const json2 = await data2.json()
    const filtrado = json.filter((dato) => dato.nombre2.includes(query))
    const categorias =  query === 'all' ? 
     json.map(dato => {return {"nombre" : dato.categoria} })
    :  filtrado.map(dato => {return {"nombre" : dato.categoria} })
      const dupli = [...categorias.reduce( (mp, o) => {
        if (!mp.has(o.nombre)) mp.set(o.nombre, { ...o, count: 0 });
        mp.get(o.nombre).count++;
        return mp;
    }, new Map).values()];
    const marcas =  query === 'all' ? 
     json.map(dato => {return {"nombre" : dato.marca} })
    :  filtrado.map(dato => {return {"nombre" : dato.marca} }) 
      const dupli2 = [...marcas.reduce( (mp, o) => {
        if (!mp.has(o.nombre)) mp.set(o.nombre, { ...o, count: 0 });
        mp.get(o.nombre).count++;
        return mp;
    }, new Map).values()];
    const productos_final = query === 'all' ? json : filtrado
    return {
      props: { productos : productos_final, query : query, anuncios : json2, categorias: dupli, marcas : dupli2 }
    }
  }
  
