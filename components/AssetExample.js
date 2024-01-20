import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';

export default function App() {
  const [selectedOption, setSelectedOption] = useState(null);

  const rideOptions = [
    { id: 1, type: 'UberX', price: '$10.00' },
    { id: 2, type: 'UberXL', price: '$15.00' },
    { id: 3, type: 'UberBlack', price: '$20.00' },
  ];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleBookRide = () => {
    if (selectedOption) {
      // Implement booking logic here
      alert(Booking confirmed for ${selectedOption.type} - ${selectedOption.price});
    } else {
      alert('Please select a ride option to book.');
    }
  };

  return (
      <View style={styles.optionsContainer}>
        {rideOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.option, selectedOption?.id === option.id && styles.selectedOption]}
            onPress={() => handleOptionSelect(option)}
          >
            <Text style={styles.optionType}>{option.type}</Text>
            <Text style={styles.optionPrice}>{option.price}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.bookRideButton} onPress={handleBookRide}>
        <Text style={styles.bookRideText}>Book Ride</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  optionsContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 150,
    width: '100%',
  },
  option: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  selectedOption: {
    backgroundColor: 'lightblue',
  },
  optionType: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionPrice: {
    marginTop: 8,
    color: 'green',
  },
  bookRideButton: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  bookRideText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});