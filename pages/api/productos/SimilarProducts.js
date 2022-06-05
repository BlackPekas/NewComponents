import {db, st} from '../../../components/firebase/firebaseAdmin'

export  default async  (req, res) => {
   if (req.method === 'GET') {
        const cat = req.query.categoria
        const nombre = req.query.nombre
        const productos  =await  db.collection("destacados").where("categoria","==",cat).get()
        const filtrado = productos.docs.filter((dato) => dato.data().nombre !== nombre)
        console.log(filtrado.map((dato) => dato.data()));
        res.json(filtrado.map((dato) => dato.data()))
        res.status(200)

     
}else {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Método no permitido')
   }

}   