import {ActivityIndicator, Modal, Text, View} from 'react-native';
import {AppContext} from './GlobalVariables';
import {useContext} from 'react';
import {Themes} from './Themes';
import LottieView from 'lottie-react-native';

export function Preloader() {
  const {preloader} = useContext(AppContext);
  return (
    <>
      <Modal visible={preloader} transparent={true}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: '#ffffffcd',
          }}>
          <LottieView
            source={require('../../assets/animations/emptyPro.json')}
            autoPlay
            loop
            style={{height: 200, width: '100%'}}
          />
        </View>
      </Modal>
    </>
  );
}
