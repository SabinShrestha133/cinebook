import app, { PORT, HOST } from "./src/app";
import { connectToMongoDB } from "./src/database/mongodb";

connectToMongoDB();

app.listen(
    PORT,
    HOST,
    () => {
        console.log(`🎬 CineBook API Server running at http://${HOST}:${PORT}`);
    }
);
// execute: npm run dev