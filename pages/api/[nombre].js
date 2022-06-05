import {db} from '../../components/firebase/firebaseAdmin'

export  default (req, res) => {
    const { query } = req
    const { nombre } = query
    const dato = db.collection("destacados").orderBy('id', 'asc').get().then((snap) => {       
        snap.docs.map((doc) => {
          const data = doc.data()
          if (data.nombre2 === nombre ) res.json(data)
        })
    }).catch((err) => {
      console.log(err);
    })
}