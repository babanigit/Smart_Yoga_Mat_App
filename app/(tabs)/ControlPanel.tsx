// ControlPanelScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Vibration } from 'react-native';

export default function ControlPanelScreen() {
  const [activeMode, setActiveMode] = useState<'Warm-Up' | 'Relaxation' | null>(null);

  const handleModeActivation = (mode: 'Warm-Up' | 'Relaxation') => {
    if (activeMode === mode) {
      setActiveMode(null);
      Alert.alert(`${mode} Mode Stopped`, `The ${mode} mode has been stopped.`);
    } else {
      setActiveMode(mode);
      Alert.alert(`${mode} Mode Activated`, `${mode} mode has been activated.`);
      Vibration.vibrate(500); // Provide a short vibration feedback when mode is activated
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Control Panel</Text>

      {/* Warm-Up Mode Button */}
      <Button
        title="Start Warm-Up"
        onPress={() => handleModeActivation('Warm-Up')}
        color={activeMode === 'Warm-Up' ? '#FFA726' : '#4CAF50'}
      />

      {/* Relaxation Mode Button */}
      <Button
        title="Begin Relaxation Mode"
        onPress={() => handleModeActivation('Relaxation')}
        color={activeMode === 'Relaxation' ? '#81C784' : '#4CAF50'}
      />

      {/* Feedback Message */}
      <Text style={styles.statusText}>
        {activeMode ? `${activeMode} Mode is Active` : 'No Mode Active'}
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
    marginBottom: 20,
  },
  statusText: {
    marginTop: 20,
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
  },
});
