import {db, st} from '../../../components/firebase/firebaseAdmin'

export  default async  (req, res) => {
   if (req.method === 'GET') {
        const nombre = req.query.nombre
        const reseñas  =await  db.collection("reseñas").where("producto","==",nombre).get()
        const filtrado = reseñas.docs.filter((dato) => dato.data().producto == nombre)
        res.json(filtrado.map((dato) => dato.data()))
        res.status(200)

     
}else {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Método no permitido')
   }

}   