import React, { useState, useEffect } from 'react';
import { Text, Alert, Button, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import Car from './assets/car-tempor.png'

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const styles = StyleSheet.create({
  carImg: {
    flex: 1,
    resizeMode: 'contain',
    height: '25',
    width: '25',
  },

  licText: {
    flex: 5,
    color: 'white', 
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 135,
  }
});


  return (
    <View style={{ flex: 1, backgroundColor: 'rgb(30, 30, 30)', alignItems: 'center' }}>
      <View
        style={{
          margin: 42,
          width: 370,
          height: 300,
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: 'white',
          borderWidth: 2,
          borderColor: 'white',
        }}
      >
        <Camera
          style={{
            flex: 1,
          }}
          type={type}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'column',
            }}
          >
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            />
          </View>
        </Camera>
      </View>
      <View
        style={{
          marginTop: 20,
          width: 420,
          height: 500,
          borderWidth: 1,
          borderColor: 'black',
          flexDirection: 'column',
          backgroundColor: 'rgb(12,13,14)',
        }}
      >
      <Button
          style={{ 
            borderRadius:2,
            bottomPadding: 10,
           }}
          title="Click to evaluate"
          onPress={() => Alert.alert('Left button pressed')}
        />
        <View
          style={{
            flex: 10,
            borderRightWidth: 2,
            borderRightColor: 'black',
            borderTopWidth: 2,
            borderTopColor: 'white',
            justifyContent: 'left',
            alignItems: 'left', 
            paddingLeft: 20,
            flexDirection: 'column',
          }}
        >
          <Image style={styles.carImg} source={Car} />
          <Text style={styles.licText}> DL9CAP0941 </Text>
        </View>
      </View>
    </View>
  );
}
