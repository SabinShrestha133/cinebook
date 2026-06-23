// centralized path definitions for API endpoints
export const API = {
    AUTH: {
        REGISTER: "/api/v1/auth/register",
        LOGIN: "/api/v1/auth/login",
        WHOAMI: "/api/v1/auth/whoami",
        UPDATE_PROFILE: "/api/v1/auth/update",
    },
    MOVIE: {
        BROWSE: "/api/v1/movies",
    },
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";

// export const API = {

//     AUTH: {

//         REGISTER:
//         "/api/v1/auth/register",

//         LOGIN:
//         "/api/v1/auth/login",

//         WHOAMI:
//         "/api/v1/auth/whoami",

//         UPDATE_PROFILE:
//         "/api/v1/auth/update",

//     },


//     MOVIE: {

//         BROWSE:
//         "/api/v1/movies",

//     }

// };


// export const API_BASE_URL =
//     process.env.NEXT_PUBLIC_API_URL || "";