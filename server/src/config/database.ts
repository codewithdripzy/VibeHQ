import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

class Database {
    private name: string;
    private host: string;
    private port: string;
    private user: string;
    private password: string;

    constructor() {
        dotenv.config();

        this.name = process.env.DB_NAME ?? '';
        this.host = process.env.DB_HOST ?? '';
        this.port = process.env.DB_PORT ?? '';
        this.user = process.env.DB_USER ?? '';
        this.password = process.env.DB_PASSWORD ?? '';
    }

    async getConnection() {
        try {
            const connectionString = `mongodb+srv://${this.user}:${this.password}@${this.host}/${this.name}?retryWrites=true&w=majority&family=4&appName=getdistributed-cluster`;
            
            await mongoose.connect(connectionString, {
                serverApi: { version: '1', strict: true, deprecationErrors: true }
            });
            
            console.log('Successfully connected to the VibeHQ database');
            return mongoose.connection;
        } catch (error) {
            console.error('Failed to connect to the database:', error);
            throw error;
        }
    }
}

export default Database;
