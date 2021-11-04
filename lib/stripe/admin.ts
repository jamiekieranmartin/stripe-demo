import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SEC!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2020-08-27',
  // Register this as an official Stripe plugin.
  // https://stripe.com/docs/building-plugins#setappinfo
  appInfo: {
    name: 'Next.Js Stripe Demo',
    version: '1.0.0',
  },
})

/**
 *
 */
export const getProducts = async () => (await stripe.products.list()).data

/**
 *
 */
export const getProduct = async (id: string) =>
  await stripe.products.retrieve(id)

/**
 *
 */
export const getPrices = async ({ id }: Stripe.Product) =>
  (await stripe.prices.list({ product: id })).data

/**
 *
 */
export const mapPricesToProduct = async (product: Stripe.Product) => {
  const prices = await getPrices(product)

  return {
    product,
    prices,
  }
}

/**
 *
 */
export const getProductWithPrices = async () => {
  const products = await getProducts()

  return Promise.all(products.map((product) => mapPricesToProduct(product)))
}
