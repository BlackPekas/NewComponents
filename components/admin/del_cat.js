import { useEffect, useState} from 'react'
import { useRouter } from 'next/router'
import { app } from '../firebase'
import Swal from "sweetalert2/dist/sweetalert2.all"
import Select from 'react-select'
import {getFirestore, getDocs, collection} from 'firebase/firestore'
import axios from 'axios'
export default function del_cat({id}) {
    const [cat, setCat] = useState([])
    const router = useRouter()
    const [selected, setselected] = useState(null)

    const db = getFirestore(app)
    useEffect(() => {
        getCat()
      
    }, [])
    const handleselect = (opcion) => {
        setselected(opcion)
      }
    const getCat = async () => {
        const cat =  collection(db, "categorias")
        const categorias = await getDocs(cat)
        var prueba = categorias.docs.map((doc) => {return ( {value: doc.data().nombre, label:doc.data().nombre} )})
        setCat(prueba)
    }
    const DelCat = async  (e) => {
        e.preventDefault()
        
     if (selected) {
        Swal.fire({
            title:"Eliminar Categoria",
            text: "¿Estás seguro de eliminar la categoria?",
            icon: "question",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'SI',
            cancelButtonText: 'NO',}).then( async (resp) => {
                if (resp.isConfirmed) {
                const resul = await axios.delete('/api/categorias/DelCategoria', {data: {value :selected.value, id:id}},{headers: {'Content-Type': 'application/json'}})
                if (resul.status == 200)  {Swal.fire({title:"Categoria Eliminada",text:"Se ha eliminado la caegoria correctamente",icon:"success"})
                    router.reload()
                }
                else   Swal.fire({title:"Error Categoria",text:"La categoria contiene productos",icon:"warning"})
            }
            })
     }else {
         Swal.fire({title:"Categoria no seleccionada",text:"No se encuentra ninguna categoria seleccionada",icon:"warning"})
     }
    }
  return (
    <div>
    <div className='w-full border-b-2'>
      <h2 className='m-[23px] md:m-3  font-bold'>Eliminar Categoria</h2>
    </div>
    <div className='m-24'>
    {
         cat.length !== 0 &&
         <div className='flex flex-col flex-1  items-center justify-content content-center space-y-4'>
             <span className='font-semibold'> Categoria</span>
             <Select className='react-select' value={selected} onChange={handleselect} options={cat} isSearchable={false} placeholder='Categoria'/>
             <button onClick={DelCat} className='p-2 w-24 text-white bg-blue-500 shadow-xl rounded-lg hover:bg-blue-600 transition duration-300'> Eliminar </button>
         </div>
        }

    </div>
    
  </div>
  )
}
