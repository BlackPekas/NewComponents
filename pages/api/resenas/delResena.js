import {db, auth} from '../../../components/firebase/firebaseAdmin'
export  default async  (req, res) => {
    auth.getUserByEmail('admin@admin.com').then((userRecord) => {
        const user = userRecord.toJSON();
        user.uid = req.body.id ? añadir(req,res)
        : res.status(201).end("Usuario no permitido")
    })
 


}

const añadir = async (req, res) => {
    if (req.method === 'DELETE') {
        const datos = req.body
        const reseña = await  db.collection("reseñas").where("id","==",datos.id_resena).get()
        const ref = reseña.docs[0]
        const date = new Date()
         await ref.ref.delete()
         res.status(200).end('Reseña Eliminada')    

 }else {
     res.setHeader('Allow', 'DELETE')
     res.status(405).end('Método no permitido')
    }
}