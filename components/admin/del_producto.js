import { useEffect, useState} from 'react'
import { useRouter } from 'next/router'
import { app } from '../firebase'
import Swal from "sweetalert2/dist/sweetalert2.all"
import Select from 'react-select'
import {getFirestore, getDocs, collection, c} from 'firebase/firestore'
import axios from 'axios'
export default function del_producto({id}) {
    const [productos, setProductos] = useState([])
    const router = useRouter()
    const [selected, setselected] = useState(null)

    const db = getFirestore(app)
    useEffect(() => {
        getProd()
        
    }, [])
    const handleselect = (opcion) => {
        setselected(opcion)
      }
    const getProd = async () => {
        const pro =  collection(db, "destacados")
        const categorias = await getDocs(pro)
        var prod = categorias.docs.map((doc) => {return ( {value: doc.data().nombre2, label:doc.data().nombre} )})
        setProductos(prod)
    }
    const delProd = async  (e) => {
        e.preventDefault()
        
     if (selected) {
        Swal.fire({
            title:"Eliminar Producto",
            text: `¿Estás seguro de eliminar el producto: ${selected.label} ?`,
            icon: "question",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'SI',
            cancelButtonText: 'NO',}).then( async (resp) => {
                if (resp.isConfirmed) {
                    const resul = await axios.delete('/api/productos/DelProducto', {data: {value: selected.value, id:id}},{headers: {'Content-Type': 'application/json'}})
                if (resul.status == 200)  {
                    Swal.fire({title:"Producto Eliminado",text:"Se ha eliminado el producto correctamente",icon:"success"}).then(()=> router.reload())
                }
                else   Swal.fire({title:"Error Producto",text:"Ha habido un error, intentelo más tarde",icon:"warning"})
                }
            })
     }else {
         Swal.fire({title:"Categoria no seleccionada",text:"No se encuentra ninguna categoria seleccionada",icon:"warning"})
     }
    }
  return (
    <div>
    <div className='w-full border-b-2'>
      <h2 className='m-[23px] md:m-3  font-bold'>Eliminar Producto</h2>
    </div>
    <div className='m-24'>
    {
         productos.length !== 0 &&
         <div className='flex flex-col flex-1  items-center justify-content content-center space-y-4'>
             <span className='font-semibold'> Producto</span>
             <Select className='react-select' value={selected} onChange={handleselect} options={productos} isSearchable={true} placeholder='Productos'/>
             <button onClick={delProd} className='p-2 w-24 text-white bg-blue-500 shadow-xl rounded-lg hover:bg-blue-600 transition duration-300'> Eliminar </button>
         </div>
        }

    </div>
    
  </div>
  )
}
