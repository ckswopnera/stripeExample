import React, {useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  useColorScheme,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native';
import LottieView from 'lottie-react-native';
import CreditCardForm, {FormModel} from 'rn-credit-card';
import {colors} from '../utils/colors';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const CreditCard_Screen = () => {
  const formMethods = useForm({
    // to trigger the validation on the blur event
    mode: 'onBlur',
    defaultValues: {
      holderName: '',
      cardNumber: '',
      expiration: '',
      cvv: '',
    },
  });
  const {handleSubmit, formState} = formMethods;
  const isDarkMode = useColorScheme() === 'dark';
  const [darkMode, setdarkMode] = useState(isDarkMode);
  useEffect(() => {
    setdarkMode(isDarkMode);
    // console.log({darkMode});
  }, [isDarkMode]);

  function onSubmit(model) {
    console.log(model);
  }

  return (
    <FormProvider {...formMethods}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.avoider}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <CreditCardForm
            //  backgroundImage={
            //   <Image
            //     style={{
            //       position: 'absolute',
            //       width: '100%',
            //       height: '100%',
            //       borderRadius: 12,
            //     }}
            //     source={background}
            //   />
            LottieView={LottieView}
            horizontalStart
            translations={{
              securityCode: 'CVV',
              expiration: 'Valid Through',
              nameSurname: 'JOHN DOE',
            }}
            inputColors={{
              focused: darkMode === true ? colors.light_gray : '#080F9C',
              errored: '#B00020',
              regular: '#B9C4CA',
            }}
            overrides={{
              labelContainer: {
                backgroundColor:
                  darkMode === true ? Colors.darker : '#f3f3f3f3',
                borderRadius: 6,
              },
            }}
          />
        </KeyboardAvoidingView>

        {formState.isValid && (
          <TouchableOpacity
            style={[
              styles.button2,
              {
                backgroundColor:
                  darkMode === true ? Colors.lighter : Colors.darker,
              },
            ]}
            onPress={handleSubmit(onSubmit)}>
            <Text
              style={{
                color: darkMode === true ? Colors.darker : Colors.lighter,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '700',
              }}>
              CONFIRM PAYMENT
            </Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avoider: {
    flex: 1,
    padding: 36,
  },
  button2: {
    marginHorizontal: 36,
    marginVertical: 20,
    height: 50,
    borderRadius: 10,
    padding: 14,
  },
  button1: {
    marginHorizontal: 36,
    marginTop: 0,
  },
});

export default CreditCard_Screen;
