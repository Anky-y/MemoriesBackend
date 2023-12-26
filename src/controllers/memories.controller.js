import express from 'express'
import prisma from "../utils/prisma.js"
import { filter } from "../utils/common.js"
import auth from '../middlewares/auth.js'
import cors from "cors";
import { validateMemory } from '../validators/memories.js'
const memoriesRouter = express.Router()
memoriesRouter.use(cors());

// model Memories {
//     id            Int        @id @default(autoincrement())
//     location      String   
//     time          DateTime   
//     description   String?
//     title         String     
//     created_at    DateTime @default(now())
//     updated_at    DateTime @updatedAt
//     images        Images[]
//     videos        Videos[]
//     user          Users    @relation(fields: [userId], references:[id])
//     userId        Int
//   }

memoriesRouter.get('/:id',auth, async(req, res)=>{
  //selects a memory by id, and returns all associated images and videos as well
  const memoryId = parseInt(req.params.id)
  let memory = []
  try{
  memory = await prisma.memories.findUnique({
    where:{
      id: memoryId
    },
    include:{
      images:{},
      videos:{}
    }
  })

  if(memory===null||Object.keys(memory).length === 0){
    res.status(404).send({error: "Could not find requested memory"})
  }else{
    res.json(memory)
  }
}catch(error){
  console.log("error:", error.message);
  res.status(500).send({error: "Error fetching memory"})
}

  //example response:
  /*
  {
	"id": 4,
	"location": "1.45634235, 196.4352",
	"time": "2023-12-18T07:04:18.911Z",
	"description": "des",
	"title": "title",
	"created_at": "2023-12-20T03:13:29.446Z",
	"updated_at": "2023-12-20T03:13:29.446Z",
	"userId": 1,
	"images": [
		{
			"id": 3,
			"url": "https://img4.com",
			"description": "description",
			"memoryId": 4,
			"created_at": "2023-12-20T03:14:27.567Z",
			"updated_at": "2023-12-20T03:14:27.567Z"
		},
		{
			"id": 4,
			"url": "https://img5.com",
			"description": "description",
			"memoryId": 4,
			"created_at": "2023-12-20T03:14:33.627Z",
			"updated_at": "2023-12-20T03:14:33.627Z"
		}
	],
	"videos": [
		{
			"id": 7,
			"url": "https://example.com/video4.mp4",
			"description": "video description6",
			"memoryId": 4,
			"created_at": "2023-12-20T03:13:58.603Z",
			"updated_at": "2023-12-20T03:13:58.603Z"
		},
		{
			"id": 8,
			"url": "https://example.com/video5.mp4",
			"description": "video description6",
			"memoryId": 4,
			"created_at": "2023-12-20T03:14:08.246Z",
			"updated_at": "2023-12-20T03:14:08.246Z"
		}
	]
}
  */
})

memoriesRouter.get('/user/:userId', auth, async (req, res)=>{
    const userId = parseInt(req.params.userId)

    //selects all memories belonging to a user. does not return any images or videos 
    try{
    const userMemories = await prisma.memories.findMany({
      where:{
        userId: userId
      }
    })

    if(userMemories===null||Object.keys(userMemories).length === 0){
      res.status(404).send({error: "Could not find any memories for this user, or user does not exist"})
    }else{
      res.json(userMemories)
    }
    }catch(error){
      console.log("error:", error.message);
      res.status(500).send({error: "Error fetching memories"})
    }
    //example response:
    /*
    [
	{
		"id": 1,
		"location": "1.45634235, 196.4352",
		"time": "2023-12-18T07:04:18.911Z",
		"description": "description",
		"title": "title",
		"created_at": "2023-12-18T07:08:39.924Z",
		"updated_at": "2023-12-18T07:08:39.924Z",
		"userId": 1
	},
	{
		"id": 2,
		"location": "1.45634235, 196.4352",
		"time": "2023-12-18T07:04:18.911Z",
		"description": "wet",
		"title": "surfing",
		"created_at": "2023-12-18T07:11:09.038Z",
		"updated_at": "2023-12-18T07:12:57.936Z",
		"userId": 1
	}
]
    */
})

memoriesRouter.post('/', auth, async (req,res)=>{
    const data = req.body

    const validationErrors = validateMemory(data);
    console.log('Validation errors:', validationErrors);
    if (Object.keys(validationErrors).length != 0) return res.status(400).send({
        error: validationErrors
      })

    try{
        const memory = await prisma.memories.create({
            data
        })
        res.json(filter(memory, 'id', 'title','userId'))
    }catch(error){
        console.log("error:", error.message);
        res.status(500).send({error: "Error entering memory"})
    }
    
})

memoriesRouter.put('/:id', auth, async (req, res) => {
  const memoryId = parseInt(req.params.id, 10);
  const updatedData = req.body;

  const validationErrors = validateMemory(updatedData);
    console.log('Validation errors:', validationErrors);
    if (Object.keys(validationErrors).length != 0) return res.status(400).send({
        error: validationErrors
      })

  try {
    const updatedMemory = await prisma.memories.update({
      where: { id: memoryId },
      data: updatedData,
    });
    res.json(filter(updatedMemory, 'id', 'title', 'userId'));
  } catch (error) {
    console.log("error:", error.message);
    res.status(500).send({ error: 'Error updating the memory' });
  }

})

memoriesRouter.delete('/:id', auth, async (req, res) => {
  const memoryId = parseInt(req.params.id, 10);

  try{
    //delete all images and videos belonging to the memory first. 
    //User should be warned that all images and videos associated with the memory will be deleted as well
    await prisma.images.deleteMany({
      where:{
        memoryId: memoryId
      }
    })
    await prisma.videos.deleteMany({
      where:{
        memoryId: memoryId
      }
    })

    //then only can the memory be deleted
    const deletedMemory = await prisma.memories.delete({
      where:{
        id: memoryId
      }
    })

    res.json(filter(deletedMemory, 'id', 'title', 'userId'));
  }catch(error){
    console.log("error:", error.message);
    res.status(500).send({error: 'Error deleting the memory'});
  }
});

export default memoriesRouter