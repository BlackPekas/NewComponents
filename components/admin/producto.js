import { useEffect, useState} from 'react'
import { useRouter } from 'next/router'
import { app } from '../firebase'
import { getStorage, ref as sRef, uploadBytes, getDownloadURL,  } from 'firebase/storage'
import { v4 } from 'uuid'
import Swal from "sweetalert2/dist/sweetalert2.all"
import Select from 'react-select'
import {getFirestore, query, where, getDocs, collection} from 'firebase/firestore'
import axios from 'axios'

export default function producto( {id}) {
    const [nombre, setNombre] = useState('')
    const [imagenes, setImagenes] = useState([])
    const [marca, setMarca] = useState('')
    const [modelo, setModelo] = useState('')
    const [descuento, setDescuento] = useState(0)
    const [precio, setPrecio] = useState(320)
    const [stock, setStock] = useState(0)

    const [selected, setselected] = useState(null)

    const storage = getStorage(app)

    const [cat, setCat] = useState([])
    const router = useRouter()
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
    const onNombre = (e) => {
        setNombre(e.target.value)
    }
    const onStock = (e) => {
        setStock(e.target.value)
    }
    const onMarca = (e) => {
        setMarca(e.target.value)
    }
    const onDescuento = (e) => {
        setDescuento(e.target.value)
    }
    const onModelo = (e) => {
        setModelo(e.target.value)
    }
    const onPrecio = (e) => {
        setPrecio(e.target.value)
    }
    const onFiles = (e) => {
        var files = e.target.files
        var imgs = []
        for (var i = 0; i < files.length; i++) {
            var file = files[i]
            var reader = new FileReader(file)
            imgs.push(file)
            
            reader.readAsDataURL(file)
        }
        setImagenes(imgs)    }
    const onSubmit =  async (e) => {
        e.preventDefault()
        const dest = collection(db, "destacados")
        const c = query(dest, where("nombre", "==", nombre, "or", "modelo", "==", modelo))
        const num_dest = await getDocs(dest); var numero = num_dest.size; numero ++
        const docs = await getDocs(c)
        var nombre2 = nombre.replace(/\s+/g, '-').toLowerCase();
        if (docs.empty) {
            if (descuento < 0 || descuento >= 90)  {Swal.fire({title:"Descuento no válido",text:"El descuento supera los 90 o es inferior a 0.",icon:"warning"})
            }else if (selected == undefined) { Swal.fire({title:"Categoria Desconocida",text:"No se ha seleccionado categoria.",icon:"warning"}) 
            }else if (imagenes.length < 3) { Swal.fire({title:"Error Imagenes",text:"Se requiere un mínimo de tres imagenes",icon:"warning"})
            }else if (stock < 10 || !Number.isInteger(parseFloat(stock)) ){ Swal.fire({title:"Error Unidades",text:"comprueba que sea un número entero y que disponga de un mínimo de 11 unidades",icon:"warning"}) 
            }else {
                var num = 0

                 const imgs = await Promise.all(
                    imagenes.map(async (img) => {
                        num++
                        const storageRef = sRef(storage, `destacados/${nombre2}/${nombre + '-'+num}`)    
                        await uploadBytes(storageRef, img)
                        return await  getDownloadURL(storageRef)
                        })
                 )
                        var precio_desc = ((precio)-((precio*descuento)/100)).toFixed(2)
                        var precio2 = precio_desc; precio2 = (parseFloat(precio2)+35.2).toFixed(2)
                 var producto_final = {     
                        categoria: selected.value,
                        id:numero,
                        nombre: nombre,
                        nombre2: nombre2,
                        marca: marca,
                        modelo: modelo,
                        precio: parseFloat(precio_desc),
                        precio2: parseFloat(precio2),
                        descuento: parseInt(descuento),
                        stock: parseInt(stock),
                        url: imgs,
                 }
                 Swal.fire({
                    title:"Añadir Producto",
                    text: "¿Estás seguro de añadir este producto?",
                    icon: "question",
                    showCancelButton: true,
                    showConfirmButton: true,
                    confirmButtonText: 'SI',
                    cancelButtonText: 'NO',}).then( async (resp) => {
                        if (resp.isConfirmed) {        
                            axios.post('/api/productos/addProduct', {producto: producto_final, id:id}, {headers: {'Content-Type': 'application/json'}}).then((log) => {
                                Swal.fire({title:"Producto Creado",
                                text:"Se ha creado el producto con éxito",
                                icon:"success"}).then(() => router.reload())
                                
                            }).catch((err) => {console.log(err);})
                        }
                    })
            }
          
            }else {
            Swal.fire({
                title:"Error Producto",
                text:"El producto ya existe",
                icon:"warning"
            }).then(() => {

            })
        }
    }
  return (
    <div>
      <div className='w-full border-b-2'>
        <h2 className='m-[23px] md:m-3 font-bold'>Añadir Producto</h2>
      </div>
      <div className='m-8'>
        {
            cat.length !== 0 &&
            <form onSubmit={onSubmit}  className='flex flex-col flex-1  items-center justify-content content-center space-y-4'>
                <span className=' font-semibold'> Categoria</span>   
                <Select className='react-select' value={selected} onChange={handleselect} options={cat} isSearchable={false} placeholder='Categoria'/>
                <span className=' font-semibold'> Nombre Producto</span>   
                <input  type='text' className='border-2 p-2' placeholder=' Ejemplo: EVGA RTX 2070' pattern='^[a-zA-Z0-9 _]{3,40}$' value={nombre} onChange={onNombre} required/>
                <span className=' font-semibold'> Marca</span>   
                <input  type='text' className='border-2 p-2' placeholder=' Ejemplo: Nvidia' pattern='^[A-Za-z0-9]{4,13}$' value={marca} onChange={onMarca} required/>
                <span className=' font-semibold'> Modelo</span>   
                <input  type='text' className='border-2 p-2' placeholder=' Ejemplo: GB-232-LUD' pattern='^[A-Za-z0-9- -]{4,50}$' value={modelo} onChange={onModelo} required/>
                <span className=' font-semibold'> Descuento</span>   
                <input  type='number' className='border-2 p-2 w-12' value={descuento} onChange={onDescuento}  required/>
                <span className=' font-semibold'> Precio</span>   
                <input  type='number' className='border-2 p-2 w-24' value={precio} onChange={onPrecio}  required/>
                <span className=' font-semibold'> Unidades Disponibles</span>   
                <input  type='number' className='border-2 p-2 w-24' value={stock} onChange={onStock}  required/>
                <span className=' font-semibold'>Imagenes (3 mínimo)</span>
                <input  type='file' accept='image/png, image/jpg' onChange={onFiles} multiple min={3} className='w-48 md:w-auto'  required />
                <button className='p-2 w-24 text-white bg-blue-500 shadow-xl rounded-lg hover:bg-blue-600 transition duration-300'> Añadir </button>
            </form>
        }

      </div>
      
    </div>
  )
}
