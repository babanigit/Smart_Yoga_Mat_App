// app/OTAUpdate.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const OTAUpdateScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTA Update</Text>
      <Text>Current Version: 1.0.0</Text>
      <Button title="Check for Updates" onPress={() => alert('Checking for Updates')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
});

export default OTAUpdateScreen;
