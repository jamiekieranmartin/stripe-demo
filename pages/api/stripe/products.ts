import type { NextApiRequest, NextApiResponse } from 'next'
import { getProductWithPrices } from 'lib/stripe/admin'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const products_with_prices = await getProductWithPrices()
  return res.json(products_with_prices)
}
