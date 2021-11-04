import type { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from 'lib/stripe/admin'
import Stripe from 'stripe'

export type LineItems = Stripe.Checkout.SessionCreateParams.LineItem[]

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { line_items, return_url } = req.body

  const url = `https://${process.env.HOST}${return_url}?session_id={CHECKOUT_SESSION_ID}`

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items,
    payment_method_types: ['card'],

    // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
    // the actual Session ID is returned in the query parameter when your customer
    // is redirected to the success page.
    success_url: url,
    cancel_url: url,
  })
  if (!session || !session.url) return res.status(400).end()

  res.json(session.url)
}
