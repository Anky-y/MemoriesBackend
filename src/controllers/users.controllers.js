import express from 'express'
import bcrypt from "bcryptjs"
import { Prisma } from "@prisma/client"
import prisma from "../utils/prisma.js"
import { validateUser } from "../validators/users.js"
import { filter } from "../utils/common.js"
const router = express.Router()

router.post('/', async (req, res) => {
    const data = req.body
    console.log('Received data:', data);

    const validationErrors = validateUser(data);
    console.log('Validation errors:', validationErrors);

    if (Object.keys(validationErrors).length != 0) return res.status(400).send({
        error: validationErrors
      })

data.password = bcrypt.hashSync(data.password, 8);
console.log('Hashed password:', data.password);

try {
  const user = await prisma.users.create({
    data,
  });
  console.log('Created user:', user);

  return res.json(filter(user, 'id', 'username', 'email'));
} catch (err) {
  console.error('Error during user creation:', err);

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    const formattedError = {};
    formattedError[`${err.meta.target[0]}`] = 'already taken';

    return res.status(500).send({
      error: formattedError,
    });
  }

  throw err;
}
});

export default router