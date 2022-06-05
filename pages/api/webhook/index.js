import Stripe from 'stripe'
import { buffer } from 'micro'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const config = {
    api: {
        bodyParser : false,
    },
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        var event
        try {
            const rawBody = await buffer(req)
            const signature = req.headers['stripe-signature']

            event = stripe.webhooks.constructEvent(
                rawBody.toString(),
                signature,
                `${process.env.STRIPE_WEBHOOK_KEY}`
            )

        } catch (err) {
            console.log(err.message);
            res.status(400).send(`Error webhook : ${err.message}`)
            return
        }
        console.log(`nice ${event.id}`);

        if (event.type === 'checkout.session.completed') {
            console.log("pago recibido");
        }else {
            console.log(`que es esto ${event.type}`);
        }

        res.json({ received: true})

    }else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Método no permitido')
    }
}