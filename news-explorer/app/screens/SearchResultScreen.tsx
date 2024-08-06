import React, { useEffect, useState} from "react";
import { View, FlatList, ActivityIndicator, StyleSheet, Button } from "react-native";
import { searchNews, Article } from "../services/api";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";

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
    const router = useRouter();

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
                            onPress={() => router.push({ pathname: item.url })}
                        />
                    </View>
                )}
            />
        </View>
    );
}