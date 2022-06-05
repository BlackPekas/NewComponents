import Stripe from 'stripe'

const stripe = new Stripe('sk_test_51Kyv19K0adc9LJm2WDW3figIigdbW62jL3LrvAZSnpeOwTuyjXbjqAyy27wcvGMMPBEnUyfObzwa97Xb2nTcZc2Y00EOO87GhX')

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: req.body.items,
                success_url: `${req.headers.origin}/completado?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/`,
                mode: 'payment'
            })
            res.status(200).json(session)
        } catch (err) {
            res.status(500).json({statusCode:500, message:err.message})
        }
    }else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Método no permitido')
    }
}