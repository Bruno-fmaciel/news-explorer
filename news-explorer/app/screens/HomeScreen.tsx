import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { fetchTopHeadlines, Article } from '../services/api';
import { ThemedText } from '@/components/ThemedText';

interface HomeScreenProps {
    onNavigateToSearch: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToSearch }) => {
    const [headlines, setHeadlines] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getHeadlines = async () => {
            try {
                const data = await fetchTopHeadlines();
                setHeadlines(data.articles);
            } catch (error) {
                console.error("Erro ao buscar manchetes: ", error);
            } finally {
                setLoading(false);
            }
        };

        getHeadlines();
    }, []);

    const handleOpenLink = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.searchButton} 
                onPress={onNavigateToSearch} // Chama a função para exibir SearchScreen
            >
                <ThemedText style={styles.searchButtonText}>Ir para Busca</ThemedText>
            </TouchableOpacity>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={headlines}
                    keyExtractor={(item) => item.url}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <ThemedText style={styles.title}>{item.title}</ThemedText>
                            <ThemedText>{item.source.name}</ThemedText>
                            <ThemedText>{item.description}</ThemedText>
                            <TouchableOpacity onPress={() => handleOpenLink(item.url)} style={styles.button}>
                                <ThemedText style={styles.buttonText}>Abrir Notícia</ThemedText>
                            </TouchableOpacity>
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
    button: {
        marginTop: 8,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    searchButton: {
        marginBottom: 16,
        padding: 10,
        backgroundColor: '#28a745',
        borderRadius: 5,
    },
    searchButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default HomeScreen;
