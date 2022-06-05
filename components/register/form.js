import Google from "../icons/Google"
import Link from "next/link"
import { getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth'
import { useRouter } from 'next/router'
import { useEffect, useState } from "react"
import Input from "../utilidades/Input"
import { app } from '../firebase'
import {getFirestore, doc, setDoc } from 'firebase/firestore'
import Swal from "sweetalert2/dist/sweetalert2.all"
export default function Reg_form() {
    const auth = getAuth()
    const db = getFirestore(app)
    const router = useRouter()
    const GoogleProvider = new GoogleAuthProvider()
    const [values, setValues] = useState({
        nombre:"",
        email:"",
        contraseña:"",
        confirmcontraseña:"",
    })
    const inputs = [
        {
            id:1,
            name:"nombre",
            type:"text",
            errormsg:"Campo obligatorio, de 3-14 carácteres",
            pattern:"^[A-Za-z0-9 ]{3,14}$",
            placeholder:"Nombre*"
        },
        {
            id:2,
            name:"email",
            type:"email",
            errormsg:"Campo obligatorio, formato de correo",
            pattern:"[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$",
            placeholder:"E-mail*"
        },{
            id:3,
            name:"contraseña",
            type:"password",
            errormsg:"Campo obligatorio, de 8-20 carácteres mínimo 1 especial",
            pattern:"(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$",
            placeholder:"Contraseña*"
        },{
            id:4,
            name:"confirmcontraseña",
            type:"password",
            errormsg:"Campo obligatorio, La contraseña no coincide",
            pattern: values.contraseña,
            placeholder:"Confirmar Contraseña*"
        }]
    const signUp = async  () => {
            createUserWithEmailAndPassword(auth,values.email,values.contraseña)
            .then(() => {
                updateProfile(auth.currentUser, {
                    displayName: values.nombre,
                    photoURL: "https://firebasestorage.googleapis.com/v0/b/pekomponents.appspot.com/o/img_users%2F1177568.png?alt=media&token=e922c5bf-2fd8-44a6-9173-650e714b9e36",
                }).then(() => {
                    setDoc(doc(db, "usuarios", auth.currentUser.uid), {
                        rol:false
                    }).then(() => {
                        signOut(auth).then(() => {
                            router.push("/login")
                        })
                    })                  
                })
            }).catch( (error) => {
                Swal.fire({
                    title: "Correo existente",
                    text: "Ya existe una cuenta asociada al correo introducido",
                    icon: "warning"
                })
            }) 
    }
    const signupGoogle = () => {
        signInWithPopup(auth, GoogleProvider)
        .then((response) => {
            sessionStorage.setItem('Token', response.user.accessToken)
            router.push("/")
        })
    }
    
    useEffect(() => {
        let token = sessionStorage.getItem('Token')
        if (token) router.push('/')
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        signUp();

    }

    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value})
    }
  return (
    <section className="p-6  lg:p-10 lg:w-[50%] w-[30em] ">
                <div className="flex flex-col justify-center flex-1 space-y-8 ">
                    <h1 className="font-bold text-2xl text-left">Crear Cuenta</h1>
                    <button onClick={signupGoogle} className="flex space-x-2 rounded border p-2 text-center justify-center transition ease-in-out delay-50 hover:-translate-y-1 hover:bg-indigo-50 duration-15 hover:border-blue-400">
                    <Google fill="white" className="h-6 "/>    
                    <h2 className=" text-xl">Entrar con Google</h2>
                    </button>
                    <span className="font-bold">o bien</span>
                    <form onSubmit={handleSubmit} className="flex flex-col justify-center text-left flex-1 space-y-2 ">
                    {inputs.map((input,key) => {
                        return <Input key={key} {...input} value={values[input.name]} onChange={onChange}/> 
                        })}
                    <button className="rounded p-2 bg-blue-500 text-center text-white justify-center hover:bg-blue-600 duration-300">
                    <h2 className=" text-xl text-white">Crear Cuenta</h2>
                    </button>
                    </form>
                    <span className="font-bold"> ¿Ya tienes cuenta?</span>
                    <Link href="/login" >
                        <a className="flex space-x-2 rounded border p-2 text-center justify-center transition ease-in-out delay-50 hover:-translate-y-1 hover:bg-indigo-50 duration-15 hover:border-blue-400">
                            <button >
                            <h2 className=" text-xl">Iniciar Sesion</h2>
                            </button>
                        </a>
                    </Link>
                </div>

            </section>
  )
}
