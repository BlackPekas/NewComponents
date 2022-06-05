import Google from "../icons/Google"
import Link from "next/link"
import { getAuth, GoogleAuthProvider, signInWithPopup , signInWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth'
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import { app } from '../firebase'
import Swal from "sweetalert2/dist/sweetalert2.all"
export default function Form() {

    const auth = getAuth();
    const router = useRouter();
    const GoogleProvider =  new GoogleAuthProvider()
    const [values, setValues] = useState({
        email:"",
        contraseña:"",
    })
    const [err_msg, setErr_msg] = useState('');

    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value})
    }

    const signinGoogle = () => {
        signInWithPopup(auth, GoogleProvider)
        .then((response) => {
            sessionStorage.setItem('Token', response.user.accessToken)
            router.push("/")
        }).catch( (error) => {
            alert(error.message)
        })
    }
    const signin = () => {
            signInWithEmailAndPassword(auth, values.email, values.contraseña)
            .then((response) => {
                sessionStorage.setItem('Token', response.user.accessToken)
                router.push("/")
            }).catch( (error) => {
                 const problema = error.message
                 const err_pass = problema.includes("auth/wrong-password")
                 const err_email = problema.includes("auth/user-not-found")
                 if (err_email) setErr_msg("La cuenta no existe")
                 else if (err_pass) setErr_msg("La contraseña no coincide")
                 else setErr_msg('')
                })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        signin();
    }
    const resetEmail = () => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)) {
            
            sendPasswordResetEmail(auth, values.email).then(() => {
                Swal.fire({
                    title:"Correo enviado",
                    text: "Se ha enviado correctamente el correo electrónico para restablecer la contraseña, busque en la bandeja de entrada o en spam",
                    icon: "success",
                  })
            }).catch((err) => {
                console.log(err);
                Swal.fire({
                    title:"Error encontrado",
                    text: "no se ha podido enviar el correo debido a un error, vuelva a intentarlo más tarde o mire si el correo está bien escrito",
                    icon: "warning"
                })
            })
        }else {
            Swal.fire({
                title:"Formato erróneo",
                text: "no se ha introducido una cuenta de correo, porfavor introducela bien",
                icon: "warning",
              }).then(() => {
                
              })

        }

    }
    useEffect(() => {
        let token = sessionStorage.getItem('Token')
        if (token) router.push('/')
    }, [])


  return (
            <section className="p-6 lg:p-10 lg:w-[50%] w-[30em] ">
                <div className="flex flex-col justify-center flex-1 space-y-8 ">
                    <h1 className="font-bold text-2xl text-left">Iniciar Sesión</h1>
                    <button onClick={signinGoogle} className="flex space-x-2 rounded border p-2 text-center justify-center transition ease-in-out delay-50 hover:-translate-y-1 hover:bg-indigo-50 duration-15 hover:border-blue-400">
                    <Google fill="white" className="h-6 "/>    
                    <h2 className=" text-xl">Entrar con Google</h2>
                    </button>
                    <span className="font-bold">o bien</span>
                    <form onSubmit={handleSubmit} className="flex flex-col justify-center flex-1 space-y-8 ">                        
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
                    <span className={`border  border-red-400 p-2 rounded ${ err_msg == '' ? "invisible" : "visible"}`}>{err_msg}</span>
                        <span onClick={resetEmail} className="underline text-left hover:text-red-600 duration-200 hover:cursor-pointer" >He olvidado mi contraseña</span>
                    <button className="rounded p-2 bg-blue-500 text-center text-white justify-center hover:bg-blue-600 duration-300">
                    <h2 className=" text-xl text-white">Iniciar Sesión</h2>
                    </button>
                    </form>
                    <span className="font-bold"> ¿Eres nuevo cliente?</span>
                    <Link href="/register" >
                    <a className="flex space-x-2 rounded border p-2 text-center justify-center transition ease-in-out delay-50 hover:-translate-y-1 hover:bg-indigo-50 duration-15 hover:border-blue-400">
                            <button >
                            <h2 className=" text-xl">Crear Cuenta</h2>
                            </button>
                        </a>
                    </Link>
                </div>

            </section>  )
}
