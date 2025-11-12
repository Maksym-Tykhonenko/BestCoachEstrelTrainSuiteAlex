import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, View } from 'react-native';
import Bestcoachtrainsett from '../bestcoachtrainsc/Bestcoachtrainsett';
import Bestcoachtraintms from '../bestcoachtrainsc/Bestcoachtraintms';
import Bestcoachtrainpl from '../bestcoachtrainsc/Bestcoachtrainpl';
import Bestcoachtrainstts from '../bestcoachtrainsc/Bestcoachtrainstts';

const Tab = createBottomTabNavigator();

const Bestcoachtraintab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.besttraintab,
        tabBarActiveTintColor: '#FFBF31',
      }}
    >
      <Tab.Screen
        name="Bestcoachtrainpl"
        component={Bestcoachtrainpl}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.besttraicon,
                focused && {
                  borderWidth: 0.6,
                  borderColor: '#FFBF31',
                },
              ]}
            >
              <Image
                source={require('../../assets/images/trainplan.png')}
                style={{ tintColor: color }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Bestcoachtraintms"
        component={Bestcoachtraintms}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.besttraicon,
                focused && {
                  borderWidth: 0.6,
                  borderColor: '#FFBF31',
                },
              ]}
            >
              <Image
                source={require('../../assets/images/trainteams.png')}
                style={{ tintColor: color }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Bestcoachtrainstts"
        component={Bestcoachtrainstts}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.besttraicon,
                focused && {
                  borderWidth: 0.6,
                  borderColor: '#FFBF31',
                },
              ]}
            >
              <Image
                source={require('../../assets/images/trainstats.png')}
                style={{ tintColor: color }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Bestcoachtrainsett"
        component={Bestcoachtrainsett}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.besttraicon,
                focused && {
                  borderWidth: 0.6,
                  borderColor: '#FFBF31',
                },
              ]}
            >
              <Image
                source={require('../../assets/images/trainsett.png')}
                style={{ tintColor: color }}
              />
            </View>
          ),
          unmountOnBlur: true,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  besttraintab: {
    position: 'absolute',
    backgroundColor: 'transparent',
    elevation: 0,
    borderTopWidth: 0,
    bottom: 20,
    marginHorizontal: 50,
  },
  besttraicon: {
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#000922',
  },
});

export default Bestcoachtraintab;
