import express from 'express';
import prisma from '../utils/prisma.js';
import { filter } from '../utils/common.js';
import auth from '../middlewares/auth.js';
import { Prisma } from '@prisma/client';

const videosRouter = express.Router();

videosRouter.post('/', auth, async (req, res) => {
  // Example request body for uploading a video:
  /*
  {
      url: "https://example.com/video.mp4",
      description: "video description",
      memoryId: "1"
  }
  */

  const data = req.body;

  prisma.videos.create({
      data,
    })
    .then((video) => {
      return res.json(filter(video, 'id', 'url', 'memoryId'));
    })
    .catch((err) => {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const formattedError = {};
        formattedError[`${err.meta.target[0]}`] = 'url already exists';

        return res.status(500).send({
          error: formattedError,
        });
      }
      throw err;
    });
});

videosRouter.delete('/:id', auth, async (req, res) => {
    const videoId = parseInt(req.params.id, 10);

    try {
        const deletedVideo = await prisma.videos.delete({
            where: { id: videoId },
        });

        res.json(filter(deletedVideo, 'id', 'url', 'memoryId'))
    } catch (error) {
        res.status(500).send({ error: 'Error deleting the video'});
    }
});

videosRouter.put('/:id', auth, async (req, res) => {
    const videoId = parseInt(req.params.id, 10);
    const updatedData = req.body;
  
    try {
      const updatedVideo = await prisma.videos.update({
        where: { id: videoId },
        data: updatedData,
      });
      res.json(filter(updatedVideo, 'id', 'url', 'memoryId'));
    } catch (error) {
      res.status(500).send({ error: 'Error updating the video' });
    }
});

export default videosRouter;
