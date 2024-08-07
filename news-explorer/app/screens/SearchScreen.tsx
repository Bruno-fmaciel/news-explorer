import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, StyleSheet, Button, Linking, TouchableOpacity } from 'react-native';
import { searchNews, Article } from '../services/api';
import { ThemedText } from '@/components/ThemedText';
import debounce from 'lodash/debounce';
import { saveSearchHistory, getSearchHistory } from '../services/storage';

interface SearchScreenProps {
    onBack: () => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ onBack }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);

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

    const handleSearch = () => {
        fetchResults(query);
    };

    const handleChange = (text: string) => {
        setQuery(text);
        fetchResults.cancel();
    };

    const toggleHistory = async () => {
        if (!showHistory) {
            const savedHistory = await getSearchHistory();
            setHistory(savedHistory);
        }
        setShowHistory(!showHistory);
    };

    useEffect(() => {
        const loadHistory = async () => {
            const savedHistory = await getSearchHistory();
            setHistory(savedHistory);
        };
        loadHistory();
    }, []);

    return (
        <View style={styles.container}>
            <Button title="Home" onPress={onBack} color="#9f0000" />
            <TextInput
                style={styles.input}
                placeholder="Digite sua busca..."
                value={query}
                onChangeText={handleChange}
            />
            <View style={styles.buttonContainer}>
                <Button title="Buscar" onPress={handleSearch} color="#9f0000" />
                <Button title={showHistory ? "Ocultar Histórico" : "Mostrar Histórico"} onPress={toggleHistory} color="#9f0000" />
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#9f0000" />
            ) : (
                <>
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.url}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <ThemedText style={styles.title}>{item.title}</ThemedText>
                                <ThemedText style={styles.source}>{item.source.name}</ThemedText>
                                <ThemedText style={styles.description}>{item.description}</ThemedText>
                                <Button
                                    title="Abrir"
                                    onPress={() => Linking.openURL(item.url)}
                                    color="#9f0000"
                                />
                            </View>
                        )}
                    />
                    {showHistory && (
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
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFFFF',
      },
    card: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000000',
    },
    source: {
        fontSize: 12,
        color: '#888888',
    },
    description: {
        fontSize: 14,
        color: '#555555',
        marginVertical: 8,
    },
    historyItem: {
        padding: 12,
        backgroundColor: '#F5F5F5',
        borderRadius: 6,
        marginBottom: 8,
    },
    header: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },
});

export default SearchScreen;
