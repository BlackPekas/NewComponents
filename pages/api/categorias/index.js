import {db} from '../../../components/firebase/firebaseAdmin'

export  default async  (req, res) => {
    if (req.method === 'GET') {
        const destacados = await db.collection("categorias").orderBy('id', 'asc').get()
        const prueba = destacados.docs.map(doc => doc.data())
        res.json(prueba)
        res.status(200)
    }else {
        res.setHeader('Allow', 'GET')
        res.status(405).end('Método no permitido')
       }
    
    
    

}   