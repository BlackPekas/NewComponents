import { MinusIcon, PlusIcon , BellIcon, FireIcon } from "@heroicons/react/outline"
import { useState, useEffect } from "react"
import Swal from'sweetalert2'
import { useRouter } from 'next/router'
import axios from 'axios'
import getStripe from '../stripe/get-stripe'
export default function Info( { producto } ) {
    const router = useRouter()
    const precio_desc = ((producto.precio)-((producto.precio*producto.descuento)/100)).toFixed(2)
    const precio_garantia = (parseFloat(precio_desc)+35.2)
    const [ unidades, setUnidades ] = useState(1)
    const [garantia, setgarantia] = useState(false)
    const click = (tipo) => {
        tipo == "+" ? 
            producto.stock < 15 ? unidades != producto.stock && setUnidades(unidades+1) : unidades != 15 && setUnidades(unidades+1)
        :
            unidades != 1 && setUnidades(unidades-1)
    }
    const onChange = (e) => {
        setgarantia(e.target.checked)
    }
    const AddCart = () => {
       var precio_final = 0
       garantia ? precio_final=(precio_garantia*unidades).toFixed(2) : precio_final=(precio_desc*unidades).toFixed(2)
       
       const carrito = JSON.parse(localStorage.getItem('carritoprueba2'))
       if (carrito) {
        const index = carrito.findIndex(x => x.producto.nombre2 === producto.nombre2)
        if (index !== -1) {
                Swal.fire({
                    title:"Producto Existente",
                    text:"El producto "+producto.nombre+" ya existe en el carrito",
                    icon:'warning'
                })
        }else {
                carrito.push({producto : producto, unidades : unidades, precio_final:precio_final, precio_unidad : garantia ? precio_garantia : precio_desc, stripe_id : garantia ? producto.stripe_id[1] : producto.stripe_id[0] })
                localStorage.setItem('carritoprueba2', JSON.stringify(carrito))
                router.reload()
        }
    }else {
       const carrito_nuevo = []
       carrito_nuevo.push({producto : producto, unidades : unidades, precio_final:precio_final, precio_unidad : garantia ? precio_garantia : precio_desc, stripe_id : garantia ? producto.stripe_id[1] : producto.stripe_id[0] }) 
        localStorage.setItem('carritoprueba2', JSON.stringify(carrito_nuevo))
        router.reload()
    }
    }
    const redirectToCheckout = async () => {
        const token = sessionStorage.getItem('Token')
        if (!token) {
            Swal.fire({
                title:"Iniciar Sesión",
                text: "Se necesita iniciar sesión para comprar en NewComponents",
                icon: "warning",
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: 'Iniciar Sesión',
                cancelButtonText: 'Cancelar',
              }).then((resp) => {
                if (resp.isConfirmed) {
                    router.push("/login")
                }
                    
              })
        }else {
            var comprar = []
        var producto_stripe = {stripe_id: garantia ? producto.stripe_id[1] : producto.stripe_id[0] , unidades: unidades, producto: producto, precio: garantia ? precio_garantia : precio_desc}
        comprar.push(producto_stripe)
        const { data: {id},} = await axios.post('/api/checkout_sessions',{
            items: Object.entries(comprar).map(([_, { stripe_id, unidades}]) => ({
                price: stripe_id,
                quantity: unidades,
            }))
        })
        localStorage.setItem('producto',JSON.stringify(comprar))
        const stripe = await getStripe()
        await stripe.redirectToCheckout({ sessionId : id})
        }  
        
    }
        
  return (
    <div className=" mt-24 mx-0 sm:mx-24 md:mx-48 lg:mx-0 lg:ml-12 flex-1 flex flex-col mb-8 ">
        <h1 className="font-semibold text-2xl ">{producto.nombre}</h1>
        <div className=" relative space-x-2 sm:space-x-5 bottom-0">
        { producto.descuento != 0 ?
            <>
                <h3 className="font-semibold text-xl text-red-400 mb-2"> ¡Descuento por tiempo limitado!</h3>
             <span className=" font-bold text-red-600 text-3xl"> {precio_desc}€</span>
             <span className=" text-gray-400 line-through text-2xl ">{producto.precio}€</span>
             <span className=" shadow-sm p-2 bg-red-600  text-center text-white rounded-full font-semibold">-{producto.descuento}%</span>
            </>
         :
            <>
            <span className=" font-bold text-red-600 text-2xl"> {producto.precio}€</span>
            </>
         }
         
        </div>
            <div className=" mt-12 flex">
                <span className="mr-7 mt-0 font-semibold">Marca:</span>
                <span className=""> { producto.marca}</span>
            </div>
            <div className=" mt-4  flex">
                <span className="mr-7 mt-0 font-semibold">Modelo:</span>
                <span className=""> { producto.modelo}</span>
            </div>
            {
                producto.stock == 0 ?
                <div className=" mt-4  flex">
                </div>
                :
                <>
                <div className=" mt-4  flex">
                <span className="mr-7 mt-0 font-semibold">Unidades Restantes:</span>
                <span className=""> { producto.stock}</span>
                </div>
                <div className=" mt-4  flex">
                <span className="mr-7 mt-0 font-semibold">Unidades:</span>
                <div className=" flex border-2 rounded-lg border-slate-700">
                    <MinusIcon onClick={() => click("-")} className="w-6 p-1 cursor-pointer "/>
                    <input type="number" className="w-12 field focus:outline-none border-l-2 border-r-2 border-slate-700 text-center" value={unidades} min="1" max="50" step={1} disabled ></input>
                    <PlusIcon onClick={() => click("+")} className="w-6 p-1 cursor-pointer"/>
                </div>
                </div>
                </>
            }
            
            <div className=" mt-8 flex border-2 w-[16rem] lg:w-[25rem] rounded-full text-center justify-center p-1">
                <BellIcon className="w-10"/>
                <span className="m-2"> Envíos por todo el mundo </span>
            </div>
            <div className=" mt-8 flex ">
                    <div className="flex items-center content-center justify-center space-x-4">
                        <input type="checkbox" onChange={onChange} checked={garantia}/> 
                    <FireIcon width="20px" />
                    <label>Añadir 2 años de garantía extra.</label>
                    </div>
            </div>
           {
               producto.stock == 0 ?
                <div className="mt-8 flex w-full lg:w-[70%] 2xl:w-full ">
                    <span className="font-semibold rounded-lg text-center flex p-2 bg-red-500 text-white">Lo sentimos, Actualmente no tenemos unidades disponibles</span>
                </div>
               :
               <div className="mt-8 flex space-x-8">
               <button onClick={AddCart}  className="rounded p-3  text-center border-2 border-black justify-center hover:bg-gray-200 duration-300">
               <h2 className=" text-xl text-black font-bold">Añadir al Carrito</h2>
               </button>
               <button  className="rounded p-3 border-2 border-black bg-blue-500 text-center justify-center hover:bg-blue-600 duration-300">
               <h2 onClick={redirectToCheckout} className=" text-xl text-white font-bold">Comprar ahora</h2>
               </button>
               </div>
           }
    </div>
  )
}
