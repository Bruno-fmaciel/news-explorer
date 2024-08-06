import React, { useEffect, useState} from "react";
import { View, FlatList, ActivityIndicator, StyleSheet, Button, Linking } from "react-native";
import { searchNews, Article } from "../services/api";
import { ThemedText } from "@/components/ThemedText";

interface SearchResultScreenProps {
    route: {
        params: {
            query: string;
        };
    };
}

const SearchResultScreen: React.FC<SearchResultScreenProps> = ({ route }) => {
    const [results, setResults] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const { query } = route.params;

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await searchNews(query);
                setResults(data.articles);
            } catch (error) {
                console.error("Erro ao buscar notícias: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={results}
                keyExtractor={(item) => item.url}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <ThemedText style={styles.title}>{item.title}</ThemedText>
                        <ThemedText>{item.source.name}</ThemedText>
                        <ThemedText>{item.description}</ThemedText>
                        <Button
                            title="Open"
                            onPress={() => Linking.openURL(item.url)}
                        />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontWeight: "bold",
        fontSize: 16,
    },
});