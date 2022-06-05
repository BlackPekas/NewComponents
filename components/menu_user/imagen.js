import {  useState} from 'react'
import { useRouter } from 'next/router'
import {  getAuth, updateProfile } from 'firebase/auth'
import { app } from '../firebase'
import { getStorage, ref as sRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { v4 } from 'uuid'
import Swal from "sweetalert2/dist/sweetalert2.all"

export default function imagen() {
  const auth = getAuth()
  const storage = getStorage(app)
  const [imagen, setImagen] = useState(null)
  const router = useRouter()
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

  const onSubmit =  (e) => {
    e.preventDefault()
        if (imagen) {
            Swal.fire({
               title:"Cambiar Imagen Perfil",
               text: "¿Estás seguro de cambiar tu imagen de perfil?",
               icon: "question",
               showCancelButton: true,
               showConfirmButton: true,
               confirmButtonText: 'SI',
               cancelButtonText: 'NO',
           }).then((resp) => {
               if (resp.isConfirmed) {
                const storageRef = sRef(storage, `img_users/${imagen.name + v4()}`)    
                uploadBytes(storageRef, imagen).then(() => {
                    getDownloadURL(storageRef).then((url) => {
                        const defaultimg = 'https://firebasestorage.googleapis.com/v0/b/pekomponents.appspot.com/o/img_users%2F1177568.png?alt=media&token=e922c5bf-2fd8-44a6-9173-650e714b9e36'
                        if (auth.currentUser.photoURL === defaultimg) {
                            updateProfile(auth.currentUser, {
                                photoURL: url
                            })
                        }else {
                            const imageRef = sRef(storage, auth.currentUser.photoURL)
                            deleteObject(imageRef).then(() => {
                            updateProfile(auth.currentUser, {
                                photoURL: url
                            }) 
                        })

                        }
                        Swal.fire({
                          title: "Imagen Actualizada",
                          text: "Se ha actualizado la imagen con éxito",
                          icon: "success"
                        }).then(() => {
                          router.reload()
                        })
                       
                    })

                }).catch((error) => {
                    console.log(error);
                })

               }
           }) 
        }else {
            Swal.fire({
                    title:"No se encuentra ninguna foto",
                    icon:"warning",
                })
        }
    }  
  
  return (

    <div>
      <div className='w-full border-b-2'>
        <h2 className='m-3 font-bold'>Cambiar Imagen</h2>
      </div>
      <div className='m-16'>      
        <form onSubmit={onSubmit} className='flex flex-col flex-1  items-center justify-content content-center space-y-4'>
          <span className=' font-semibold'>Imagen de Perfil</span>
            <input onChange={(e) => onChange(e)} type='file' accept='image/png, image/jpg' className='w-full'/>
          <button className='p-2 w-24 text-white bg-blue-500 shadow-xl rounded-lg hover:bg-blue-600 transition duration-300'> Actualizar </button>
        </form>
    </div>
      
    </div>
    

  )
}
