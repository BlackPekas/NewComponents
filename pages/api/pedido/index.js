import {db, auth} from '../../../components/firebase/firebaseAdmin'

export  default async  (req, res) => {
    auth.getUserByEmail('admin@admin.com').then((userRecord) => {
        const user = userRecord.toJSON();
        user.uid = req.body.id ? añadir(req,res)
        : res.status(201).end("Usuario no permitido")
    })
}   

const añadir = async (req, res) => {
    if (req.method === 'POST') {
       if (req.body.producto) {
           const body = req.body
           const producto = req.body.producto[0].producto
           await db.collection("pedidos").add({productos:{id: producto.id, img:producto.url[0], nombre: producto.nombre,
             nombre2: producto.nombre2, precio_unidad: producto.unidades, precio_unidad:producto.precio }, id:body.user_id, fecha: body.fecha , id_pedido:body.id_pedido})
        }else {
        const carrito = req.body.carrito.map((doc) =>{return ({id: doc.producto.id, img: doc.producto.url[0], unidades:doc.unidades,precio_unidad:doc.precio_unidad, nombre: doc.producto.nombre,nombre2: doc.producto.nombre2})} )
        await db.collection("pedidos").add({productos:carrito, id:req.body.user_id, fecha: req.body.fecha , id_pedido:req.body.id_pedido})
       }
       res.status(200).end("Pedido Añadido");
      
 }else {
     res.setHeader('Allow', 'POST')
     res.status(405).end('Método no permitido')
    }
}