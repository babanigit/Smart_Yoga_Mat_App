import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, NativeEventEmitter, NativeModule, Platform } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { PermissionsAndroid } from 'react-native';

interface BleManagerType extends NativeModule {
  start: (options: { showAlert: boolean }) => Promise<void>;
  checkState: () => Promise<string>;
  enableBluetooth: () => Promise<void>;
  scan: (services: string[], seconds: number, allowDuplicates: boolean) => void;
  connect: (deviceId: string) => Promise<void>;
  disconnect: (deviceId: string) => Promise<void>;
}

const BleManagerModule = BleManager as unknown as BleManagerType;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default function DeviceConnectionScreen() {
  const [connectionStatus, setConnectionStatus] = useState<'Connected' | 'Disconnected' | 'Connecting' | 'Failed'>('Disconnected');
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  // Request permissions on Android
  const requestPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ...(Platform.Version >= 31
          ? [
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            ]
          : []),
      ]);

      return Object.values(granted).every(
        (permission) => permission === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  };

  const initializeBluetooth = async () => {
    try {
      // Request permissions first
      const permissionsGranted = await requestPermissions();
      if (!permissionsGranted) {
        Alert.alert('Permission Error', 'Required permissions were not granted');
        return;
      }

      // Initialize BLE Manager
      await BleManagerModule.start({ showAlert: false });

      // Check initial state
      const initialState = await BleManagerModule.checkState();
      console.log('Initial Bluetooth state:', initialState);
      setBluetoothEnabled(initialState === 'on');
      setIsInitialized(true);
    } catch (error) {
      console.error('Initialization error:', error);
      Alert.alert('Error', 'Failed to initialize Bluetooth');
    }
  };

  useEffect(() => {
    // Initialize when component mounts
    initializeBluetooth();

    // Set up event listeners
    const listeners = [
      bleManagerEmitter.addListener('BleManagerDidUpdateState', (args) => {
        console.log('Bluetooth state updated:', args);
        setBluetoothEnabled(args.state === 'on');
      }),
      bleManagerEmitter.addListener('BleManagerConnectPeripheral', (args) => {
        console.log('Connected to device:', args);
        setConnectionStatus('Connected');
      }),
      bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', (args) => {
        console.log('Disconnected from device:', args);
        setConnectionStatus('Disconnected');
      }),
    ];

    // Cleanup listeners
    return () => {
      listeners.forEach((listener) => listener.remove());
    };
  }, []);

  const handleConnect = async () => {
    if (!isInitialized) {
      Alert.alert('Please wait', 'Bluetooth is still initializing...');
      return;
    }

    if (!bluetoothEnabled) {
      // Double-check Bluetooth state
      const currentState = await BleManagerModule.checkState();
      console.log('Double-checked Bluetooth state:', currentState);

      if (currentState !== 'on') {
        Alert.alert(
          'Bluetooth Required',
          'Please enable Bluetooth to connect to the mat.',
          Platform.select({
            android: [
              {
                text: 'Enable Bluetooth',
                onPress: async () => {
                  try {
                    await BleManagerModule.enableBluetooth();
                  } catch (error) {
                    console.error('Error enabling Bluetooth:', error);
                    Alert.alert('Error', 'Failed to enable Bluetooth. Please enable it manually.');
                  }
                },
              },
              { text: 'Cancel', style: 'cancel' },
            ],
            ios: [{ text: 'OK' }],
          })
        );
        return;
      } else {
        // State was incorrect, update it
        setBluetoothEnabled(true);
      }
    }

    setConnectionStatus('Connecting');
    try {
      // Start scanning for devices
      BleManagerModule.scan([], 5, true); // Adjust the scan time and filter based on your needs
      console.log('Started scanning for devices');

      // Set up a timeout or mechanism to handle scanning results

      // Your actual connection logic here
      const isConnected = await mockConnectToYogaMat(); // Replace with real connection logic
      setConnectionStatus(isConnected ? 'Connected' : 'Failed');
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionStatus('Failed');
      Alert.alert('Connection Failed', 'Please ensure Bluetooth is on and try again.');
    }
  };

  const handleDisconnect = async () => {
    if (!deviceId) {
      Alert.alert('No device connected', 'Please connect to a device first.');
      return;
    }

    try {
      await BleManagerModule.disconnect(deviceId);
      setConnectionStatus('Disconnected');
      setDeviceId(null);
    } catch (error) {
      console.error('Disconnection error:', error);
      Alert.alert('Disconnection Error', 'Failed to disconnect. Please try again.');
    }
  };

  const mockConnectToYogaMat = async () => {
    return new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(true), 2000)
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Connection</Text>

      {!isInitialized && <Text style={styles.initText}>Initializing Bluetooth...</Text>}

      <TouchableOpacity
        style={[
          styles.button,
          connectionStatus === 'Connected' ? styles.disconnectButton : styles.connectButton,
          (!isInitialized || connectionStatus === 'Connecting') && styles.disabledButton,
        ]}
        onPress={connectionStatus === 'Connected' ? handleDisconnect : handleConnect}
        disabled={!isInitialized || connectionStatus === 'Connecting'}
      >
        <Text style={styles.buttonText}>
          {connectionStatus === 'Connected' ? 'Disconnect from Mat' : 'Connect to Mat'}
        </Text>
      </TouchableOpacity>

      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.statusText,
            connectionStatus === 'Connected'
              ? styles.statusConnected
              : connectionStatus === 'Connecting'
              ? styles.statusConnecting
              : connectionStatus === 'Failed'
              ? styles.statusFailed
              : styles.statusDisconnected,
          ]}
        >
          {connectionStatus}
        </Text>

        <Text style={styles.bluetoothStatus}>
          Bluetooth: {bluetoothEnabled ? 'Enabled' : 'Disabled'}
        </Text>
      </View>
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
    marginBottom: 30,
  },
  initText: {
    color: '#666',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 20,
  },
  connectButton: {
    backgroundColor: '#4CAF50',
  },
  disconnectButton: {
    backgroundColor: '#FF6F61',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bluetoothStatus: {
    fontSize: 14,
    color: '#666',
  },
  statusConnected: {
    color: 'green',
  },
  statusConnecting: {
    color: 'orange',
  },
  statusFailed: {
    color: 'red',
  },
  statusDisconnected: {
    color: 'gray',
  },
});

