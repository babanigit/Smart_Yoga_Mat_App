// app/index.tsx
import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    // Logic for connecting to yoga mat (Bluetooth/Wi-Fi)
    setIsConnected(true); // Simulated connection status
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Yoga Mat</Text>
      <Text style={styles.title}>
        Connection Status: {isConnected ? "Connected" : "Not Connected"}
      </Text>
      <Button
        title={isConnected ? "Disconnect" : "Connect to Mat"}
        onPress={isConnected ? handleDisconnect : handleConnect}
      />

      {/* <Button
        title="Go to Control Panel"
        onPress={() => router.push("/(tabs)ControlPanel")}
      />
      <Button title="Go to Music" onPress={() => router.push("/(tabs)Music")} />
      <Button
        title="Go to Product Showcase"
        onPress={() => router.push("/(tabs)ProductShowcase")}
      />
      <Button
        title="Go to OTA Update"
        onPress={() => router.push("/(tabs)OTAUpdate")}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20, color: "white" },
});
