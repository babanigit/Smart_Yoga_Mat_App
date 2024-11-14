// MusicAndSoundScreen.tsx
import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider"; // Import Slider from the community package

import { Audio } from "expo-av";

export default function MusicAndSoundScreen() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1.0); // Initial volume set to max (1.0)

  const soundLibrary = [
    { name: "Ocean Waves", file: require("../../assets/sounds/ambient.mp3") },
    {
      name: "Breathing Exercises",
      file: require("../../assets/sounds/ambient.mp3"),
    },
    { name: "Ambient Music", file: require("../../assets/sounds/ambient.mp3") },
  ];

  const loadAndPlaySound = async (file: any) => {
    if (sound) {
      await sound.unloadAsync(); // Stop and unload any previously playing sound
    }
    const { sound: newSound } = await Audio.Sound.createAsync(file, {
      isLooping: true,
      volume,
    });
    setSound(newSound);
    setIsPlaying(true);
    await newSound.playAsync();
  };

  const handlePlayPause = async () => {
    if (isPlaying && sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = async (value: number) => {
    setVolume(value);
    if (sound) {
      await sound.setVolumeAsync(value);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relaxing Sounds</Text>

      {/* Sound Library Buttons */}
      {soundLibrary.map((track, index) => (
        <TouchableOpacity
          key={index}
          style={styles.soundButton}
          onPress={() => loadAndPlaySound(track.file)}
        >
          <Text style={styles.buttonText}>{track.name}</Text>
        </TouchableOpacity>
      ))}

      {/* Play/Pause and Stop Buttons */}
      <View style={styles.controlButtons}>
        <Button
          title={isPlaying ? "Pause" : "Play"}
          onPress={handlePlayPause}
        />
        <Button title="Stop" onPress={stopSound} />
      </View>

      {/* Volume Slider */}
      <Text style={styles.label}>Volume</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={volume}
        onValueChange={handleVolumeChange}
        minimumTrackTintColor="#1EB1FC"
        maximumTrackTintColor="#000000"
        thumbTintColor="#1EB1FC"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  soundButton: {
    width: "80%",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  controlButtons: {
    flexDirection: "row",
    marginVertical: 20,
  },
  label: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  slider: {
    width: "80%",
    height: 40,
  },
});
