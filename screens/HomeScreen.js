import React, { useState, useEffect, useRef } from 'react';
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
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Animated,
  Easing,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../supabase';

const HomeScreen = ({navigation}) => {
  // Static food data
  const [fridgeItems, setFridgeItems] = useState([]);
  const [loading, setLoading] = useState(true);
  // Category colors
  const categoryColors = {
    Dairy: '#a3e635',
    Fruit: '#06b6d4',
    Meat: '#fb923c',
    Grains: '#fde68a',
    Vegetables: '#34d399',
    Seafood: '#fda4af',
    Sides: '#fde68a',
    Beverages: '#fde68a',
    Snacks: '#fde68a',
    Desserts: '#fde68a',
    Condiments: '#fde68a',
    Miscellaneous: '#fde68a',
    Unknown: '#fde68a',
    Other: '#fde68a',
    Canned_Goods: '#fde68a',
    Frozen_Foods: '#fde68a',
    Spices: '#fde68a',
  };

   // Fetch items from Supabase
   useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('fridge_items')
        .select('*')
        .order('created_at', { ascending: false });
  
      if (error) {
        console.error('Error fetching fridge items:', error);
      } else {
        setFridgeItems(data);
      }
      setLoading(false);
    };
  
    fetchItems(); // Fetch items on initial load
  
    const unsubscribe = navigation.addListener('focus', () => {
      fetchItems(); // Fetch items every time the screen is focused
    });
  
    return unsubscribe;
  }, [navigation]);
  
  



  // Modal function 
  const toggleModal = (visible) => {
    if (visible) {
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: -30, // Moves modal into view
        duration: 300,
        easing: Easing.out(Easing.exp), // Smooth transition
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300, // Moves modal out of view
        duration: 300,
        easing: Easing.in(Easing.exp),
        useNativeDriver: true,
      }).start(() => setModalVisible(false)); // Hide modal AFTER animation
    }
  };
  
  // State to track selected filter
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isExpanded, setIsExpanded] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [ModalVisible, setModalVisible] = useState(false);


  
  
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
      onPress={() => navigation.navigate('ItemDetails', { item })} // Navigate to ItemDetailsScreen
    >
      <Image source={{ uri: item.image_url }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
      </View>
      <Text style={styles.itemQuantity}>{item.quantity}</Text>
    </TouchableOpacity>
  );

  const renderHiddenItem = ({ item }) => (
    <View style={styles.hiddenContainer}>
      {/* Update Button */}
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => Alert.alert("Update", "Update feature coming soon!")}
      >
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
  
      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteItem(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );  
  
  const deleteItem = async (id) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            const { error } = await supabase
              .from('fridge_items')
              .delete()
              .eq('id', id);
  
            if (error) {
              console.error("Error deleting item:", error);
              Alert.alert("Error", "Could not delete item. Please try again.");
            } else {
              setFridgeItems(fridgeItems.filter(item => item.id !== id));
            }
          },
          style: "destructive",
        },
      ]
    );
  };  
  

  
  

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
          onPress={() => setModalVisible(true)}
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

        {loading ? (
      <ActivityIndicator size="large" color="#000" />
    ) : (
      <SwipeListView
      data={filteredItems}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderFridgeItem}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-150} // Increase swipe distance to fit both buttons
      disableRightSwipe
      stopRightSwipe={-150} // Prevent over-swiping
      contentContainerStyle={styles.listContainer}
    />    
    )}


      {/* Food Section */}
      <Modal transparent={true} visible={ModalVisible} animationType="none">
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.modalTitle}>Add an Item</Text>

            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>📸 Barcode Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>🧾 Receipt Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate('ManualInput');
            }}
          >
            <Text style={styles.optionText}>✍ Manual Input</Text>
          </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => toggleModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>


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
    paddingBottom: 30,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Ensures it appears at the bottom
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
  modalContent: {
    width: '100%',
    height: '80%', // Controls modal size
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5, // Android shadow
  },  
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionButton: {
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'red',
  },  
  hiddenContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align buttons to the right
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginVertical: 7, // Align with item padding
    borderRadius: 20,
    height: 75, // Match item height
  },
  
  updateButton: {
    backgroundColor: '#4CAF50', // Green for Update
    justifyContent: 'center',
    alignItems: 'center',
    width: 75, // Same width as delete button
    height: '88%',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    position: 'absolute',
    right: 85, // Place it to the left of delete button
  },
  
  updateButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  deleteButton: {
    backgroundColor: '#FF3B30', // Red for Delete
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '88%',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    position: 'absolute',
    right: 10,
  },
  
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },  
});

export default HomeScreen;

