import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './src/models/user.model'; // Adjust the path to where your User model is defined
const dbURI = 'mongodb://localhost/yourdatabase'; // Adjust your MongoDB URI accordingly

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err: Error) => console.error(err)); // Using 'Error' type for more specificity


async function createAdminUser() {
    try {
        const hashedPassword = await bcrypt.hash('yourAdminPassword', 10); // Replace 'yourAdminPassword' with a strong password

        const adminUser = new User({
            username: 'adminUsername', // Choose a username for your admin
            password: hashedPassword,
            roles: ['admin'], // This assumes roles are stored as an array of strings within the User document
            // Add any other necessary fields according to your User model
        });

        await adminUser.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Failed to create admin user', error);
    } finally {
        mongoose.connection.close();
    }
}

createAdminUser();
