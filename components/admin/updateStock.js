import { useEffect, useState} from 'react'
import { useRouter } from 'next/router'
import { app } from '../firebase'
import Swal from "sweetalert2/dist/sweetalert2.all"
import Select from 'react-select'
import {getFirestore, getDocs, collection} from 'firebase/firestore'
import axios from 'axios'
export default function updateStock( {id} ) {
    const [productos, setProductos] = useState([])
    const router = useRouter()
    const [selected, setselected] = useState(null)
    const [stock, setStock] = useState(0)

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
        var prod = categorias.docs.map((doc) => {return ( {value: doc.data().nombre2, label:doc.data().nombre, stock: doc.data().stock} )})
        setProductos(prod)
    }
    const update = async  (e) => {
        e.preventDefault()
        
     if (selected && id) {
        Swal.fire({
            title:"Actualizar Stock",
            text: `¿Estás seguro de actualizar el stock del producto: ${selected.label} ?`,
            icon: "question",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'SI',
            cancelButtonText: 'NO',}).then( async (resp) => {
                if (resp.isConfirmed) {
                    if (stock == selected.stock || stock < 10) { Swal.fire({title:"Error Stock",text:"las unidades deben ser diferentes a las actualizas y superiores a 10",icon:"warning"})
                    }else {
                        const resul = await axios.put('/api/productos/putProducto', {data: { nombre: selected.value, unidades: stock}, id:id},{headers: {'Content-Type': 'application/json'}})
                        if (resul.status == 200)  {Swal.fire({title:"Producto Actualizado",text:"Se ha actualizado el stock correctamente",icon:"success"})
                            router.reload()
                        }else   Swal.fire({title:"Error Producto",text:"Ha habido un error, intentelo más tarde",icon:"warning"})
                    }  
                }
            })
     }else {
         Swal.fire({title:"Producto no seleccionado",text:"No se encuentra ningun poducto seleccionado",icon:"warning"})
     }
    }
    const onStock = (e) => {
        setStock(e.target.value)
    }
    useEffect(() => {
      if (selected) setStock(selected.stock)
    }, [selected])
    
  return (
    <div>
    <div className='w-full border-b-2'>
      <h2 className='m-[23px] md:m-3 font-bold'>Actualizar Stock</h2>
    </div>
    <div className='m-8'>
    {
         productos.length !== 0 &&
         <div className='flex flex-col flex-1  items-center justify-content content-center space-y-4'>
            <span className=' font-semibold'> Productos Disponibles</span>   
             <Select className='react-select' value={selected} onChange={handleselect} options={productos} isSearchable={true} placeholder='Productos'/>
             <span className=' font-semibold'> Unidades</span>   
            <input  type='number' className='border-2 p-2 w-24' value={stock} onChange={onStock}  required/>
             <button onClick={update} className='p-2 w-24 text-white bg-blue-500 shadow-xl rounded-lg hover:bg-blue-600 transition duration-300'> Actualizar </button>
         </div>
        }

    </div>
    
  </div>
  )
}
