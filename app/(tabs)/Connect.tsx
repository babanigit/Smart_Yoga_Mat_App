import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, NativeEventEmitter, NativeModule, Platform, ActivityIndicator } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { PermissionsAndroid } from 'react-native';

interface BleManagerType extends NativeModule {
  start: (options: { showAlert: boolean }) => Promise<void>;
  checkState: () => Promise<string>;
  enableBluetooth: () => Promise<void>;
  scan: (services: string[], seconds: number, allowDuplicates: boolean) => void;
  stopScan: () => Promise<void>;
  connect: (deviceId: string) => Promise<void>;
  disconnect: (deviceId: string) => Promise<void>;
  getConnectedPeripherals: (services: string[]) => Promise<any[]>;
}

interface Device {
  id: string;
  name: string | null;
  rssi: number;
}

const BleManagerModule = BleManager as unknown as BleManagerType;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

// Configuration
const SCAN_TIMEOUT = 10; // seconds
const RECONNECT_ATTEMPTS = 3;
const EXPECTED_DEVICE_NAME = 'YogaMat'; // Replace with your device name
const EXPECTED_SERVICE_UUID = ''; // Add your service UUID here

export default function DeviceConnectionScreen() {
  const [connectionStatus, setConnectionStatus] = useState<'Connected' | 'Disconnected' | 'Connecting' | 'Scanning' | 'Failed'>('Disconnected');
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [discoveredDevices, setDiscoveredDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // ... (keep all the permission and initialization functions the same)

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setConnectionStatus('Scanning');
      setDiscoveredDevices([]);
      await BleManagerModule.scan(EXPECTED_SERVICE_UUID ? [EXPECTED_SERVICE_UUID] : [], SCAN_TIMEOUT, true);
    } catch (error) {
      console.error('Scanning error:', error);
      setIsScanning(false);
      setConnectionStatus('Failed');
      Alert.alert('Scanning Error', 'Failed to scan for devices');
    }
  };

  const handleConnect = async () => {
    // Temporarily disable the button to prevent multiple clicks
    setIsButtonDisabled(true);

    try {
      if (!bluetoothEnabled) {
        const currentState = await BleManagerModule.checkState();
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
                      setBluetoothEnabled(true);
                    } catch (error) {
                      console.error('Error enabling Bluetooth:', error);
                      Alert.alert('Error', 'Failed to enable Bluetooth. Please enable it manually.');
                    } finally {
                      setIsButtonDisabled(false);
                    }
                  },
                },
                { 
                  text: 'Cancel', 
                  style: 'cancel',
                  onPress: () => setIsButtonDisabled(false)
                },
              ],
              ios: [{ 
                text: 'OK',
                onPress: () => setIsButtonDisabled(false)
              }],
            })
          );
          return;
        }
      }

      setConnectionStatus('Connecting');
      
      if (deviceId) {
        await BleManagerModule.connect(deviceId);
      } else {
        await startScanning();
      }
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionStatus('Failed');
      Alert.alert('Connection Failed', 'Please ensure the device is nearby and try again.');
    } finally {
      // Re-enable the button after the operation completes
      setIsButtonDisabled(false);
    }
  };

  const handleDisconnect = async () => {
    if (!deviceId) {
      return;
    }

    setIsButtonDisabled(true);
    try {
      await BleManagerModule.disconnect(deviceId);
      setDeviceId(null);
      setDiscoveredDevices([]);
      setConnectionStatus('Disconnected');
    } catch (error) {
      console.error('Disconnection error:', error);
      Alert.alert('Disconnection Error', 'Failed to disconnect. Please try again.');
    } finally {
      setIsButtonDisabled(false);
    }
  };

  // Update the connect to device function
  const connectToDevice = async (device: Device) => {
    setIsButtonDisabled(true);
    try {
      setConnectionStatus('Connecting');
      await BleManagerModule.stopScan();
      await BleManagerModule.connect(device.id);
      setDeviceId(device.id);
    } catch (error) {
      console.error('Error connecting to device:', error);
      setConnectionStatus('Failed');
      Alert.alert('Connection Error', 'Failed to connect to the selected device.');
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Connection</Text>

      {!isInitialized && <Text style={styles.initText}>Initializing Bluetooth...</Text>}

      <View style={styles.statusContainer}>
        <Text style={[styles.statusText, getStatusStyle(connectionStatus)]}>
          {connectionStatus}
        </Text>
        <Text style={styles.bluetoothStatus}>
          Bluetooth: {bluetoothEnabled ? 'Enabled' : 'Disabled'}
        </Text>
      </View>

      {isScanning && (
        <View style={styles.scanningContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.scanningText}>Scanning for devices...</Text>
        </View>
      )}

      {discoveredDevices.length > 0 && connectionStatus !== 'Connected' && (
        <View style={styles.deviceList}>
          <Text style={styles.deviceListTitle}>Available Devices:</Text>
          {discoveredDevices.map((device) => (
            <TouchableOpacity
              key={device.id}
              style={[
                styles.deviceItem,
                isButtonDisabled && styles.disabledButton
              ]}
              onPress={() => connectToDevice(device)}
              disabled={isButtonDisabled}
            >
              <Text style={styles.deviceName}>{device.name || 'Unknown Device'}</Text>
              <Text style={styles.deviceInfo}>Signal: {device.rssi} dBm</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          connectionStatus === 'Connected' ? styles.disconnectButton : styles.connectButton,
          isButtonDisabled && styles.disabledButton,
        ]}
        onPress={connectionStatus === 'Connected' ? handleDisconnect : handleConnect}
        disabled={isButtonDisabled}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.buttonText,
          isButtonDisabled && styles.disabledButtonText
        ]}>
          {connectionStatus === 'Connected' 
            ? 'Disconnect from Mat' 
            : connectionStatus === 'Scanning' 
              ? 'Scanning...' 
              : 'Connect to Mat'}
        </Text>
      </TouchableOpacity>

      {/* Debug button - Remove in production */}
      <TouchableOpacity 
        style={styles.debugButton}
        onPress={() => {
          console.log('Debug Info:', {
            connectionStatus,
            bluetoothEnabled,
            isInitialized,
            isButtonDisabled,
            deviceId,
            discoveredDevices
          });
        }}
      >
        <Text style={styles.debugButtonText}>Show Debug Info</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Connected':
      return styles.statusConnected;
    case 'Connecting':
    case 'Scanning':
      return styles.statusConnecting;
    case 'Failed':
      return styles.statusFailed;
    default:
      return styles.statusDisconnected;
  }
};

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
    minWidth: 200,
    alignItems: 'center',
  },
  connectButton: {
    backgroundColor: '#4CAF50',
  },
  disconnectButton: {
    backgroundColor: '#FF6F61',
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#999999',
  },
  statusContainer: {
    marginBottom: 20,
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
  scanningContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scanningText: {
    marginTop: 10,
    color: '#666',
  },
  deviceList: {
    width: '100%',
    marginBottom: 20,
  },
  deviceListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  deviceItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deviceInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  debugButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  debugButtonText: {
    color: '#666',
    fontSize: 12,
  },
});