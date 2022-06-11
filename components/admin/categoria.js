import {  useState} from 'react'
import { useRouter } from 'next/router'
import { app } from '../firebase'
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import Swal from "sweetalert2/dist/sweetalert2.all"
import {getFirestore, query, where, getDocs, collection, addDoc} from 'firebase/firestore'
export default function categoria() {
    const [nombre, setNombre] = useState('')
    const storage = getStorage(app)
    const [imagen, setImagen] = useState(null)
    const router = useRouter()
    const db = getFirestore(app)

    const onChange = (e) => {
    const reader = new FileReader()
    const image = e.target.files[0]
    if (image) {
        reader.onload = () => {
            if (reader.readyState === 2) {
                setImagen(image)
            }}
        reader.readAsDataURL(e.target.files[0])
    }else {
        setImagen(null)
    }
} 
    const onChange2 = (e) => {
        setNombre(e.target.value)
      }
    const onSubmit = async  (e) => {
        e.preventDefault()
        const cat =  collection(db, "categorias")
        const c = query(cat, where("nombre", "==", nombre))
        const num_cat = await getDocs(cat); var numero = num_cat.size; numero ++
        const docs = await getDocs(c)
        if (docs.empty) {
            var nombre2 = nombre.toLowerCase()
            const storageRef = sRef(storage, `categorias/${nombre2}`)    
            uploadBytes(storageRef, imagen).then(() => {
                getDownloadURL(storageRef).then((url) => {
                addDoc(cat, {
                    id: numero++,
                    nombre: nombre,
                    nombre2: nombre2,
                    url: url
                }).then(() =>{
                    Swal.fire({
                        title:"Categoría creada",
                        text:"La Categoría se ha creado correctamente",
                        icon:"success" 
                    })
                })                    
                   
                })

            }).catch((error) => {
                console.log(error);
            })
        }else {
            Swal.fire({
                title:"Error Categorías",
                text:"La Categoría ya existe",
                icon:"warning"
            }).then(() => {
                router.reload()
            })
        }
    }
  return (
    <div>
      <div className='w-full border-b-2'>
        <h2 className='m-[23px] md:m-3  font-bold'>Crear Categoría</h2>
      </div>
      <div className='m-12'>
        <form onSubmit={onSubmit} className='flex flex-col flex-1  items-center justify-content content-center space-y-4'>
        <span className=' font-semibold'> Nombre Categoría</span>   
        <input onChange={onChange2} type='text' className='border-2 p-2' placeholder=' Ejemplo: Componentes' pattern='^[A-Za-z0-9]{3,14}$' required/>
        <span className=' font-semibold'>Imagen de la Categoría</span>
        <input onChange={onChange} type='file' accept='image/png, image/jpg' className='w-48 md:w-auto' required/>
        <button className='p-2 w-24 text-white bg-blue-500 shadow-xl rounded-lg hover:bg-blue-600 transition duration-300'> Añadir </button>
        </form>

      </div>
      
    </div>
  )
}
