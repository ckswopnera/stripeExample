/* eslint-disable prettier/prettier */
/*global Stripe_Screen,*/
/*eslint no-undef: "error"*/

import React, {useContext, useEffect, useState} from 'react';
import {
  CardField,
  CardFieldInput,
  CardForm,
  useStripe,
  usePlatformPay,
  PlatformPayButton,
  PlatformPay,
} from '@stripe/stripe-react-native';
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
  Button,
  StyleSheet,
  useColorScheme,
  Image,
  ImageBackground,
  TextInput,
  Modal,
} from 'react-native';
import Section from '../utils/themes';
import {colors} from '../utils/colors';
import {PaymentIcon} from 'react-native-payment-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import CountryPicker, {
  DARK_THEME,
  TranslationLanguageCodeList,
} from 'react-native-country-picker-modal';
import {Field, Formik} from 'formik';
import * as Yup from 'yup';
import {
  handleTextInput,
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';
import {TextField} from 'react-native-material-textfield';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default Stripe_Screen = () => {
  const [card, setCard] = useState(CardFieldInput.Details | null);
  const {confirmPayment, handleCardAction} = useStripe();
  const isDarkMode = useColorScheme() === 'dark';
  const [isdarkMode, setisdarkMode] = useState(isDarkMode);
  const [focusedField, setfocusedField] = useState();
  const [hiddenDetails, sethiddenDetails] = useState(true);
  const {createPaymentMethod} = useStripe();
  const {googlePayCheck} = useStripe();
  const {isPlatformPaySupported} = usePlatformPay();
  const [isvisible, setisvisible] = useState(false);
  const [isModal, setisModal] = useState(false);
  const [country, setCountry] = useState();
  const [totalValues, settotalValues] = useState();

  const handlePayment = async () => {
    try {
      const {paymentMethod, error} = await createPaymentMethod({
        paymentMethodType: 'Card',
        card: {
          cardNumber: card?.number, // Replace with the actual card details
          expMonth: card?.expiryMonth,
          expYear: card?.expiryYear,
          cvc: card?.cvc,
        },
      });
      // console.log({card});
      if (error) {
        console.error('Error:', error.message);
      } else {
        const cardBrand = paymentMethod?.Card?.brand;
        console.log('type', paymentMethod?.Card?.funding);
        // let cardType;
        if (
          cardBrand === 'Visa' ||
          cardBrand === 'MasterCard' ||
          cardBrand === 'Discover' ||
          cardBrand === 'American Express'
        ) {
          // It's a credit card
          console.log('Credit Card:', cardBrand);
        } else {
          // It's a debit card or another card type
          console.log('Debit Card or Other:', cardBrand);
        }

        // switch (cardBrand) {
        //   case 'visa':
        //   case 'mastercard':
        //     cardType = 'Credit Card';
        //     break;
        //   default:
        //     cardType = 'Debit Card';
        //     break;
        // }

        // console.log(`Card Type: ${cardType}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    Alert.alert('Success!');
  };

  useEffect(() => {
    setisdarkMode(isDarkMode);
  }, [isDarkMode]);
  return (
    <View
      style={{
        alignItems: 'center',
        height: windowHeight,
        width: windowWidth,
        flexDirection: 'column',
      }}>
      {/* <Image
        source={require('../assets/atm_card1.png')}
        style={{
          width: windowWidth,
          height: windowWidth,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        resizeMode="contain"
      /> */}
      <ImageBackground
        source={require('../assets/card_front.png')}
        resizeMode="stretch"
        style={styles.image}>
        <Text
          style={[
            styles.cardText,
            {
              color:
                card?.validNumber !== 'Valid' ? colors.textErrorColor : '#fff',
            },
          ]}>
          {card?.number === undefined
            ? '**** **** **** ****'
            : card?.number === null
            ? '**** **** **** ****'
            : card?.number?.length !== 0 && hiddenDetails === false
            ? card?.number?.match(/.{1,4}/g)?.join(' ')
            : card?.number?.length !== 0 &&
              hiddenDetails === true &&
              // card?.number?.match(/.{1,4}/g)?.length > 0 &&
              card?.number?.match(/.{1,4}/g)?.length === 4
            ? `**** **** **** ${card?.number?.match(/.{1,4}/g)[3]} `
            : card?.number?.length !== 0 &&
              hiddenDetails === true &&
              card?.number?.match(/.{1,4}/g)?.length === 3
            ? '**** **** ****'
            : card?.number?.length !== 0 &&
              hiddenDetails === true &&
              card?.number?.match(/.{1,4}/g)?.length === 2
            ? '**** ****'
            : card?.number?.length !== 0 &&
              hiddenDetails === true &&
              card?.number?.match(/.{1,4}/g)?.length === 1
            ? '****'
            : ''}
        </Text>
        <PaymentIcon
          style={styles.textCard}
          type={
            card?.number?.length === 0
              ? null
              : card?.brand === 'AmericanExpress'
              ? 'american-express'
              : card?.brand === 'DinersClub'
              ? 'diners-club'
              : card?.brand?.toLowerCase()
          }
          width={50}
          height={50}
        />
        <Text style={styles.validThrough}>Valid Through</Text>
        {focusedField==='ExpiryDate'&&(<View style={[styles.validThrough,{width:90,height:1,backgroundColor:'#fff'}]}></View>)}
        <Text
          style={[
            styles.validThroughDetails,
            {
              color:
                card?.validExpiryDate !== 'Valid'
                  ? colors.textErrorColor
                  : '#fff',
            },
          ]}>
          {card === 0 || hiddenDetails === true
            ? '**/**'
            : card?.expiryMonth === null && card?.expiryYear === null
            ? '**/**'
            : card?.expiryMonth !== null && card?.expiryYear === null
            ? `${card?.expiryMonth}/**`
            : card?.expiryMonth === null && card?.expiryYear !== null
            ? `** /${card?.expiryYear}`
            : `${card?.expiryMonth} / ${card?.expiryYear}`}
        </Text>
        <Text style={styles.cvcStyle}>CVC</Text>
        {focusedField==='Cvc'&&(<View style={[styles.cvcStyle,{width:25,height:1,backgroundColor:'#fff'}]}></View>)}
        <Text
          style={[
            styles.cvcDetails,
            {color: card?.validCVC != 'Valid' ? colors.textErrorColor : '#fff'},
          ]}>
          {card?.validCVC === 'Valid' && hiddenDetails !== true
            ? card?.cvc
            : card?.validCVC === 'Incomplete' && hiddenDetails !== true
            ? card?.cvc
            : '***'}
        </Text>
        <MaterialCommunityIcons
          name={hiddenDetails ? 'eye-off' : 'eye'}
          size={23}
          style={styles.hiddenIcon}
          onPress={() => {
            hiddenDetails ? sethiddenDetails(false) : sethiddenDetails(true);
          }}
        />
      </ImageBackground>
      <Formik
        initialValues={{
          name: '',
          email: '',
          // password: '',
          country: '',
          card: false,
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .min(2, 'Name must be at least 2 characters')
            .required('Name is required'),
          email: Yup.string()
            .email('Invalid email')
            .required('Email is required'),
          // password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
          country: Yup.string().required('Country is required'),
          card: Yup.boolean()
            .oneOf([true], 'Please check the card information.')
            .required('Card information is required'),
        })}
        onSubmit={values => {
          // Handle form submission here
          console.log('Form data submitted:', values);
          handlePayment();
          settotalValues(values);
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            {/* <View
              style={{
                alignItems: 'flex-start',
                width: windowWidth - 8,
                justifyContent: 'flex-start',
                marginVertical: 6,
              }}>
              <Text
                style={{
                  color:
                    isDarkMode === true ? Colors.lighter : 'rgba(0,0,0,0.6)',
                  padding: 4,
                }}>
                Password
              </Text>
              <TextInput
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
                keyboardType="email-address"
                cursorColor={isdarkMode === true ? '#fff' : '#000'}
                style={{
                  color:
                    isdarkMode === true
                      ? colors.dark_textColor
                      : colors.light_textColor,
                  borderColor:
                    isdarkMode === true ? colors.dark_borderColor : 'grey',
                  borderRadius: 8,
                  borderWidth: 1,
                  width: '100%',
                  paddingStart: 14,
                }}
              />
              {touched.password && errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}
            </View> */}
            <View
              style={{
                alignItems: 'flex-start',
                width: windowWidth - 8,
                justifyContent: 'flex-start',
                marginVertical: 6,
              }}>
              <Text
                style={{
                  color:
                    isDarkMode === true ? Colors.lighter : 'rgba(0,0,0,0.6)',
                  padding: 4,
                }}>
                Email
              </Text>
              <TextInput
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
                cursorColor={isdarkMode === true ? '#fff' : '#000'}
                style={{
                  color:
                    isdarkMode === true
                      ? colors.dark_textColor
                      : colors.light_textColor,
                  borderColor:
                    isdarkMode === true ? colors.dark_borderColor : 'grey',
                  borderRadius: 8,
                  borderWidth: 1,
                  width: '100%',
                  paddingStart: 14,
                }}
              />
              {touched.email && errors.email && (
                <Text style={{color: 'red'}}>{errors.email}</Text>
              )}
            </View>
            <View
              style={{
                alignItems: 'flex-start',
                width: windowWidth - 8,
                justifyContent: 'flex-start',
                padding: 4,
                marginTop: 6,
              }}>
              <Text
                style={{
                  color:
                    isDarkMode === true ? Colors.lighter : 'rgba(0,0,0,0.6)',
                }}>
                Card information
              </Text>
            </View>

            <View
              style={{
                alignItems: 'flex-start',
              }}>
              <CardField
                // countryCode='IN'
                dangerouslyGetFullCardDetails={true}
                postalCodeEnabled={false}
                placeholders={{
                  number: 'Card number',
                  expiration: 'MM/YY',
                  cvc: 'CVC',
                }}
                cardStyle={{
                  backgroundColor:
                    isdarkMode === true
                      ? colors.dark_backgroundColor
                      : colors.light_backgroundColor,
                  textColor:
                    isdarkMode === true
                      ? colors.dark_textColor
                      : colors.light_textColor,
                  borderColor:
                    isdarkMode === true ? colors.dark_borderColor : 'grey',
                  borderRadius: 8,
                  borderWidth: 1,
                  textErrorColor: colors.textErrorColor,
                  placeholderColor: colors.placeholderColor,
                  cursorColor: isdarkMode === true ? '#ffffff' : '#000000',
                }}
                autofocus={false}
                style={styles.cardField}
                // accessibilityHint={{number:'test'}}

                onCardChange={cardDetails => {
                  setCard(cardDetails);
                  console.log('card field Details', cardDetails);
                  // if(cardDetails?.complete===true){
                  handleChange('card')(cardDetails?.complete.toString());
                  // }
                  // else{
                  //   handleChange('card')(0)
                  // }
                }}
                onFocus={focusedField => {
                  console.log('focusField', {focusedField});
                  setfocusedField(focusedField);
                }}
              />
              {touched.card && errors.card && (
                <Text style={{color: 'red'}}>{errors.card}</Text>
              )}
            </View>
            {/* <CardForm
        defaultValues={{countryCode: 'IN'}}
        onFormComplete={cardDetails => {
          console.log('card form details', cardDetails);
          setCard(cardDetails);
        }}
        // onFocus={focusedField => {
        //   console.log('focusField', focusedField);
        // }}
        dangerouslyGetFullCardDetails={true}
        postalCodeEnabled={false}
        placeholders={{
          number: 'Card number',
          expiration: 'MM/YY',
          cvc: 'CVC',
        }}
        cardStyle={{
          backgroundColor:
            isdarkMode === true
              ? colors.dark_backgroundColor
              : colors.light_backgroundColor,
          textColor:
            isdarkMode === true ? colors.dark_textColor : colors.light_textColor,
          borderColor:
            isdarkMode === true
              ? colors.dark_borderColor
              : colors.light_borderColor,
          borderRadius: 8,
          borderWidth: 1,
          textErrorColor: colors.textErrorColor,
          placeholderColor: colors.placeholderColor,
          cursorColor: isdarkMode === true ? '#ffffff' : '#000000',
        }}
        autofocus={false}
        style={{
          width: windowWidth - 8,
          height: 200,
          marginHorizontal: 20,
          // backgroundColor:'red',
          // color:'red',
        }}
      />  */}
            <View
              style={{
                alignItems: 'flex-start',
                width: windowWidth - 8,
                justifyContent: 'flex-start',
                marginTop: 8,
                marginBottom: 6,
                // height:40
              }}>
              <Text
                style={{
                  color:
                    isDarkMode === true ? Colors.lighter : 'rgba(0,0,0,0.6)',
                  padding: 4,
                }}>
                Name on card
              </Text>
              <TextInput
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                cursorColor={isdarkMode === true ? '#fff' : '#000'}
                style={{
                  color:
                    isdarkMode === true
                      ? colors.dark_textColor
                      : colors.light_textColor,
                  borderColor:
                    isdarkMode === true ? colors.dark_borderColor : 'grey',
                  borderRadius: 8,
                  borderWidth: 1,
                  width: '100%',
                  paddingStart: 14,
                }}
              />
              {touched.name && errors.name && (
                <Text style={{color: 'red'}}>{errors.name}</Text>
              )}
            </View>
            <View
              style={{
                alignItems: 'flex-start',
                width: windowWidth - 8,
                justifyContent: 'flex-start',
                marginTop: 8,
                marginBottom: 6,
              }}>
              <Text
                style={{
                  color:
                    isDarkMode === true ? Colors.lighter : 'rgba(0,0,0,0.6)',
                  padding: 4,
                }}>
                Country or region
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: 40,
                  borderColor:
                    isdarkMode === true ? colors.dark_borderColor : 'grey',
                  borderRadius: 8,
                  borderWidth: 1,
                  alignItems: 'center',
                }}>
                <CountryPicker
                  containerButtonStyle={{
                    width: windowWidth - 50,
                    marginLeft: 10,
                  }}
                  placeholder={country?.countryName}
                  visible={isvisible}
                  withCloseButton={true}
                  theme={isdarkMode === true ? DARK_THEME : null}
                  withFilter={true}
                  onClose={() => setisvisible(false)}
                  onSelect={value => {
                    // console.log({value});
                    setCountry({
                      cca2: value?.cca2,
                      callingCode: value?.callingCode[0],
                      countryName: value?.name,
                    });
                    setisvisible(false);
                    handleChange('country')(value?.name);
                  }}
                />
                <MaterialCommunityIcons
                  onPress={() => {
                    isvisible === true
                      ? setisvisible(false)
                      : setisvisible(true);
                  }}
                  name={isvisible ? 'menu-up' : 'menu-down'}
                  size={23}
                  style={{width: 50}}
                />
              </View>
              {touched.country && errors.country && (
                <Text style={{color: 'red'}}>{errors.country}</Text>
              )}
            </View>
            <TouchableOpacity
              disabled={card.complete != true ? true : false}
              onPress={() => {
                // handlePayment();
                handleSubmit();
              }}
              style={[
                styles.payNowButton,
                {
                  backgroundColor:
                    card.complete != true ? 'rgba(0,0,0,0.2)' : 'grey',
                },
              ]}>
              <Text
                style={{
                  color:
                    card.complete != true && isDarkMode !== true
                      ? 'rgba(255,255,255,0.7)'
                      : card.complete != true
                      ? 'rgba(255,255,255,0.2)'
                      : '#fff',
                  textAlign: 'center',
                  fontSize: 17,
                }}>
                Pay with this card
              </Text>
              <Ionicons name="lock-closed" 
              size={18}
              color=
                    {card.complete != true && isDarkMode !== true
                      ? 'rgba(255,255,255,0.7)'
                      : card.complete != true
                      ? 'rgba(255,255,255,0.2)'
                      : '#fff' }/>
            </TouchableOpacity>
          </>
        )}
      </Formik>

      <View
        style={{
          width: windowWidth - 50,
          backgroundColor: colors.dark_borderColor,
          height: 1,
          position: 'absolute',
          bottom: 85,
        }}></View>

      <View
        style={{
          position: 'absolute',
          bottom: 80,
          width: 100,
          backgroundColor: isdarkMode === true ? Colors.darker : Colors.lighter,
          borderRadius: 8,
        }}>
        <Text
          style={[
            styles.diffpayment,
            {
              color:
                isdarkMode === true
                  ? colors.dark_textColor
                  : colors.light_textColor,
            },
          ]}>
          Or pay using
        </Text>
      </View>

      <PlatformPayButton
        style={{
          height: 50,
          width: windowWidth - 8,
          backgroundColor: 'transparent',
          position: 'absolute',
          bottom: 25,
        }}
        // type={1000}
        type={PlatformPay.ButtonType.Pay}
        onPress={async () => {
          // Check if Google Pay is available on the device
          // const {deviceSupportsGooglePay} = await googlePayCheck.deviceSupportsGooglePay();
          if (await isPlatformPaySupported({googlePay: {testEnv: true}})) {
            console.log('Supported');
          } else {
            console.log('Not Supported! ');

            // Show alternative payment options
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 0,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    fontSize: 18,
    fontWeight: '400',
  },
  cardStyle: {
    borderRadius: 8,
    borderWidth: 1,
    textErrorColor: colors.textErrorColor,
    placeholderColor: colors.placeholderColor,
  },
  image: {
    width: windowWidth - 10,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  textCard: {
    position: 'absolute',
    top: 0,
    right: 10,
  },
  validThrough: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    color: Colors.lighter,width:100
  },
  validThroughDetails: {
    position: 'absolute',
    bottom: 30,
    left: 10,
  },
  cvcStyle: {
    position: 'absolute',
    bottom: 50,
    right: 10,
    color: Colors.lighter,
  },
  cvcDetails: {
    position: 'absolute',
    bottom: 30,
    right: 10,
  },
  hiddenIcon: {
    position: 'absolute',
    bottom: 40,
    color: Colors.lighter,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardField: {
    width: windowWidth - 8,
    height: 50,
    // marginHorizontal: 20,
    // marginVertical: 20,
    // backgroundColor:'red',
    // color:'red',
  },
  payNowButton: {
    padding: 10,
    width: windowWidth / 2+20,
    borderRadius: 8,
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    // position: 'absolute',
    // bottom: 120,
  },
  diffpayment: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
