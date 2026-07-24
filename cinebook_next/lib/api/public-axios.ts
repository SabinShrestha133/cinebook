import axios from "axios";
import { API_BASE_URL } from "./endpoints";

export const publicAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default publicAxios;
