// HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    // Logic to connect to the smart yoga mat
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    // Logic to disconnect from the smart yoga mat
    setIsConnected(false);
  };

  return (
    <View style={styles.container}>
      {/* Introduction Section */}
      <Text style={styles.title}>Welcome to Smart Yoga Mat</Text>
      <Text style={styles.description}>
        Track your posture and enhance your yoga sessions with interactive features.
      </Text>

      {/* Smart Yoga Mat Visual */}
      <Image
        source={require('../../assets/images/icon.png')}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Call-to-Action Buttons */}
      <TouchableOpacity
        style={[styles.button, isConnected ? styles.buttonConnected : styles.buttonDisconnected]}
        onPress={isConnected ? handleDisconnect : handleConnect}
      >
        <Text style={styles.buttonText}>
          {isConnected ? 'Disconnect from Mat' : 'Connect to Mat'}
        </Text>
      </TouchableOpacity>

      {/* View Features Button */}
      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>View Features</Text>
      </TouchableOpacity>

      {/* Connection Status Display */}
      <Text style={styles.connectionStatus}>
        {isConnected ? 'Connected to Smart Yoga Mat' : 'Not Connected'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 150,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 10,
  },
  buttonConnected: {
    backgroundColor: '#FF6F61',
  },
  buttonDisconnected: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 20,
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
  },
  connectionStatus: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
  },
});
