import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { supabase } from '../supabase';
import callOpenAI from '../api/openai';

const SmartSuggestionsScreen = () => {
  const [itemsToUse, setItemsToUse] = useState([]);
  const [recipeIdeas, setRecipeIdeas] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  useEffect(() => {
    const fetchExpiringItems = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return;

      const { data: fridgeItems, error } = await supabase
        .from('fridge_items')
        .select('*')
        .eq('profile_id', user.id);

      if (error) {
        console.error('Error fetching fridge items:', error);
        return;
      }

      const today = new Date();
      const expiringSoon = fridgeItems.filter(item => {
        const expDate = new Date(item.expiration_date);
        const diffDays = (expDate - today) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 4;
      }).map(item => ({
        id: item.id,
        name: item.name,
        daysToExpire: Math.ceil((new Date(item.expiration_date) - today) / (1000 * 60 * 60 * 24))
      }));

      const expired = fridgeItems.filter(item => {
        const expDate = new Date(item.expiration_date);
        return expDate < today;
      }).map(item => ({
        id: item.id,
        name: item.name,
        daysToExpire: 0
      }));

      setItemsToUse([...expiringSoon, ...expired]);
    };

    fetchExpiringItems();
  }, []);

  useEffect(() => {
    if (itemsToUse.length > 0) {
      generateRecipes();
    }
  }, [itemsToUse]);

  const generateRecipes = async () => {
    const itemNames = itemsToUse.map(item => item.name).join(', ');
    const prompt = `I have the following food items: ${itemNames}. Can you suggest 2-3 simple recipe ideas? Each recipe should have a title and the ingredients listed.`;

    setLoadingRecipes(true);
    const response = await callOpenAI(prompt);

    const recipeList = response
      .split('\n')
      .filter(line => line.trim() !== '')
      .map((line, index) => ({
        id: index.toString(),
        name: line,
        ingredients: [],
      }));

    setRecipeIdeas(recipeList);
    setLoadingRecipes(false);
  };

  const commonQuestions = [
    { id: '1', question: 'Summary', color: '#fca5a5' },
    { id: '2', question: 'Recipes', color: '#22c55e' },
    { id: '3', question: 'Storage Tips', color: '#5eead4' },
    { id: '4', question: 'Nutrition Info', color: '#f97316' },
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
        {item.daysToExpire > 0 ? `Expires in ${item.daysToExpire} ${item.daysToExpire === 1 ? 'day' : 'days'}` : 'Expired'}
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
      <View style={styles.helperContainer}>
        <Image source={require('../assets/helper.png')} style={styles.helperImage} />
        <Text style={styles.helperTitle}>Ask Helper</Text>
        <Text style={styles.helperSubtitle}>
          Let Helper guide you with suggestions to reduce food waste!
        </Text>

        <View style={styles.bubbleContainer}>
          {commonQuestions.map((question) => renderQuestionBubble(question))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items Needing Attention</Text>
        <FlatList
          data={itemsToUse}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recipe Ideas</Text>
        {loadingRecipes ? (
          <Text>Loading recipe ideas...</Text>
        ) : (
          <FlatList
            data={recipeIdeas}
            renderItem={({ item }) => renderRecipe(item)}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
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
  listContainer: {
    paddingBottom: 100,
  }
});

export default SmartSuggestionsScreen;
