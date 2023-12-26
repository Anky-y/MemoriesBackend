import express from 'express'
import cors from 'cors'
import stripe from 'stripe'
import prisma from '../utils/prisma.js'


const stripeInstance = stripe(process.env.STRIPE_SECRET)

const paymentRouter = express.Router();
paymentRouter.use(cors())
paymentRouter.post('/', async (req, res) => {
    //send the product id and product price from frontend eg.:
    /*
    {
        id: 1,
        price: 2050
    }
    */
  const frontendProductData = req.body;

  //attempt to locate the product in db based on product id
  const targetProduct = await prisma.products.findUnique({
    where: {
      id: frontendProductData.id,
    },
  })

  //return 404 if product not found
  if(!targetProduct) return res.status(404).send({
     error: "could not find requested product"
  })

  //make sure the price sent over from frontend matches the actual price in the database. If not, terminate. ask user to reload page on frontend 
  const actualPrice = targetProduct.price;
  const givenPrice = frontendProductData.price;
  if(givenPrice!=actualPrice) return res.status(401).send({
    error: "given price and actual price do not match"
  })

  //if successful, create paymentIntent thing and return clientsecret
  const intent = await stripeInstance.paymentIntents.create({
      amount: actualPrice,
      currency: "usd"
  })
  res.json({client_secret: intent.client_secret});
});


export default paymentRouter