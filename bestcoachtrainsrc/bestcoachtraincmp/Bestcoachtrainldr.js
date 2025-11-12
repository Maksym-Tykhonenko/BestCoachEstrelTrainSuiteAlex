import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import Bestcoachtrainlay from './Bestcoachtrainlay';

const Bestcoachtrainldr = () => {
  const [showBestTrainWelcomeText, setShowBestTrainWelcomeText] =
    useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBestTrainWelcomeText(true);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Bestcoachtrainlay>
      <View style={styles.besttraincontainer}>
        <Image source={require('../../assets/images/loaderstar.png')} />
        {showBestTrainWelcomeText && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }],
            }}
          >
            {Platform.OS === 'ios' ? (
              <>
                <Text style={styles.besttraintext}>Best Coach:</Text>
                <Text style={styles.besttrainsubttl}>Estrel TrainSuite</Text>
              </>
            ) : (
              <Text style={styles.besttraintext}>Best Coach: Win Day</Text>
            )}
          </Animated.View>
        )}
      </View>
    </Bestcoachtrainlay>
  );
};

const styles = StyleSheet.create({
  besttraincontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  besttraintext: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 30,
  },
  besttrainsubttl: {
    color: 'white',
    fontSize: 38,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Bestcoachtrainldr;
