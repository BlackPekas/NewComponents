import {db, st, auth} from '../../../components/firebase/firebaseAdmin'

export  default async  (req, res) => {
    auth.getUserByEmail('admin@admin.com').then((userRecord) => {
        const user = userRecord.toJSON();
        user.uid = req.body.id ? borrar(req,res)
        : res.status(201).end("Usuario no permitido")
    })

}   

const borrar = async (req, res) => {
    if (req.method === 'DELETE') {
        var categoria = req.body.value
        var categoria2 = categoria.toString().toLowerCase()
     const dest = await  db.collection("destacados").where("categoria","==",categoria).get()
     const cat = await db.collection("categorias").where("nombre","==",categoria).get()
     if (cat.empty) {res.status(404).end("Categoria no encontrada")}
     else if (dest.empty){
         await cat.docs[0].ref.delete()
         await st.file(`categorias/${categoria2}`).delete()
         res.status(200)
         res.json("okey")
     }else {
         res.status(500)
         res.json("error")
     }
 }else {
     res.setHeader('Allow', 'DELETE')
     res.status(405).end('Método no permitido')
    }
}