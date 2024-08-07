import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY= "@search_history";

export const saveSearchHistory = async (query: string) => {
    try {
        const existingHistory = await AsyncStorage.getItem(HISTORY_KEY);
        const history = existingHistory ? JSON.parse(existingHistory) : [];
        if (!history.includes(query)) {
            history.unshift(query);
            await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        }
    } catch (error) {
        console.error("Erro ao salvar o histórico de buscas: ", error);
    }
};

export const getSearchHistory = async () => {
    try {
        const history = await AsyncStorage.getItem(HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error("Erro ao carregar o histórico de buscas: ", error);
        return [];
    }
};