import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';

const SmartSuggestionsScreen = () => {
  // Example data for suggestions
  const itemsToUse = [
    { id: '1', name: 'Milk', daysToExpire: 2 },
    { id: '2', name: 'Bananas', daysToExpire: 1 },
  ];

  const recipeIdeas = [
    { id: '1', name: 'Banana Smoothie', ingredients: ['Bananas', 'Milk', 'Honey'] },
    { id: '2', name: 'Chicken Stir-Fry', ingredients: ['Chicken', 'Vegetables', 'Soy Sauce'] },
  ];

  const dailySummary = {
    used: ['Eggs', 'Cheese'],
    wasted: ['Lettuce'],
    added: ['Chicken', 'Carrots'],
  };

  const commonQuestions = [
    { id: '1', question: 'Summary', color: '#fca5a5' }, // Light Pink
    { id: '2', question: 'Recipes', color: '#22c55e' }, // Light Green
    { id: '3', question: 'Storage Tips', color: '#5eead4' }, // Light Blue
    { id: '4', question: 'Nutrition Info', color: '#f97316' }, // Gold
  ];

  const renderQuestionBubble = (question) => (
    <TouchableOpacity
      style={[styles.bubble, { backgroundColor: question.color }]}
      key={question.id}
    >
      <Text style={styles.bubbleText}>{question.question}</Text>
    </TouchableOpacity>
  );

  const renderItem = (item) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDetails}>
        Expires in {item.daysToExpire} {item.daysToExpire === 1 ? 'day' : 'days'}
      </Text>
    </View>
  );

  const renderRecipe = (recipe) => (
    <View style={styles.recipeCard}>
      <Text style={styles.recipeName}>{recipe.name}</Text>
      <Text style={styles.recipeDetails}>
        Ingredients: {recipe.ingredients.join(', ')}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Centered Helper Image */}
      <View style={styles.helperContainer}>
        <Image source={require('../assets/helper.png')} style={styles.helperImage} />
        <Text style={styles.helperTitle}>Ask Helper</Text>
        <Text style={styles.helperSubtitle}>
          Let Helper guide you with suggestions to reduce food waste!
        </Text>

        {/* Question Bubbles */}
        <View style={styles.bubbleContainer}>
          {commonQuestions.map((question) => renderQuestionBubble(question))}
        </View>
      </View>

      {/* Items Needing Attention */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items Needing Attention</Text>
        <FlatList
          data={itemsToUse}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Recipe Ideas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recipe Ideas</Text>
        <FlatList
          data={recipeIdeas}
          renderItem={({ item }) => renderRecipe(item)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    flexGrow: 1,
  },
  helperContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  helperImage: {
    width: 200,
    height: 200,
    borderRadius: 75,
    marginBottom: 15,
    marginTop: 50,
  },
  helperTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#292524',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 5,
    fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : 'Avenir',
  },
  helperSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: Platform.OS === 'android' ? 'sans-serif' : 'Helvetica',
    marginBottom: 20,
  },
  bubbleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  bubble: {
    backgroundColor: '#A7F3D0',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bubbleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },
  itemCard: {
    backgroundColor: '#FECACA',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  itemDetails: {
    fontSize: 14,
  },
  recipeCard: {
    backgroundColor: '#A7F3D0',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  recipeDetails: {
    fontSize: 14,
  },
  summaryText: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 5,
  },
  listContainer: {
    paddingBottom: 100,
  }
});

export default SmartSuggestionsScreen;
