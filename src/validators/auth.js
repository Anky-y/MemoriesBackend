export function validateLogin(input) {
    const validationErrors = {}
  
    if (!('email' in input) || input['email'].length == 0) {
      validationErrors['email'] = 'cannot be blank'
    }
  
    if (!('password' in input) || input['password'].length == 0) {
      validationErrors['password'] = 'cannot be blank'
    }
  
    return validationErrors
  }