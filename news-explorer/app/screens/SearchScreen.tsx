import react, { useState } from "react";
import { View, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { searchNews, Article } from "../services/api";
import { ThemedText } from "@/components/ThemedText";