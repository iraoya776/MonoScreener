import {StyleSheet, Text, View} from 'react-native';

const ConfirmationScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Confirmation Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ConfirmationScreen;
