// app/(tabs)ControlPanel.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAppContext } from "../../context/AppContext";
import { MaterialIcons } from '@expo/vector-icons';

// Define types for component props and state
type Mode = 'Warm-Up' | 'Relaxation' | null;

interface Analytics {
  totalSessions: number;
  mostUsedFunction: Mode;
}

// Define the type for the context
interface AppContextType {
  isConnected: boolean;
  analytics: Analytics;
  setAnalytics: React.Dispatch<React.SetStateAction<Analytics>>;
}

export default function ControlScreen() {
  const { isConnected, analytics, setAnalytics } = useAppContext() as AppContextType;
  const [activeMode, setActiveMode] = useState<Mode>(null);

  const handleModeActivation = (mode: Mode) => {
    if (!isConnected) {
      Alert.alert(
        'Not Connected',
        'Please connect to your Smart Yoga Mat first.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (activeMode === mode) {
      setActiveMode(null);
      Alert.alert('Mode Stopped', `${mode} mode has been stopped.`);
    } else {
      setActiveMode(mode);

      setAnalytics((prev: Analytics) => ({
        totalSessions: prev.totalSessions + 1,
        mostUsedFunction: mode,
      }));
      
      Alert.alert('Mode Started', `${mode} mode has been activated.`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mat Control Panel</Text>
      
      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            activeMode === 'Warm-Up' && styles.activeButton
          ]}
          onPress={() => handleModeActivation('Warm-Up')}
        >
          <MaterialIcons 
            name="whatshot" 
            size={32} 
            color={activeMode === 'Warm-Up' ? '#fff' : '#4A90E2'} 
          />
          <Text style={[
            styles.modeText,
            activeMode === 'Warm-Up' && styles.activeText
          ]}>
            Start Warm-Up
          </Text>
          <Text style={[
            styles.modeDescription,
            activeMode === 'Warm-Up' && styles.activeText
          ]}>
            Gentle poses to prepare your body
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            activeMode === 'Relaxation' && styles.activeButton
          ]}
          onPress={() => handleModeActivation('Relaxation')}
        >
          <MaterialIcons 
            name="spa" 
            size={32} 
            color={activeMode === 'Relaxation' ? '#fff' : '#4A90E2'} 
          />
          <Text style={[
            styles.modeText,
            activeMode === 'Relaxation' && styles.activeText
          ]}>
            Begin Relaxation
          </Text>
          <Text style={[
            styles.modeDescription,
            activeMode === 'Relaxation' && styles.activeText
          ]}>
            Deep relaxation and meditation
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Current Status</Text>
        <Text style={styles.statusText}>
          Connection: {isConnected ? 'Connected' : 'Not Connected'}
        </Text>
        <Text style={styles.statusText}>
          Active Mode: {activeMode || 'None'}
        </Text>
        <Text style={styles.statusText}>
          Total Sessions: {analytics.totalSessions}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  modeContainer: {
    gap: 20,
    marginBottom: 30,
  },
  modeButton: {
    backgroundColor: '#f0f4f8',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  activeButton: {
    backgroundColor: '#4A90E2',
  },
  modeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginTop: 10,
  },
  activeText: {
    color: '#fff',
  },
  modeDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  statusContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f9fafc',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e1e5e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 10,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 5,
  },
});