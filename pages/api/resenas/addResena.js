import {db, auth} from '../../../components/firebase/firebaseAdmin'
import {v4} from 'uuid'
export  default async  (req, res) => {
    auth.getUserByEmail('admin@admin.com').then((userRecord) => {
        const user = userRecord.toJSON();
        user.uid = req.body.id ? añadir(req,res)
        : res.status(201).end("Usuario no permitido")
    })
 


}

const añadir = async (req, res) => {
    if (req.method === 'POST') {
        const id= v4()
        const datos = req.body
        const date = new Date()
        const m = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+"   "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
        db.collection("reseñas").doc(id).set({texto:datos.texto, id:id, id_pedido:datos.id_pedido, producto:datos.nombre, estrellas:datos.stars, fecha:m, usuario:datos.user, foto:datos.img_user})
        db.collection("destacados")
        res.status(200).end('Reseña Añadida')    

 }else {
     res.setHeader('Allow', 'POST')
     res.status(405).end('Método no permitido')
    }
}