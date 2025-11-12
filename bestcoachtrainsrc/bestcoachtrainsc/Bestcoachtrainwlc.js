import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Bestcoachtrainlay from '../bestcoachtraincmp/Bestcoachtrainlay';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const Bestcoachtrainwlc = () => {
  const [bestTrainIndex, setBestTrainIndex] = useState(0);
  const navigation = useNavigation();

  return (
    <Bestcoachtrainlay>
      <View style={styles.besttraincontainer}>
        <Image
          source={
            bestTrainIndex === 0
              ? require('../../assets/images/trainonb1.png')
              : bestTrainIndex === 1
              ? require('../../assets/images/trainonb2.png')
              : require('../../assets/images/trainonb3.png')
          }
        />

        <View style={styles.besttrainpaginationcont}>
          {[0, 1, 2].map(index => (
            <View
              key={index}
              style={[
                styles.besttraindot,
                bestTrainIndex === index && styles.besttraindotactive,
              ]}
            />
          ))}
        </View>

        <View style={{ width: '100%' }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.besttrainbutton}
            onPress={() => {
              if (bestTrainIndex < 2) {
                setBestTrainIndex(bestTrainIndex + 1);
              } else {
                navigation.navigate('Bestcoachtraintab');
              }
            }}
          >
            <Text style={styles.besttrainbuttontxt}>
              {bestTrainIndex < 2 ? 'Next' : 'Start Coaching'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.besttraintitle}>
            {bestTrainIndex === 0
              ? 'Plan smarter. Coach better. Stay organized with your all-in-one coaching suite'
              : bestTrainIndex === 1
              ? 'Use Calendar and Quick To-Do to keep every training session in sync'
              : 'Create teams, track stats, and watch your players grow'}
          </Text>
        </View>
      </View>
    </Bestcoachtrainlay>
  );
};

const styles = StyleSheet.create({
  besttraincontainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    paddingBottom: 50,
  },
  besttraintitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '500',
    position: 'absolute',
    bottom: 140,
    left: 0,
  },
  besttrainpaginationcont: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  besttraindot: {
    width: 32,
    height: 5,
    borderRadius: 10,
    backgroundColor: '#001B61',
    marginHorizontal: 5,
  },
  besttraindotactive: {
    backgroundColor: '#0046FF',
    width: 32,
    height: 5,
    borderRadius: 10,
  },
  besttrainbuttontxt: {
    color: '#000922',
    fontSize: 16,
    fontWeight: '500',
  },
  besttrainbutton: {
    width: '100%',
    height: 51,
    backgroundColor: '#FFBF31',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
});

export default Bestcoachtrainwlc;
