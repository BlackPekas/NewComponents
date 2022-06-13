import {db, auth} from '../../../components/firebase/firebaseAdmin'
import Stripe from 'stripe'

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`)    

export  default async  (req, res) => {
    auth.getUserByEmail('admin@admin.com').then((userRecord) => {
        const user = userRecord.toJSON();
        user.uid = req.body.id ? añadir(req,res)
        : res.status(201).end("Usuario no permitido")
    })
 


}

const añadir = async (req, res) => {
    if (req.method === 'POST') {
        const producto = req.body.producto
        stripe.products.create({
         name: producto.nombre,
     }).then( async (log) => {
         const stripe_id1 = await stripe.prices.create({
             unit_amount_decimal: Math.round(producto.precio*100), currency: "eur", product: log.id})
         const stripe_id2 = await stripe.prices.create({
             unit_amount_decimal: Math.round(producto.precio2*100), currency: "eur", product: log.id})
         const stripe_id = [stripe_id1.id, stripe_id2.id]
         const prod = await db.collection("destacados").add({...producto, stripe_id: stripe_id, stripe_prod: log.id })
         res.json(prod)
         res.status(200)
     }) 
    
     
 }else {
     res.setHeader('Allow', 'POST')
     res.status(405).end('Método no permitido')
    }
}