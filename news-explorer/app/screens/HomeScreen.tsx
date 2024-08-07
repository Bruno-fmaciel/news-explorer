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

    if (loading) {
        return <ActivityIndicator size="large" color="#FF0000" />;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onNavigateToSearch} style={styles.searchButton}>
                <ThemedText style={styles.searchButtonText}>Buscar Notícias</ThemedText>
            </TouchableOpacity>
            <FlatList
                data={headlines}
                keyExtractor={(item) => item.url}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <ThemedText style={styles.title}>{item.title}</ThemedText>
                        <ThemedText style={styles.source}>{item.source.name}</ThemedText>
                        <ThemedText style={styles.description}>{item.description}</ThemedText>
                        <TouchableOpacity onPress={() => handleOpenLink(item.url)} style={styles.button}>
                            <ThemedText style={styles.buttonText}>Abrir Notícia</ThemedText>
                        </TouchableOpacity>
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
        backgroundColor: '#FFFFFF',
    },
    searchButton: {
        padding: 12,
        backgroundColor: '#9f0000',
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 16,
    },
    searchButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
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
    button: {
        padding: 8,
        backgroundColor: '#9f0000',
        borderRadius: 4,
        marginTop: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
});

export default HomeScreen;
