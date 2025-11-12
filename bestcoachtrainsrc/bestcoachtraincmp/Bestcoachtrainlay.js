import { ScrollView, StyleSheet, View } from 'react-native';

const Bestcoachtrainlay = ({ children }) => {
  return (
    <View style={styles.besttraincontainer}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  besttraincontainer: {
    flex: 1,
    backgroundColor: '#000922',
  },
});

export default Bestcoachtrainlay;
