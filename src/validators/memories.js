export function validateMemory(input) {

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

    const validationErrors = {}
  
    if (!('location' in input) || input['location'].length == 0) {
      validationErrors['location'] = 'must have location'
    }
  
    if (!('time' in input) || input['time'].length == 0) {
      validationErrors['time'] = 'must have time'
    }
  
    if (!('title' in input) || input['title'].length == 0) {
      validationErrors['title'] = 'must have title'
    }
  
    return validationErrors
  }