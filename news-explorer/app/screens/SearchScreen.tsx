// app/screens/SearchScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, ActivityIndicator, StyleSheet, Linking } from 'react-native';
import { searchNews, Article } from '../services/api';
import { ThemedText } from '@/components/ThemedText';

const SearchScreen: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (query) {
            setLoading(true);
            try {
                const data = await searchNews(query);
                setResults(data.articles);
            } catch (error) {
                console.error("Erro ao buscar notícias: ", error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (query) {
            handleSearch();
        }
    }, [query]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Digite sua busca..."
                value={query}
                onChangeText={setQuery}
            />
            <Button title="Buscar" onPress={handleSearch} />
            {results.length > 0 && (
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
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
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

export default SearchScreen;
