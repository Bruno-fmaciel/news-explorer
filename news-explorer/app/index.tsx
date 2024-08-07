import React, { useState } from 'react';
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";

export default function Index() {
    const [showSearch, setShowSearch] = useState(false);

    const handleBack = () => {
        setShowSearch(false);
    };

    const handleNavigateToSearch = () => {
        setShowSearch(true);
    };

    if (showSearch) {
        return <SearchScreen onBack={handleBack} />;
    }

    return (
        <HomeScreen onNavigateToSearch={handleNavigateToSearch} />
    );
}

