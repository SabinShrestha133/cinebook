import express, {
    Application,
    NextFunction,
    Request,
    Response
} from "express";

import { HttpException } from "./exceptions/http-exception";
import { ApiResponseHelper } from "./utils/apihelper.util";

import cors from "cors";
import morgan from "morgan";
import path from "path";

import userRoutes from "./routes/user.route";
import profileRoutes from "./routes/profile.route";
import movieRoutes from "./routes/movie.route";
import showtimeRoutes from "./routes/showtime.route";
import bookingRoutes from "./routes/booking.route";
import adminRoutes from "./routes/admin.route";
import recommendationRoutes from "./routes/recommendation.route";
import superAdminRoutes from "./routes/superadmin.route";
import hallRoutes from "./routes/hall.route";
import seatRoutes from "./routes/seat.route";
import cinemaRoutes from "./routes/cinema.route";
import aiRecommendationRoutes from "./routes/ai-recommendation.route";
import seatRecommendationRoutes from "./routes/seat-recommendation.route";

import { PORT, HOST } from "./configs/constant";

const app: Application = express();


// ===============================
// CORS CONFIG
// ===============================

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5000",
    "http://10.0.2.2:5000",
    "http://localhost:8089",
    "exp://localhost"
];


const corsOptions = {

    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
    ) => {


        // Allow server-to-server / Postman
        if (!origin) {
            return callback(null, true);
        }


        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }


        return callback(
            new Error("CORS blocked this origin")
        );

    },

    credentials: true,

    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ],

    optionsSuccessStatus: 200
};


app.use(cors(corsOptions));



// ===============================
// BODY PARSER
// ===============================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);



// ===============================
// LOGGER
// ===============================

app.use(
    morgan("combined")
);



// ===============================
// STATIC FILES
// PROFILE IMAGES
// ===============================


app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "../uploads")
    )
);



// ===============================
// API ROUTES
// ===============================


// Auth
// /api/v1/auth/register
// /api/v1/auth/login
// /api/v1/auth/whoami
// /api/v1/auth/update

app.use(
    "/api/v1/auth",
    userRoutes
);



// Profile related routes
app.use(
    "/api/v1/profile",
    profileRoutes
);


// Movies
app.use(
    "/api/v1/movies",
    movieRoutes
);

// Showtimes
app.use(
    "/api/v1/showtimes",
    showtimeRoutes
);

// Bookings
app.use(
    "/api/v1/bookings",
    bookingRoutes
);

// Cinemas
app.use(
    "/api/v1/cinemas",
    cinemaRoutes
);

// Admin
app.use(
    "/api/v1/admin",
    adminRoutes
);

// Halls
app.use(
    "/api/v1/halls",
    hallRoutes
);

// Seats
app.use(
    "/api/v1/seats",
    seatRoutes
);

// Seat recommendations
app.use(
    "/api/v1/seat-recommendations",
    seatRecommendationRoutes
);

// Recommendations
app.use(
    "/api/v1/recommendations",
    recommendationRoutes
);

// AI Recommendations
app.use(
    "/api/v1/ai/recommendations",
    aiRecommendationRoutes
);

// Super admin
app.use(
    "/api/v1/super-admin",
    superAdminRoutes
);





// ===============================
// NOT FOUND HANDLER
// ===============================


app.use(
    (
        req: Request,
        res: Response
    ) => {

        return res.status(404).json({

            success:false,

            message:
            "API endpoint not found"

        });

    }
);





// ===============================
// GLOBAL ERROR HANDLER
// ===============================


app.use(

    (
        err: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {


        console.error(
            "ERROR:",
            err
        );


        if(err instanceof HttpException){

            return ApiResponseHelper.error(
                res,
                err.message,
                err.status
            );


        }



        return ApiResponseHelper.error(

            res,

            err.message ||
            "Internal Server Error",

            500

        );

    }

);





export default app;

export {
    PORT,
    HOST
};
