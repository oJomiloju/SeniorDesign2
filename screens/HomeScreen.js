import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
} from 'react-native';

const HomeScreen = ({navigation}) => {
  // Static food data
  const fridgeItems = [
    {
      id: '1',
      name: 'Milk',
      category: 'Dairy',
      quantity: '4',
      image: 'https://assets.shop.loblaws.ca/products/20149754/b1/en/angle/20149754_angle_a01_@2.png',
      expirationDate: '2025-01-25',
      storage: 'Keep refrigerated at 4°C',
      nutritionalFacts: {
        calories: 150,
        protein: 8,
        fats: 5,
        carbs: 12,
      },
      purchaseDate: '2025-01-18',
      brand: 'Brand A Dairy',
      healthBenefits: 'Rich in calcium and essential for strong bones.',
      recipes: ['Milkshake', 'Pancakes', 'Creamy Pasta'],
      allergens: ['Lactose'],
    },
    {
      id: '2',
      name: 'Bananas',
      category: 'Fruit',
      quantity: '10',
      image: 'https://cdn11.bigcommerce.com/s-1ly92eod7l/images/stencil/1280x1280/products/647/790/Product_Produce_Banana__90431.1700494209.jpg?c=1&imbypass=on',
      expirationDate: '2025-01-22',
      storage: 'Store at room temperature. Do not refrigerate until ripe.',
      nutritionalFacts: {
        calories: 105,
        protein: 1.3,
        fats: 0.3,
        carbs: 27,
      },
      purchaseDate: '2025-01-15',
      brand: 'Tropical Farms',
      healthBenefits: 'Great source of potassium and energy.',
      recipes: ['Banana Bread', 'Smoothies', 'Banana Pancakes'],
      allergens: [],
    },
    {
      id: '3',
      name: 'Chicken',
      category: 'Meat',
      quantity: '3',
      image: 'https://www.simplyrecipes.com/thmb/Sw2rWO2l615LjOnmUyDIWjAMDKg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2007__04__honey-glazed-roast-chicken-horiz-a-1800-2057270028084ff2bdb54fcb0f2d3227.jpg',
      expirationDate: '2025-01-20',
      storage: 'Keep frozen or refrigerated at 4°C.',
      nutritionalFacts: {
        calories: 239,
        protein: 27,
        fats: 14,
        carbs: 0,
      },
      purchaseDate: '2025-01-17',
      brand: 'Fresh Organic Farms',
      healthBenefits: 'High in protein, essential for muscle growth.',
      recipes: ['Grilled Chicken', 'Chicken Soup', 'Chicken Salad'],
      allergens: [],
    },
  ];
  

  // Category colors
  const categoryColors = {
    Dairy: '#a3e635',
    Fruit: '#06b6d4',
    Meat: '#fb923c',
  };

  // State to track selected filter
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Filtered items based on the selected filter
  const filteredItems =
    selectedFilter === 'All'
      ? fridgeItems
      : fridgeItems.filter((item) => item.category === selectedFilter);

  // Render each food item
  const renderFridgeItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        { backgroundColor: categoryColors[item.category] || '#f8f8f8' },
      ]}
      onPress={() => navigation.navigate('ItemDetails', { item })}
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
      </View>
      <Text style={styles.itemQuantity}>{item.quantity}</Text>
    </TouchableOpacity>
  );

  //  <Text style={styles.addButtonText}>+</Text>
  

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome Back, Steph</Text>
        <Text style={styles.subheaderText}>
          You have {fridgeItems.length} items in your fridge.
        </Text>
        <TouchableOpacity
          style={styles.addHeaderButton}
          onPress={() => console.log('Add item functionality')}
        >
          <Text style={styles.addHeaderButtonText}>+</Text>
        </TouchableOpacity>
      </View>


      {/* Filter Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        {['All', 'Dairy', 'Fruit', 'Meat'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter && styles.filterButtonTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Food Section */}
      <FlatList
        data={filteredItems}
        renderItem={renderFridgeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : 'Avenir',
    marginBottom: 10,
  },
  subheaderText: {
    fontSize: 20,
    color: '#666',
    fontFamily: Platform.OS === 'android' ? 'sans-serif' : 'Helvetica',
  },
  addHeaderButton: {
    marginTop: 10, // Add space above the button
    alignSelf: 'flex-start', // Align the button to the left
    backgroundColor: '#000',
    width: 50, // Adjust size as needed
    height: 50,
    borderRadius: 25, // Make it circular
    justifyContent: 'center',
    alignItems: 'center',
  },
  addHeaderButtonText: {
    color: '#FFF',
    fontSize: 24, // Increase font size
    fontWeight: 'bold',
  },
  filterBar: {
    marginBottom: 10,
    paddingHorizontal: 5,
    paddingBottom: 10,
    height: 80, // Adjust height as needed
    flexDirection: 'row',
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center', // Center text inside the button
    minWidth: 80, // Ensures consistent button width
  },  
  filterButtonActive: {
    backgroundColor: '#000',
  },
  filterButtonText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: '#FFF',
  },   
  listContainer: {
    paddingBottom: 80,
    paddingTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignSelf: 'center',
    width: '94%',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  itemCategory: {
    fontSize: 14,
    color: '',
    marginTop: 5,
  },
  itemQuantity: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#000',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
