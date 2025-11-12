import { createStackNavigator } from '@react-navigation/stack';
import Bestcoachtraintab from './Bestcoachtraintab';
import Bestcoachtrainwlc from '../bestcoachtrainsc/Bestcoachtrainwlc';
import Bestcoachtraintmsdet from '../bestcoachtrainsc/Bestcoachtraintmsdet';

const Stack = createStackNavigator();

const Bestcoachtrainstack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Bestcoachtrainwlc" component={Bestcoachtrainwlc} />
      <Stack.Screen name="Bestcoachtraintab" component={Bestcoachtraintab} />
      <Stack.Screen
        name="Bestcoachtraintmsdet"
        component={Bestcoachtraintmsdet}
      />
    </Stack.Navigator>
  );
};

export default Bestcoachtrainstack;
