import app, { PORT } from "./src/app";
import { connectToMongoDB } from "./src/database/mongodb";

connectToMongoDB();

app.listen(
    PORT,  // start backend in this PORT
    () => {
        console.log(`🎬 CineBook API Server running at http://localhost:${PORT}`);
    }
);
// execute: npm run dev