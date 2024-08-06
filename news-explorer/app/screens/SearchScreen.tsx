import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, StyleSheet, Button, Linking } from 'react-native';
import { searchNews, Article } from '../services/api';
import { ThemedText } from '@/components/ThemedText';
import debounce from 'lodash/debounce';

const SearchScreen: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);

    // Função de busca com debounce
    const fetchResults = useCallback(
        debounce(async (query: string) => {
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
            } else {
                setResults([]);
            }
        }, 500), // 500 ms de atraso
        []
    );

    // Atualiza os resultados de busca quando a query muda
    useEffect(() => {
        fetchResults(query);
    }, [query, fetchResults]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Digite sua busca..."
                value={query}
                onChangeText={setQuery}
            />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
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
