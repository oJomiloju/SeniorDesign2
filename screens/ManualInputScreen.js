import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { supabase } from '../supabase'; // Import Supabase client

const ManualInputScreen = ({ navigation }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [predefinedItems, setPredefinedItems] = useState([]);
  const [loading, setLoading] = useState(true);

    // Fetch items from Supabase
    useEffect(() => {
        const fetchItems = async () => {
          setLoading(true); // Ensure loading starts
          const { data, error } = await supabase.from('predefined_items').select('*'); // Fetch all columns
      
          if (error) {
            console.error('Error fetching items:', error);
          } else {
            setPredefinedItems(data.map(item => ({
              label: item.name,
              value: item.id, // Store ID for reference
              image_url: item.image_url,
              category: item.category,
              storage: item.storage_instructions,
              calories: item.calories,
              protein: item.protein,
              fat: item.fats,
              carbs: item.carbs
            })));
          }
          setLoading(false); // Ensure loading stops
        };
      
        fetchItems();
      }, []);
      

  // Function to Save Item to Supabase
  const handleSave = async () => {
    console.log('Save button clicked!');

    if (!selectedItem) {
      alert('Please select an item.');
      return;
    }

    console.log('Fetching authenticated user...');
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      console.error('Error fetching user:', userError);
      alert('Authentication error. Please log in again.');
      return;
    }
    const userId = userData.user.id;
    console.log('User fetched successfully:', userId);

    // Find selected item details
    console.log('Finding item details...');
    const selectedItemDetails = predefinedItems.find(item => item.value === selectedItem);
    
    if (!selectedItemDetails) {
      alert('Invalid item selected.');
      console.log('Selected item not found in predefined list.');
      return;
    }

    console.log('Item details found:', selectedItemDetails);

    // Construct new item object with correct fields
    const newItem = {
      name: selectedItemDetails.label,
      category: selectedItemDetails.category,
      quantity,
      expiration_date: expirationDate.toISOString(),
      storage_instructions: selectedItemDetails.storage, // Updated field
      calories: selectedItemDetails.calories,
      protein: selectedItemDetails.protein,
      fats: selectedItemDetails.fat,
      carbs: selectedItemDetails.carbs,
      image_url: selectedItemDetails.image_url,
      profile_id: userId,
      created_at: new Date().toISOString(),
    };

    console.log('Attempting to insert item into fridge_items:', newItem);

    // Insert into Supabase
    const { data: insertData, error } = await supabase.from('fridge_items').insert([newItem]);

    if (error) {
      console.error('Error saving item:', error);
      alert(`Error saving item: ${error.message}`);
    } else {
      console.log('Item saved successfully:', insertData);
      alert(`Item saved: ${selectedItemDetails.label} (${quantity})`);
      navigation.goBack();
    }
};

  
  
  
  

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>ADD ITEM</Text>

      {/* Item Name Dropdown */}
      <Text style={styles.label}>Item Name</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <DropDownPicker
          open={openDropdown}
          value={selectedItem}
          items={predefinedItems}
          setOpen={setOpenDropdown}
          setValue={setSelectedItem}
          placeholder="Search for an item"
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      )}

      {/* Quantity Selector */}
      <Text style={styles.label}>Quantity</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
        >
          <Text style={styles.quantityText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityNumber}>{quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity(quantity + 1)}
        >
          <Text style={styles.quantityText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Expiration Date Picker */}
      <Text style={styles.label}>Expiration Date</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>{expirationDate.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={expirationDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setExpirationDate(selectedDate);
          }}
        />
      )}

      {/* Save Item Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Item</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ManualInputScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    left: 20,
    backgroundColor: 'transparent',
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 60,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    paddingTop: 10,
    alignSelf: 'flex-start',
  },
  dropdown: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 20,
    width: '100%',
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '80%',
    alignSelf: 'center',
  },
  quantityButton: {
    backgroundColor: '#000',
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  quantityNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    width: '60%', // Reduced width
    alignSelf: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
