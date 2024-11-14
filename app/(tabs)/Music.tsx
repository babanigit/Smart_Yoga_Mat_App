// app/(tabs)Music.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';

export default function Music() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  async function playSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(require('../../assets/sounds/ambient.mp3'));
      setSound(sound);
      await sound.playAsync();
      Alert.alert('Sound Playing', 'Ambient sound is now playing.');
    } catch (error) {
      Alert.alert('Error', 'Failed to load and play sound.');
    }
  }

  async function stopSound() {
    if (sound) {
      await sound.stopAsync();
      Alert.alert('Sound Stopped', 'Ambient sound has been stopped.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Music & Sounds</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={playSound}>
          <Text style={styles.buttonText}>Play Ambient Sound</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={stopSound}>
          <Text style={styles.buttonText}>Stop Sound</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8', // Light background for consistency
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333', // Darker text for readability
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 20,
    width: '100%',
  },
  button: {
    backgroundColor: '#4A90E2', // Button color matching the theme
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000', // Button shadow for elevation
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
