import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, StyleSheet, Button, Linking, TouchableOpacity } from 'react-native';
import { searchNews, Article } from '../services/api';
import { ThemedText } from '@/components/ThemedText';
import debounce from 'lodash/debounce';
import { saveSearchHistory, getSearchHistory } from '../services/storage';

const SearchScreen: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<string[]>([]);


    const fetchResults = useCallback(
        debounce(async (searchQuery: string) => {
            if (searchQuery.trim() === "") {
               setResults([]);
               return; 
            } 
            setLoading(true);     
            try {
                const data = await searchNews(searchQuery);
                setResults(data.articles);
                await saveSearchHistory(searchQuery);
                setHistory(await getSearchHistory());
            } catch (error) {
                console.error("Erro ao buscar notícias: ", error);
            } finally {
                setLoading(false);
            }
        }, 300),
        []
    );

    const handleHistoryPress = async (query: string) => {
        setQuery(query);
        fetchResults(query);
    };

    const handleChange = (text: string) => {
        setQuery(text);
        fetchResults(text);
    };
 
    useEffect(() => {
        const loadHistory = async () => {
            const savedHistory = await getSearchHistory();
            setHistory(savedHistory);
        } 
    }, []);


    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Digite sua busca..."
                value={query}
                onChangeText={handleChange}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.url}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <ThemedText style={styles.title}>{item.title}</ThemedText>
                                <ThemedText>{item.source.name}</ThemedText>
                                <ThemedText>{item.description}</ThemedText>
                            </View>
                        )}
                    />
                    <FlatList
                        data={history}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleHistoryPress(item)}>
                                <View style={styles.historyItem}>
                                    <ThemedText>{item}</ThemedText>
                                </View>
                            </TouchableOpacity>
                        )}
                        ListHeaderComponent={<ThemedText style={styles.header}>Histórico de Buscas</ThemedText>}
                    />
                </>
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
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    card: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    historyItem: {
        padding: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginBottom: 8,
    },
    header: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
    },
});

export default SearchScreen;
