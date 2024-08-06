import axios from "axios";

const API_KEY = "3be46b55adf54a199bf6182591e1b56d";
const BASE_URL = "https://newsapi.org/v2";

export interface Article {
    title: string;
    description: string;
    url: string;
    source: {
        name: string;
    };
}

interface NewsResponse {
    articles: Article[];
}

export const fetchTopHeadlines = async (): Promise<NewsResponse> => {
    try {
        const response = await axios.get(`${BASE_URL}/top-headlines`, {
            params: {
                country: "us",
                apiKey: API_KEY,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar manchetes: ", error);
        throw error;
    }
};

export const searchNews = async (query: string): Promise<NewsResponse> => {
    try {
        const response = await axios.get(`${BASE_URL}/top-headlines`, {
            params: {
                q: query,
                apiKey: API_KEY,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar as notícias: ", error);
        throw error;
    }
}