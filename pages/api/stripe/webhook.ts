import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { stripe } from 'lib/stripe/admin'

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Retrieve the event by verifying the signature using the raw body and secret.
  let event: Stripe.Event | undefined = undefined
  let signature = req.headers['stripe-signature']

  try {
    const buf = await buffer(req)
    event = stripe.webhooks.constructEvent(
      buf,
      signature!,
      process.env.STRIPE_WEB!
    )
  } catch (err) {
    return res.status(400).end()
  }

  return res.status(200).end()
}

const handlers = {
  'checkout.session.completed': async (data: Stripe.Event.Data) =>
    console.log(data),
  // Continue to provision the subscription as payments continue to be made.
  // Store the status in your database and check when a user accesses your service.
  // This approach helps you avoid hitting rate limits.
  'invoice.paid': async (data: Stripe.Event.Data) => console.log(data),
  // The payment failed or the customer does not have a valid payment method.
  // The subscription becomes past_due. Notify your customer and send them to the
  // customer portal to update their payment information.
  'invoice.payment_failed': async (data: Stripe.Event.Data) =>
    console.log(data),
}

async function buffer(readable: NextApiRequest) {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}
