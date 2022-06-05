import {db, auth} from '../../../components/firebase/firebaseAdmin'

export  default async  (req, res) => {
    auth.getUserByEmail('admin@admin.com').then((userRecord) => {
        const user = userRecord.toJSON();
        user.uid = req.body.id ? actualizar(req,res)
        : res.status(201).end("Usuario no permitido")
    })

}

const actualizar = async (req, res) => {
    if (req.method === 'PUT') {
        if (req.body.data) {
            const data = req.body.data
            const dest = await  db.collection("destacados").where("nombre2","==",data.nombre).get()
            const unidades = parseInt(data.unidades)
            await dest.docs[0].ref.update({stock : unidades })
            res.status(200).end('Productos Actualizados')    

 
         }else if (req.body.carrito) {
         const carrito = req.body.carrito
         await Promise.all(
         carrito.map(async (producto) => {
             const dest = await  db.collection("destacados").where("id","==",producto.producto.id).get()
             const ref = dest.docs[0]
             const unidades = ((ref.data().stock)-producto.unidades)
             await ref.ref.update({ stock : unidades})
             res.status(200).end('Productos Actualizados')    

         }))
        }else {
            const producto = req.body.producto[0].producto
            const dest = await  db.collection("destacados").where("id","==",producto.id).get()
            const ref = dest.docs[0]
            const unidades = ((ref.data().stock)-req.body.producto.unidades)
            await ref.ref.update({ stock : unidades})
            res.status(200).end('Productos Actualizados')    

        }
 }else {
     res.setHeader('Allow', 'PUT')
     res.status(405).end('Método no permitido')
    }
}