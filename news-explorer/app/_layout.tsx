import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home"}} />
      <Stack.Screen name="screens/SearchScreen" options={{ title: "Buscar Notícias"}} />
      <Stack.Screen name="screens/SearchResultScreen" options={{ title: "Notícias Encontradas"}} />
    </Stack>
  );
}
