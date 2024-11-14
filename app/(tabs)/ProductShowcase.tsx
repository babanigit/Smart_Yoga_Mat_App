// app/(tabs)productShowcase.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const PRODUCTS = [
  {
    id: 'mat-pro',
    name: 'Smart Yoga Mat Pro',
    description: 'Advanced pressure sensing with 3D posture analysis',
    price: '$199.99',
    image: require('../../assets/images/icon.png'),
    features: [
      'Enhanced pressure sensors',
      'Extended battery life',
      'Premium materials',
      'Advanced pose detection'
    ]
  },
  {
    id: 'mat-travel',
    name: 'Smart Travel Mat',
    description: 'Portable and lightweight smart mat for yogis on the go',
    price: '$149.99',
    image: require('../../assets/images/icon.png'),
    features: [
      'Ultra-lightweight design',
      'Quick-fold technology',
      'Travel case included',
      'Basic pose detection'
    ]
  }
];

const NEW_FEATURES = [
  {
    id: 'feature-1',
    name: 'Pose Library 2.0',
    description: 'Access to 500+ yoga poses with real-time feedback',
    icon: 'self-improvement'
  },
  {
    id: 'feature-2',
    name: 'Social Sharing',
    description: 'Share your progress and achievements with friends',
    icon: 'share'
  },
  {
    id: 'feature-3',
    name: 'AI Coach',
    description: 'Personalized recommendations based on your practice',
    icon: 'psychology'
  }
];

export default function ProductsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>New Products</Text>

      {PRODUCTS.map((product) => (
        <View key={product.id} style={styles.productCard}>
          <Image source={product.image} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            <Text style={styles.productPrice}>{product.price}</Text>
            
            <View style={styles.featuresContainer}>
              {product.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <MaterialIcons name="check-circle" size={16} color="#4A90E2" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.learnMoreButton}>
              <Text style={styles.buttonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Text style={[styles.title, styles.featuresTitle]}>New Features</Text>

      <View style={styles.featuresGrid}>
        {NEW_FEATURES.map((feature) => (
          <View key={feature.id} style={styles.featureCard}>
            {/* <MaterialIcons name={feature.icon} size={32} color="#4A90E2" /> */}
            <Text style={styles.featureName}>{feature.name}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  productCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 15,
  },
  featuresContainer: {
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#444',
  },
  learnMoreButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuresTitle: {
    marginTop: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    textAlign: 'center',
  },
  featureName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});