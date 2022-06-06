import { useState, useEffect } from "react"
import StarRatings from 'react-star-ratings'
import axios from "axios"
import Swal from "sweetalert2"
import {useRouter} from "next/router"
import {getAuth} from 'firebase/auth'
import {app} from '../firebase'
export default function reseña( {nombre, id}) {
    const router = useRouter()
    const auth = getAuth()
    const [text, setText] = useState(false)
    const [texto, setTexto] = useState("")
    const [rating, setRating] = useState(0)
    const [editar, setEditar] = useState(false)
    const [reseña, setReseña] = useState("")

    const onInput = (e) => {
        setTexto(e.target.value)
    }
    const changeRating = (newRating) => {
        setRating(newRating)
    }
    useEffect(() => {
            getReseña()
    }, [])

    const getReseña = async () => {
        const reseña = await axios.get(
        'http://localhost:3000/api/resenas/getResena',
        { params: {nombre:nombre, id:id}},
        {headers: {'Content-Type': 'application/json'}})
    if (reseña.status == 200) {
            const data = reseña.data[0]
            if (data) {
            setTexto(data.texto)
            setRating(data.estrellas)
            setEditar(true)
            setReseña(data.id)
            }
    }
    }
    const enviar = async  () => {
        Swal.fire({
            title:"Enviar Reseña",
            text: `¿Estás segur@ de enviar la reseña?`,
            icon: "question",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'SI',
            cancelButtonText: 'NO',
        }).then( (resp) => {
            if (resp.isConfirmed) {
                if (!editar) {
                    axios.post('/api/resenas/addResena', {texto:texto, stars:rating, nombre:nombre, id:"z0veCvMfJNYacwze2l9P8XirvSm1", id_pedido:id, user:auth.currentUser.displayName, img_user: auth.currentUser.photoURL  }, {headers: {'Content-Type': 'application/json'}}).then((resp) => {
                        if (resp.status == 200) {
                            Swal.fire({
                                title:"Reseña Añadida",
                                tet:"La reseña se ha añadido con éxito",
                                icon:"success"
                            }).then(() => {router.reload()})
                        }
                }).catch((err) => {console.log(err);})
                }else  axios.put('/api/resenas/putResena', {texto:texto, stars:rating, nombre:nombre, id:"z0veCvMfJNYacwze2l9P8XirvSm1", id_pedido:id, id_resena:reseña}, {headers: {'Content-Type': 'application/json'}}).then((resp) => {
                    if (resp.status == 200) {
                        Swal.fire({
                            title:"Reseña Actualizada",
                            tet:"La reseña se ha actualizado con éxito",
                            icon:"success"
                        }).then(() => {router.reload()})
                    }
            }).catch((err) => {console.log(err);})
            }
        })
    }
    const cancelar = async () => {
        if (!editar) {
            setTexto("")
            setRating(0)
        }
        setText(!text)

    }
    const eliminar = async () => {
        Swal.fire({
            title:"Eliminar Reseña",
            text: `¿Estás segur@ de eliminar la reseña?`,
            icon: "question",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'SI',
            cancelButtonText: 'NO',
        }).then( (resp) => {
            if (resp.isConfirmed) {
                axios.delete('/api/resenas/delResena', {data: {id:"z0veCvMfJNYacwze2l9P8XirvSm1", id_resena:reseña}}, {headers: {'Content-Type': 'application/json'}}).then((resp) => {
                        if (resp.status == 200) {
                            Swal.fire({
                                title:"Reseña Eliminada",
                                tet:"La reseña se ha eliminado con éxito",
                                icon:"success"
                            }).then(() => {router.reload()})
                        }
                }).catch((err) => {console.log(err);})
            }
        })

    }
   return (
  <div className="flex flex-1 flex-col ">
  <div className="flex text-center content-center justify-center space-x-4">
  <button onClick={() => {setText(!text)}} className={`${ text ? 'hidden' : 'flex'} w-auto  p-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transtition duration-500 font-semibold`}>{editar ? 'Editar' : 'Escribir'} Reseña</button>
  <button onClick={eliminar} className={`${ text ? 'hidden' : 'flex'} ${ !editar ? 'hidden' : 'flex'} w-auto  p-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transtition duration-500 font-semibold`}>Eliminar reseña</button>

  </div>
  <div className={` ${text ? 'inline-block' : 'hidden'} flex flex-1 flex-col text-center justify-center content-center space-y-8`}>
      <label>Reseña (sin mínimo de carácteres)</label>
      <textarea onInput={onInput} value={texto} className=" border-2 p-2 my-4 resize-y max-h-32" placeholder="Escribe tu reseña aqui..."></textarea>
      <StarRatings rating={rating} starRatedColor="orange" changeRating={changeRating} numberOfStars={5} name='Rating'/>
      <div className="flex content-center justify-center -center space-x-4">
          <button onClick={enviar} className="w-32 p-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transtition duration-500 font-semibold">Enviar</button>
          <button onClick={cancelar} className="w-32 p-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transtition duration-500 font-semibold">Cancelar</button>

      </div>
  </div>
  </div>

  )
}