import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripe: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripe) {
    stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUB!)
  }

  return stripe
}
