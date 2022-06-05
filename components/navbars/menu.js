 import { useEffect, useState } from "react"
 import { MenuAlt1Icon , XIcon} from "@heroicons/react/outline"
 import { collection, getFirestore, onSnapshot, } from 'firebase/firestore'
 import { app } from "../firebase"
 import Link from "next/link"
 import { useRouter } from "next/router"
 import axios from "axios"
export default function Menu() {
    const router = useRouter()
    const db = getFirestore(app)
    const [datos, setDatos] = useState([])
    const coleccion = collection(db,"categorias")
    const [mostrar, setMostrar ] = useState(false)

    useEffect(() => {
            getCat()
            
        },[]
    )
    const getCat = async () => {
        const categorias = await axios.get('http://localhost:3000/api/categorias',{headers: {'Content-Type': 'application/json'}})
        if (categorias.status == 200) {
            setDatos(categorias.data)
        }
    }

  return (
      <>
            <button  onClick={() => {setMostrar(!mostrar)}} className='flex items-center rounded mr-2 md:mr-8 lg:mr-12 sm:mr-6'>
            { !mostrar ?<MenuAlt1Icon className='h-8  cursor-pointer'/> : 
            <XIcon className='h-8 cursor-pointer'/> }
            </button>
        
    <div>
    <div className={` ${mostrar ? 'left-0' : '-left-[400px]'} transition-all duration-500 mt-[30px]  fixed h-auto w-[15rem] bg-white shadow-lg rounded-lg`}>
        <div className=" flex flex-1 flex-col m-4 space-y-4 items-center justify-center text-center">
              <Link href={`/find/all`}>
               <div  className="w-full h-8 cursor-pointer hover:text-blue-700 transition duration-300  ">
                   <span className="underline underline-offset-4 font-semibold text-xl"> Mostrar Todo</span>
               </div>
              </Link>
            {datos.map((dato,key ) => {
               return  (
              <Link key={key} href={`/categorias/${dato.nombre}`}>
               <div  className="w-full h-8 cursor-pointer hover:text-blue-700 transition duration-300  ">
                   <span className="underline underline-offset-4 font-semibold text-xl"> {dato.nombre}</span>
               </div>
              </Link>
                )
            })}
        </div>
    </div>
    </div>
    
            
            
      </>
    
  )
}
