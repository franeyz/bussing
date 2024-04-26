import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (e, salt) => {
      if(e) {
        reject(e);
      }
      bcrypt.hash(password, salt, (e, hash) => {
        if(e) {
          reject(e);
        }
        resolve(hash);
      })
    })
  })
}

const comparePassword = async (password, hashed) => {
  return bcrypt.compare(password, hashed);
}

export {hashPassword, comparePassword};