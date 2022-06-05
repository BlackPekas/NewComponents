import { getAuth, signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth'
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import { app } from '../components/firebase'
import {getFirestore, doc, getDoc} from 'firebase/firestore'
import Swal from "sweetalert2/dist/sweetalert2.all"

export default function Form() {
    const auth = getAuth();
    const router = useRouter();
    const db = getFirestore(app)
    const [values, setValues] = useState({
        email:"",
        contraseña:"",
    })
    const [preparado, setPreparado] = useState(false)

    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value})
    }

    const signin = () => {
            signInWithEmailAndPassword(auth, values.email, values.contraseña)
            .then((response) => {
                getDoc(doc(db,"usuarios",response.user.uid)).then((doc) => {
                    const rol = doc.data().rol
                    if (rol) {
                        router.push("/admin_panel")
                    }else {
                        Swal.fire({
                            title:"Error Usuario",
                            text:"El usuario no tiene acceso.",
                            icon:"warning"
                        })
                    }
                })
            }).catch( (error) => {
                 const problema = error.message
                 const err_pass = problema.includes("auth/wrong-password")
                 const err_email = problema.includes("auth/user-not-found")
                 var msg = ""
                 if (err_email) msg ="La cuenta no existe"
                 else if (err_pass)  msg ="La contraseña no coincide"
                 Swal.fire({title:"Error Cuenta",text:msg,icon:"success"})
                })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        signin();
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            if (user.providerData[0].providerId !== 'google.com') {
                getDoc(doc(db,"usuarios",user.uid)).then((doc) => {
                    const rol = doc.data().rol
                    if (rol) {
                      router.push("/admin_panel")
                  }else router.push("/")    
                })
            }else router.push("/")
              
          }else {setPreparado(true)}
        })
      },[])


  return (
            
            preparado &&
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div class="px-8 py-6 mt-4 text-left bg-white shadow-lg">
            <h3 class="text-2xl font-bold text-center">Admin Login</h3>
               <form onSubmit={handleSubmit} className='flex flex-col flex-1 space-y-8 mt-4'>                        
               <input type="email" 
               placeholder="E-mail*"
               name="email"
               className="rounded border p-2  hover:bg-indigo-50 duration-15 hover:border-blue-400"
               onChange={onChange}
               value={values.email}
               required/>
               <input type="password" 
               placeholder="Contraseña*" 
               name="contraseña"
               className="rounded border p-2 hover:bg-indigo-50 duration-15 hover:border-blue-400"
               onChange={onChange}
               value={values.password}
               required/>
        
               <button className="rounded p-2 bg-blue-500 text-center text-white justify-center hover:bg-blue-600 duration-300">
               <h2 className=" text-xl text-white">Iniciar Sesión</h2>
               </button>
               </form>
            </div>
            </div> 
                
            
             )
}