import {db, st, auth} from '../../../components/firebase/firebaseAdmin'
import Stripe from 'stripe'

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`)    
export  default async  (req, res) => {
   auth.getUserByEmail('admin@admin.com').then((userRecord) => {
       const user = userRecord.toJSON();
       user.uid = req.body.id ? borrar(req,res)
       : res.status(201).end("Usuario no permitido")
   })


} 
const borrar = async (req, res)  => {
   if (req.method === 'DELETE') {
      const dest = await  db.collection("destacados").where("nombre2","==",req.body.value).get()
      const producto = dest.docs[0].data()
      const directorio = `destacados/${req.body.value}`
      await st.deleteFiles({ prefix: directorio})
      await stripe.products.update(producto.stripe_prod, {active: false})
      await dest.docs[0].ref.delete()
      res.status(200).end('Completado con éxito')
   
   }else {
       res.setHeader('Allow', 'DELETE')
       res.status(405).end('Método no permitido')
      }
} 