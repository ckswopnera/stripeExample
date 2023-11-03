import React, {createContext, useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
 LogBox,
 KeyboardAvoidingView,
 Platform,
} from 'react-native';
import Stripe_Screen from './components/Stripe_Screen';
import {StripeProvider} from '@stripe/stripe-react-native';
import {colors} from './utils/colors';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import CreditCard_Screen from './components/CreditCard_Screen';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const App = () => {
  const publishableKey =
    'pk_test_51Nx9flSEDYmWo5gJoPuXFCUBHx0bdmWHIb6dncqFJopRGLuvc7kDHvQJai9LXd9XO4T7e5oHlutAFnyIsZyTmxxz00c8dI4yWk';
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
useEffect(() => {
  LogBox.ignoreLogs(['stripe-react-native']);
}, [])
  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
      <SafeAreaView style={[styles.container, backgroundStyle]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <Stripe_Screen />
        {/* <CreditCard_Screen/> */}

      </SafeAreaView>
    </StripeProvider>
  );
};
const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
    paddingTop: 5,
    // paddingHorizontal: 4
  },
});
export default App;
