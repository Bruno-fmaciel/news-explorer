import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet} from "react-native";
import { fetchTopHeadlines, Article } from '../services/api';
import { ThemedText } from '@/components/ThemedText';

const HomeScreen: React.FC = () => {
    const [headlines, setHeadlines] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getHeadLines = async () => {
            try {
                const data = await fetchTopHeadlines();
                setHeadlines(data.articles);
            } catch (error) {
                console.error("Erro ao buscar manchetes: ", error);
            } finally {
                setLoading(false);
            }
        };

        getHeadLines();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={headlines}
                keyExtractor={(item) => item.url} 
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <ThemedText style={styles.title}>{item.title}</ThemedText>
                        <ThemedText>{item.source.name}</ThemedText>
                        <ThemedText>{item.description}</ThemedText>
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
        shadowOffset: { width:0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontWeight: "bold",
        fontSize:16,
    },
});

export default HomeScreen;