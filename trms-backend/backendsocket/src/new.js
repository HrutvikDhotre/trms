const bcrypt = require('bcrypt');
const saltRounds = 5; 

function hashPassword(password) {
    return bcrypt.hash(password, saltRounds);
}

const password = 'Hrutvik@123';

hashPassword(password)
    .then(hashedPassword => {
        console.log(`Original password: ${password}`);
        console.log(`Hashed password: ${hashedPassword}`);
    })
    .catch(error => {
        console.error('Error:', error);
    });
