import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "News Explorer"}} />
      <Stack.Screen name="screens/SearchScreen" options={{ title: "News Explorer"}} />
    </Stack>
  );
}
