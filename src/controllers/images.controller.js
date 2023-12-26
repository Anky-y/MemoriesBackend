import express from 'express'
import prisma from "../utils/prisma.js"
import { filter } from "../utils/common.js"
import auth from '../middlewares/auth.js'
import { Prisma } from '@prisma/client'
import cors from "cors";
const imagesRouter = express.Router()
imagesRouter.use(cors());

imagesRouter.post('/', auth, (req,res)=>{
  //eg.:
    /*
    {
        url: "https://abcdefgexample/img.com"     
        description: "description"   
        memoryId: "1"    
    }
    */
    const data = req.body

    prisma.images.create({
        data
    }).then(image=>{
        return res.json(filter(image, 'id', 'url','memoryId'))
    }).catch(err => {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
          const formattedError = {}
          formattedError[`${err.meta.target[0]}`] = 'url already exists'
    
          return res.status(500).send({
            error: formattedError
          })
        }
        throw err
      })
    
})

imagesRouter.delete('/:id', auth, async (req, res) => {
  const imageId = parseInt(req.params.id, 10);

  try {
    const deletedImage = await prisma.images.delete({
      where: { id: imageId },
    });

    res.json(filter(deletedImage, 'id', 'url', 'memoryId'));
  } catch (error) {
    res.status(500).send({ error: 'Error deleting the image' });
  }
});

imagesRouter.put('/:id', auth, async (req, res) => {
  const imageId = parseInt(req.params.id, 10);
  const updatedData = req.body;

  try {
    const updatedImage = await prisma.images.update({
      where: { id: imageId },
      data: updatedData,
    });
    res.json(filter(updatedImage, 'id', 'url', 'memoryId'));
  } catch (error) {
    res.status(500).send({ error: 'Error updating the image' });
  }

})
export default imagesRouter