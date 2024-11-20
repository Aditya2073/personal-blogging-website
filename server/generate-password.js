import bcrypt from 'bcryptjs';

const password = '3GEuw9EKEKwvaz3#';

bcrypt.hash(password, 10).then(hash => {
    console.log('Generated Password:', password);
    console.log('Hashed Password (copy to .env):', hash);
});
