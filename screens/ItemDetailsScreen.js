import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ItemDetailsScreen = ({ route, navigation }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image_url }} style={styles.image} /> 
          <View style={styles.imageOverlay}>
            <Text style={styles.itemName}>{item.name}</Text>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          <View style={styles.card}>
            <View style={[styles.bubbleTitle, { backgroundColor: '#E0F7FA' }]}>
              <Text style={styles.bubbleText}>Item Details</Text>
            </View>
            <Text style={styles.detail}>
              <Text style={styles.label}>Category:</Text> {item.category}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Quantity:</Text> {item.quantity}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Expires on:</Text> {item.expiration_date || 'Unknown'}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Storage:</Text> {item.storage || 'Not specified'}
            </Text>
          </View>

          {/* Nutritional Facts (Ensure Data Exists) */}
          {item.nutritionalFacts && (
            <View style={styles.card}>
              <View style={[styles.bubbleTitle, { backgroundColor: '#FFF3E0' }]}>
                <Text style={styles.bubbleText}>Nutritional Facts</Text>
              </View>
              <Text style={styles.detail}>
                <Text style={styles.label}>Calories:</Text> {item.nutritionalFacts.calories || 'N/A'}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.label}>Protein:</Text> {item.nutritionalFacts.protein || 'N/A'}g
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.label}>Fats:</Text> {item.nutritionalFacts.fats || 'N/A'}g
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.label}>Carbs:</Text> {item.nutritionalFacts.carbs || 'N/A'}g
              </Text>
            </View>
          )}

          {/* Additional Info */}
          <View style={styles.card}>
            <View style={[styles.bubbleTitle, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.bubbleText}>Additional Info</Text>
            </View>
            <Text style={styles.detail}>
              <Text style={styles.label}>Purchase Date:</Text> {item.purchase_date || 'Unknown'}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Brand:</Text> {item.brand || 'Unknown'}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Health Benefits:</Text> {item.health_benefits || 'No data'}
            </Text>
          </View>

          {/* Recipes */}
          {item.recipes && item.recipes.length > 0 && (
            <View style={styles.card}>
              <View style={[styles.bubbleTitle, { backgroundColor: '#FCE4EC' }]}>
                <Text style={styles.bubbleText}>Recipes</Text>
              </View>
              {item.recipes.map((recipe, index) => (
                <Text key={index} style={styles.detail}>
                  - {recipe}
                </Text>
              ))}
            </View>
          )}

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <View style={styles.card}>
              <View style={[styles.bubbleTitle, { backgroundColor: '#FFEBEE' }]}>
                <Text style={styles.bubbleText}>Allergens</Text>
              </View>
              {item.allergens.map((allergen, index) => (
                <Text key={index} style={styles.detail}>
                  - {allergen}
                </Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  backButton: {
    position: 'absolute',
    top: 40, // Adjust based on safe area
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 50,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  itemName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // For Android shadow
  },
  bubbleTitle: {
    alignSelf: 'flex-start',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 15,
    marginBottom: 15,
  },
  bubbleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  detail: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#111827',
  },
});

export default ItemDetailsScreen;
