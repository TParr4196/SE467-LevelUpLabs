import { StyleSheet, Text, View, Image, Animated } from 'react-native';
import React, { useRef, useEffect } from 'react';
import { ImageBackground } from 'react-native';
import { DEFAULT_USER_ID } from '@/utils/constants';


// import logo from '@/assets/images/logo.png';

export default function HomeScreen() {
  const bounceAnim = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim]);



  return (
    <View style={[styles.container, { justifyContent: 'flex-start', alignItems: 'stretch' }]}>
      <View style={{ width: '100%', backgroundColor: '#ddd', padding: 10 }}>
        <ImageBackground
          source={require('@/assets/images/logo.png')}
          style={{
        width: '100%',
        height: 150,
          }}
          resizeMode="contain"
        >
          <Animated.View
        style={{
          transform: [
            {
          translateX: bounceAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 10], // Adjust the range for bounce distance
          }),
            },
          ],
        }}
          >
        <Image
          source={require('@/assets/images/logo.png')}
          style={{
            width: '100%',
            height: 150,
          }}
          resizeMode="contain"
        />
          </Animated.View>
        </ImageBackground>
      </View>
      <View style={{ flexDirection: 'row', width: '100%', padding: 10 }}>
      <View style={{ width: '30%', backgroundColor: '#eee', padding: 10 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Game Library</Text>
        <Text>- Game 1</Text>
        <Text>- Game 2</Text>
        <Text>- Game 3</Text>
      </View>
      <View style={{ flex: 1, paddingLeft: 10 }}>
        <Text style={styles.title}>Level Up Labs presents Turbine</Text>
        <Text>More Flashy Homepage to come!</Text>
      </View>
      </View>
    </View>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Light background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Dark text color
    textAlign: 'center',
  },
});