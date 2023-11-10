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
  ScrollView,
} from 'react-native';
import Stripe_Screen from './components/Stripe_Screen';
import {AddressSheet, StripeProvider} from '@stripe/stripe-react-native';
import {colors} from './utils/colors';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import CreditCard_Screen from './components/CreditCard_Screen';
import {PUBLISHABLE_KEY} from '@env';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  useEffect(() => {
    LogBox.ignoreLogs(['stripe-react-native']);
  }, []);
  return (
    <StripeProvider
      publishableKey={PUBLISHABLE_KEY.toString()}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
      <ScrollView style={[styles.container, backgroundStyle]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
       
          <Stripe_Screen />
          {/* <CreditCard_Screen/> */}
      </ScrollView>
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
