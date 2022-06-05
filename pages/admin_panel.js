import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import { app } from "../components/firebase"
import {getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import Categoria from "../components/admin/categoria"
import Producto from "../components/admin/producto"
import Del_cat from "../components/admin/del_cat"
import Del_producto from "../components/admin/del_producto"
import UpdateStock from "../components/admin/updateStock"
import { doc, getFirestore, getDoc} from 'firebase/firestore'
export default function admin_panel() {
    const db = getFirestore(app)
    const [opcion, setOpcion] = useState(1)
    const auth = getAuth()
    const router = useRouter()
    const [id, setId] = useState("")
    const [preparado, setPreparado] = useState(false)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                if (user.providerData[0].providerId !== 'google.com') {
                    getDoc(doc(db,"usuarios",user.uid)).then((doc) => {
                        const rol = doc.data().rol
                        if (rol) {
                          setId(user.uid)
                          setPreparado(true)
                      }else router.push("/")    
                    })
                }else router.push("/")
            }else router.push("/admin")
          })
    
      },[])
    const cerrarSesion = () => {
        signOut(auth).then(() => {
            router.push("/admin")
        }).catch((error) => {
            console.log(error)
        })
    }

  return (
    preparado &&
    <div className="flex content-center justify-center text-center min-h-screen bg-gray-100">
            <div className='flex my-48 rounded-md bg-white shadow-lg'>
                <div className='w-[30vh] border-r-2' >
                        <div className='flex flex-1 flex-col text-start content-start '>
                                    <span className={`h-[72px] md:h-[50px] p-3 border-b-2`}></span> 
                                    <span onClick={() =>setOpcion(1)} className={` p-3 cursor-pointer hover:bg-blue-200 transition duration-300 border-b-2`}>Crear Categoria</span> 
                                    <span onClick={() =>setOpcion(2)} className={` p-3 cursor-pointer hover:bg-blue-200 transition duration-300 border-b-2`}>Añadir Producto</span> 
                                    <span onClick={() =>setOpcion(3)} className={` p-3 cursor-pointer hover:bg-blue-200 transition duration-300 border-b-2`}>Eliminar Categoria</span> 
                                    <span onClick={() =>setOpcion(4)} className={` p-3 cursor-pointer hover:bg-blue-200 transition duration-300 border-b-2`}>Eliminar Producto</span> 
                                    <span onClick={() =>setOpcion(5)} className={` p-3 cursor-pointer hover:bg-blue-200 transition duration-300 border-b-2`}>Actualizar Stock</span> 
                                    <span onClick={cerrarSesion} className={` p-3 cursor-pointer hover:bg-blue-200 transition duration-300 border-b-2`}>Cerrar Sesión</span> 

                        </div>
                </div>
                <div className='w-[78vh]'> 
                {
                    id != null &&
                    opcion == 1 ? <Categoria/> : opcion == 2 ? <Producto id={id}/> : opcion == 3 ?
                     <Del_cat id={id}/> : opcion == 4 ? <Del_producto id={id}/> : <UpdateStock id={id}/>
                }
                </div>
            </div>
    </div>
  )
}
