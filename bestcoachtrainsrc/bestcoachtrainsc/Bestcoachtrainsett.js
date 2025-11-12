import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Switch,
  Linking,
  Image,
  Platform,
} from 'react-native';
import Bestcoachtrainlay from '../bestcoachtraincmp/Bestcoachtrainlay';
import { useStore } from '../bestcoachtrainst/bestCoachTrainContext';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

const Bestcoachtrainsett = () => {
  const { bestTrainNotificationsEnabled, setBestTrainNotificationsEnabled } =
    useStore();

  const togglebestTrainNotifications = async value => {
    Toast.show({
      text1: !bestTrainNotificationsEnabled
        ? 'Notifications turned on!'
        : 'Notifications turned off!',
    });

    try {
      await AsyncStorage.setItem(
        'best_train_app_notifications',
        JSON.stringify(value),
      );
      setBestTrainNotificationsEnabled(value);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const bestTrainHandleTerms = () => {
    Linking.openURL(
      'https://www.termsfeed.com/live/47bf3fce-9aab-47a2-bae8-9b64fabb0366',
    );
  };

  const bestTrainHandlePrivacy = () => {
    Linking.openURL(
      'https://www.termsfeed.com/live/03cb25a0-0bf3-492d-8945-b270333110fa',
    );
  };

  return (
    <Bestcoachtrainlay>
      <View style={styles.besttrainContainer}>
        <Text style={styles.besttrainTitle}>SETTINGS</Text>

        <View style={styles.besttrainCard}>
          <Text style={styles.besttrainLabel}>Notifications</Text>
          <Switch
            value={bestTrainNotificationsEnabled}
            onValueChange={notValue => togglebestTrainNotifications(notValue)}
            trackColor={{ false: '#001B61', true: '#FFBF31' }}
            thumbColor="#FFF"
          />
        </View>

        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={styles.besttrainCard}
            activeOpacity={0.8}
            onPress={() =>
              Linking.openURL(
                'https://apps.apple.com/us/app/best-coach-estrel-trainsuite/id6754845651',
              )
            }
          >
            <Text style={styles.besttrainLabel}>Share the app</Text>
            <Image source={require('../../assets/images/trainsshareset.png')} />
          </TouchableOpacity>
        )}

        {Platform.OS === 'ios' && (
          <>
            <TouchableOpacity
              style={styles.besttrainCard}
              activeOpacity={0.8}
              onPress={bestTrainHandleTerms}
            >
              <Text style={styles.besttrainLabel}>Terms of Use</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.besttrainCard}
              activeOpacity={0.8}
              onPress={bestTrainHandlePrivacy}
            >
              <Text style={styles.besttrainLabel}>Privacy Policy</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Bestcoachtrainlay>
  );
};

const styles = StyleSheet.create({
  besttrainContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: height * 0.08,
    paddingBottom: 120,
  },
  besttrainTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
  },
  besttrainCard: {
    width: '100%',
    backgroundColor: '#001B61',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  besttrainLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  besttrainArrow: {
    color: '#FFBF31',
    fontSize: 20,
  },
});

export default Bestcoachtrainsett;
