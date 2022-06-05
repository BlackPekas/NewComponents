import {db} from '../../../components/firebase/firebaseAdmin'

export  default async  (req, res) => {
    
    if (req.method === 'GET') {
        const { query } = req
    const { nombre } = query
    const destacados = await db.collection(nombre).orderBy('id', 'asc').get().then((snap) => {
       const  docu = snap.docs.map((doc) => doc.data())
       res.json(docu)

    })
    }else {
        res.setHeader('Allow', 'GET')
        res.status(405).end('Método no permitido')
       }
}  
 