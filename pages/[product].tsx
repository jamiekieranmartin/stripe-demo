import { getPrices, getProduct, getProducts } from '@/lib/stripe/admin'
import { Grid, Text, Button, Input } from '@geist-ui/react'
import axios from 'axios'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import type Stripe from 'stripe'

type Props = {
  product: Stripe.Product
  prices: Stripe.Price[]
}

const format = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format

export default (({ product, prices }) => {
  const router = useRouter();
  const [price, setPrice] = useState<string | null>(null)

  const createCheckout = async () => {
    const { data: url } = await axios.post('/api/stripe/checkout', {
      line_items: [{
        price,
        quantity: 1
      }],
      return_url: `/${product.id}`
    })

    router.push(url)
  }

  return (
    <div className="mx-auto max-w-2xl py-16">
      <Text h1>{product.name}</Text>

      <Text>{product.description}</Text>

      <Grid.Container gap={2} justify="center" height="100px">
        {prices.map(({ id, unit_amount }) => (
          <Grid xs={6} key={id}>
            <Button onClick={() => setPrice(id)} type={price == id ? 'secondary' : 'default'} className="hover:cursor-pointer" width="100%">
              <Text h3>
                {format(unit_amount! / 100)}
              </Text>
            </Button>
          </Grid>
        ))}
      </Grid.Container>

      <Button onClick={createCheckout} disabled={!price} type="success">
        Go
      </Button>
    </div>
  )
}) as NextPage<Props>


export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const product_id = params!['product']?.toString()
  if (!product_id) return {
    notFound: true
  }

  const product = await getProduct(product_id)
  const prices = (await getPrices(product)).sort((a, b) => a.unit_amount! - b.unit_amount!)

  return {
    props: {
      product,
      prices
    }
  }
}


export const getStaticPaths: GetStaticPaths = async (context) => {
  const products = await getProducts();

  const paths = products.map(({ id }) => ({
    params: {
      product: id
    }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}