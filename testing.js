import prisma from "./src/utils/prisma.js"

async function main() {

//populate products table with test product
// prisma.products.create({
//     data:{
//         name: 'plan2',
//         description: 'description1',
//         price: 2050 //actual price is 20.50. Store as actual price * 100 
//     }
// }).then(product=>{
//     console.log(product)
// }).catch(e=>{
//     console.log(e.message)
// })

//populate videos table with test videos
try{
await prisma.videos.createMany({
    data: [
        {url: 'https://videos/vid1.com', memoryId: 3},
        {url: 'https://videos/vid2.com', memoryId: 3}
    ]
})
console.log("ok")
}
catch(err){
    console.log(err.message)
}
}

main()