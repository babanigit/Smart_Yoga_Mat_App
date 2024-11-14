import React from 'react';
import { View, Text, Button, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const AnalyticsOverview = () => {
  const screenWidth = Dimensions.get('window').width;

  // Sample data for the charts
  const sessionData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [3, 5, 2, 4, 6, 3, 7],
        color: (opacity = 1) => `rgba(34, 202, 153, ${opacity})`, // Optional color
      }
    ],
  };

  const modeUsageData = {
    labels: ["Warm-Up", "Relaxation", "Posture Correction", "Meditation"],
    datasets: [
      {
        data: [25, 40, 15, 20],
        color: (opacity = 1) => `rgba(34, 139, 230, ${opacity})`,
      }
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Analytics Overview</Text>
      
      {/* Basic Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Total Sessions: 30</Text>
        <Text style={styles.statsText}>Most Used Mode: Relaxation</Text>
        <Text style={styles.statsText}>Average Sessions per Week: 5</Text>
      </View>

      {/* Line Chart for Session Count Over Time */}
      <Text style={styles.chartTitle}>Session Count Over Time</Text>
      <LineChart
        data={sessionData}
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: "#1E2923",
          backgroundGradientFrom: "#43a047",
          backgroundGradientTo: "#66bb6a",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        bezier
        style={styles.chart}
      />

      {/* Bar Chart for Most Used Modes */}
      <Text style={styles.chartTitle}>Most Used Modes</Text>
      <BarChart
        data={modeUsageData}
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix="" // Add this line to satisfy the requirement
        chartConfig={{
          backgroundColor: "#1E2923",
          backgroundGradientFrom: "#FFA726",
          backgroundGradientTo: "#FF7043",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        style={styles.chart}
      />

      <Button title="Reset Stats" onPress={() => console.log("Stats Reset")} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statsContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 8,
    marginVertical: 8,
    alignSelf: 'center',
  },
});

export default AnalyticsOverview;
