import React, { useEffect, useState} from "react";
import { View, FlatList, ActivityIndicator, StyleSheet, Button } from "react-native";
import { searchNews, Article } from "../services/api";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";

