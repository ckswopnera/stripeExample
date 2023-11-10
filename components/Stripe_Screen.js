/* eslint-disable prettier/prettier */
/*global Stripe_Screen,*/
/*eslint no-undef: "error"*/

import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  CardField,
  CardFieldInput,
  CardForm,
  useStripe,
  usePlatformPay,
  PlatformPayButton,
  PlatformPay,
  AddressSheet,
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
  KeyboardAvoidingView,
  ScrollView,
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
import 'yup-phone-lite';
import {
  handleTextInput,
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';
import FlipCard from 'react-native-flip-card';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default Stripe_Screen = () => {
  const [card, setCard] = useState(CardFieldInput.Details | null);
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
  const [allfieldValues, setallfieldValues] = useState();
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [fullName, setfullName] = useState('');
  const requiredSchema = Yup.string().required('*required');
  const min2Schema     = Yup.string().min(2, 'Seems a bit short...');
  const nameRegExp =
    /^(?:((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-.\s])){1,}(['’,\-\.]){0,1}){2,}(([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-. ]))*(([ ]+){0,1}(((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){1,})(['’\-,\.]){0,1}){2,}((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){2,})?)*)$/;
  const pincodeRegExp=/^[0-9]*$/;
    const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
  // /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const handlePayment = async () => {
    try {
      const {paymentMethod, error} = await createPaymentMethod({
        paymentMethodType: 'Card',
        // card: {
        //   cardNumber: card?.number, // Replace with the actual card details
        //   expMonth: card?.expiryMonth,
        //   expYear: card?.expiryYear,
        //   cvc: card?.cvc,
        // },
      });
      // console.log({card});
      if (error) {
        console.error('Error:', error.message);
      } else {
        const cardBrand = paymentMethod?.Card?.brand;
        console.log(
          'type',
          paymentMethod?.Card?.funding + ' ' + paymentMethod?.Card?.brand,
        );
      }
    } catch (error) {
      console.error('Error:', error);
    }
    Alert.alert('Success!');
  };
  // useEffect(() => {
  //   if (!paymentIntent) {
  //     fetch('https://your-server/create-payment-intent')
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setPaymentIntent(data.paymentIntent);
  //       });
  //   }
  // }, [paymentIntent]);
  // const handlePayment = async (elements) => {
  //   setLoading(true);

  //   const { error } = await stripe.confirmPayment({
  //     paymentIntent,
  //     billingAddress: elements.getElement('billingAddress').getAddress(),
  //     shippingAddress: elements.getElement('shippingAddress').getAddress(),
  //     savePaymentMethod: true,
  //   });

  //   if (error) {
  //     console.error(error);
  //   } else {
  //     console.log('Payment successful!');
  //   }

  //   setLoading(false);
  // };
  useEffect(() => {
    setisdarkMode(isDarkMode);
  }, [isDarkMode]);
  return (
    <View
      style={{
        alignItems: 'center',
        // height: windowHeight,
        width: windowWidth,
        flexDirection: 'column',
      }}>
      {/* {card?.complete === true && (
        <AddressSheet
          visible={true}
          onAddressCollected={address => {
            console.log(address);
          }}
          onSubmit={address => {
            console.log(address);
          }}
        />
      )} */}
      <FlipCard
        useNativeDriver={true}
        friction={60}
        perspective={3000}
        flipHorizontal={true}
        flipVertical={false}
        flip={hiddenDetails}
        clickable={false}
        // alignWidth={true}
        // style={{
        //   width: windowWidth,
        //   height: 220,

        // }}
      >
        <ImageBackground
          source={require('../assets/card_front.png')}
          resizeMode="stretch"
          style={styles.image}>
          <Text
            style={[
              styles.cardText,
              {
                color:
                  card?.validNumber !== 'Valid'
                    ? colors.textErrorColor
                    : '#fff',
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
          {focusedField === 'ExpiryDate' && (
            <View
              style={[
                styles.validThrough,
                {width: 90, height: 1, backgroundColor: '#fff'},
              ]}></View>
          )}
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
          {focusedField === 'Cvc' && (
            <View
              style={[
                styles.cvcStyle,
                {width: 25, height: 1, backgroundColor: '#fff'},
              ]}></View>
          )}
          <Text
            style={[
              styles.cvcDetails,
              {
                color:
                  card?.validCVC != 'Valid' ? colors.textErrorColor : '#fff',
              },
            ]}>
            {card?.validCVC === 'Valid' && hiddenDetails !== true
              ? card?.cvc
              : card?.validCVC === 'Incomplete' && hiddenDetails !== true
              ? '***'
              : card?.cvc}
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
        <ImageBackground
          source={require('../assets/card_front.png')}
          resizeMode="stretch"
          style={styles.image}>
          <Text
            style={[
              styles.cardText,
              {
                color:
                  card?.validNumber !== 'Valid'
                    ? colors.textErrorColor
                    : '#fff',
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
          {focusedField === 'ExpiryDate' && (
            <View
              style={[
                styles.validThrough,
                {width: 90, height: 1, backgroundColor: '#fff'},
              ]}></View>
          )}
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
          {focusedField === 'Cvc' && (
            <View
              style={[
                styles.cvcStyle,
                {width: 25, height: 1, backgroundColor: '#fff'},
              ]}></View>
          )}
          <Text
            style={[
              styles.cvcDetails,
              {
                color:
                  card?.validCVC != 'Valid' ? colors.textErrorColor : '#fff',
              },
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
      </FlipCard>
      <Formik
        initialValues={{
          name: '',
          email: '',
          // password: '',
          country: '',
          card: false,
          address: '',
          address2: '',
          city: '',
          pincode: '',
          state: '',
          phonenumber: '',
        }}
        validationSchema={Yup.object().shape({

          name: Yup.string()
            .matches(nameRegExp, '*no special character')
            .min(2, '*at least 2 characters')
            .concat(requiredSchema),
          address: Yup.string().concat(requiredSchema),
          address2: Yup.string().notRequired('*address is optional'),
          city: Yup.string().concat(requiredSchema),
          pincode: Yup.string()
          .matches(pincodeRegExp, '*no special character')
            .min(6, '*at least 6 characters')
            .max(9, '*too long')
            .concat(requiredSchema),
          state: Yup.string().concat(requiredSchema),
          email: Yup.string().email('Invalid email').concat(requiredSchema),
          phonenumber: Yup.string()
            .phone(
              country?.cca2 === undefined ? 'IN' : country?.cca2,
              country?.cca2 === undefined
                ? '*is invalid'
                : `*is invalid for ${country?.cca2}`,
            )
            .notRequired('*is optional'),
          // phonenumber: Yup.string()
          //   .matches(phoneRegExp, '*not valid')
          //   .min(10, '*too short')
          //   .max(15, '*too long')
          //   .notRequired('*phone number is optional')
          //   .typeError("*not a phone number"),
          // password: Yup.string().min(6, 'Password must be at least 6 characters'.concat(requiredSchema),
          country: Yup.string().concat(requiredSchema),
          card: Yup.boolean()
            .oneOf([true], '*Please check the card information.')
            .required('*Card information is required'),
        })}
        onSubmit={values => {
          // Handle form submission here
          console.log('Form data submitted:', values);
          handlePayment();
          setallfieldValues({
            address: values?.address,
            address2: values?.address2,
            card: values?.card,
            city: values?.city,
            countrydetails: country,
            email: values?.email,
            name: values?.name,
            phonenumber: `${country?.callingCode + values?.phonenumber}`,
            pincode: values?.pincode,
            state: values?.state,
            carddetails: card,
          });

          console.log({allfieldValues});
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
                <Text style={{color: 'red', left: 4}}>{errors.card}</Text>
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
                Billing information
              </Text>
            </View>
            <View
              style={{
                width: windowWidth - 8,
                marginVertical: 6,
                borderColor:
                  isdarkMode === true ? colors.dark_borderColor : 'grey',
                borderRadius: 8,
                borderWidth: 1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <TextInput
                  placeholder="Full Name"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  placeholderTextColor={
                    isdarkMode === true
                      ? colors.dark_placeholderTextColor
                      : colors.light_textColor
                  }
                  cursorColor={isdarkMode === true ? '#fff' : '#000'}
                  style={{
                    color:
                      isdarkMode === true
                        ? colors.dark_textColor
                        : colors.light_textColor,

                    width: '80%',
                    paddingStart: 14,
                  }}
                />
                {touched.name && errors.name && (
                  <Text
                    style={{color: 'red', textAlign: 'center', width: '20%'}}>
                    {errors.name}
                  </Text>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  borderColor:
                    isdarkMode === true ? colors.dark_borderColor : 'grey',

                  borderTopWidth: 1,
                }}>
                <TextInput
                  placeholder="Email"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  placeholderTextColor={
                    isdarkMode === true
                      ? colors.dark_placeholderTextColor
                      : colors.light_textColor
                  }
                  keyboardType="email-address"
                  cursorColor={isdarkMode === true ? '#fff' : '#000'}
                  style={{
                    color:
                      isdarkMode === true
                        ? colors.dark_textColor
                        : colors.light_textColor,

                    width: '80%',
                    paddingStart: 14,
                  }}
                />
                {touched.email && errors.email && (
                  <Text style={{color: 'red', textAlign: 'center'}}>
                    {errors.email}
                  </Text>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  borderColor:
                    isdarkMode === true ? colors.dark_borderColor : 'grey',

                  borderTopWidth: 1,
                }}>
                <TextInput
                  placeholder="Address line 1"
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  value={values.address}
                  placeholderTextColor={
                    isdarkMode === true
                      ? colors.dark_placeholderTextColor
                      : colors.light_textColor
                  }
                  cursorColor={isdarkMode === true ? '#fff' : '#000'}
                  style={{
                    color:
                      isdarkMode === true
                        ? colors.dark_textColor
                        : colors.light_textColor,
                    width: '80%',
                    paddingStart: 14,
                  }}
                />
                {touched.address && errors.address && (
                  <Text style={{color: 'red', textAlign: 'center'}}>
                    {errors.address}
                  </Text>
                )}
              </View>
              <TextInput
                placeholder="Address line 2"
                onChangeText={handleChange('address2')}
                onBlur={handleBlur('address2')}
                value={values.address2}
                placeholderTextColor={
                  isdarkMode === true
                    ? colors.dark_placeholderTextColor
                    : colors.light_textColor
                }
                cursorColor={isdarkMode === true ? '#fff' : '#000'}
                style={{
                  color:
                    isdarkMode === true
                      ? colors.dark_textColor
                      : colors.light_textColor,
                  borderColor:
                    isdarkMode === true ? colors.dark_borderColor : 'grey',

                  borderTopWidth: 1,
                  width: '100%',
                  paddingStart: 14,
                }}
              />
              {touched.address2 && errors.address2 && (
                <Text style={{color: 'red'}}>{errors.address2}</Text>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  borderTopWidth: 1,
                  borderColor:
                    isdarkMode === true ? colors.dark_borderColor : 'grey',
                }}>
                <View
                  style={{
                    borderRightWidth: 1,
                    width: '50%',
                    borderColor:
                      isdarkMode === true ? colors.dark_borderColor : 'grey',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <TextInput
                    placeholder="City"
                    onChangeText={handleChange('city')}
                    onBlur={handleBlur('city')}
                    value={values.city}
                    placeholderTextColor={
                      isdarkMode === true
                        ? colors.dark_placeholderTextColor
                        : colors.light_textColor
                    }
                    cursorColor={isdarkMode === true ? '#fff' : '#000'}
                    style={{
                      color:
                        isdarkMode === true
                          ? colors.dark_textColor
                          : colors.light_textColor,
                      paddingStart: 14,
                      width: '70%',
                    }}
                  />
                  {touched.city && errors.city && (
                    <Text style={{color: 'red', textAlign: 'center', right: 2}}>
                      {errors.city}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    width: '50%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <TextInput
                    placeholder="Pin Code"
                    onChangeText={handleChange('pincode')}
                    placeholderTextColor={
                      isdarkMode === true
                        ? colors.dark_placeholderTextColor
                        : colors.light_textColor
                    }
                    maxLength={9}
                    keyboardType="number-pad"
                    onBlur={handleBlur('pincode')}
                    value={values.pincode}
                    cursorColor={isdarkMode === true ? '#fff' : '#000'}
                    style={{
                      color:
                        isdarkMode === true
                          ? colors.dark_textColor
                          : colors.light_textColor,
                      paddingStart: 14,
                      width: '70%',
                    }}
                  />
                  {touched.pincode && errors.pincode && (
                    <Text style={{color: 'red', textAlign: 'center', right: 2,width:'30%'}}>
                      {errors.pincode}
                    </Text>
                  )}
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: 60,
                  borderColor:
                    isdarkMode === true ? colors.dark_borderColor : 'grey',
                  borderTopWidth: 1,
                  alignItems: 'center',
                  paddingVertical: 2,
                  // justifyContent:'flex-start'
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    width: '60%',
                    height: 60,
                    borderColor:
                      isdarkMode === true ? colors.dark_borderColor : 'grey',
                    borderRightWidth: 1,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        textAlign: 'left',
                        color:
                          isDarkMode === true
                            ? 'rgba(255,255,255,0.4)'
                            : 'rgba(0,0,0,0.6)',
                        paddingLeft: 10,
                        width: '70%',
                      }}>
                      Country or region
                    </Text>
                    {touched.country && errors.country && (
                      <Text style={{color: 'red'}}>{errors.country}</Text>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      alignItems: 'center',
                    }}>
                    <View style={{width: '90%'}}>
                      <CountryPicker
                        containerButtonStyle={{
                          // width: '92%',
                          paddingLeft: 10,
                        }}
                        // placeholder='Select Country
                        visible={isvisible}
                        withCloseButton={true}
                        theme={isdarkMode === true ? DARK_THEME : null}
                        countryCode={country?.cca2}
                        withCallingCode
                        withFlag
                        withCountryNameButton
                        withFilter={true}
                        withAlphaFilter={true}
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
                    </View>
                    <MaterialCommunityIcons
                      onPress={() => {
                        isvisible === true
                          ? setisvisible(false)
                          : setisvisible(true);
                      }}
                      name={isvisible ? 'menu-up' : 'menu-down'}
                      size={23}
                      style={{
                        width: '10%',
                        color: isdarkMode === true ? '#fff' : '#000',
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    width: '40%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <TextInput
                    placeholder="State"
                    onChangeText={handleChange('state')}
                    onBlur={handleBlur('state')}
                    placeholderTextColor={
                      isdarkMode === true
                        ? colors.dark_placeholderTextColor
                        : colors.light_textColor
                    }
                    value={values.state}
                    cursorColor={isdarkMode === true ? '#fff' : '#000'}
                    style={{
                      color:
                        isdarkMode === true
                          ? colors.dark_textColor
                          : colors.light_textColor,
                      paddingStart: 14,
                      width: '70%',
                    }}
                  />
                  {touched.state && errors.state && (
                    <Text style={{color: 'red', right: 12}}>
                      {errors.state}
                    </Text>
                  )}
                </View>
              </View>
              <View
                style={{
                  borderColor:
                    isdarkMode === true ? colors.dark_borderColor : 'grey',

                  borderTopWidth: 1,
                  flexDirection: 'row',
                  width: '100%',
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                {country?.callingCode?.length !== undefined && (
                  <View
                    style={{
                      borderRightWidth: 1,
                      borderColor:
                        isdarkMode === true ? colors.dark_borderColor : 'grey',
                      height: '100%',
                      width: '12%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      // paddingHorizontal: 2,
                    }}>
                    <Text
                      style={{
                        color:
                          isdarkMode === true
                            ? colors.dark_textColor
                            : colors.light_textColor,
                        textAlign: 'center',
                      }}>
                      +{country?.callingCode}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    width: '88%',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    // height: 50,
                  }}>
                  <TextInput
                    placeholder="Phone number (optional)"
                    onChangeText={handleChange('phonenumber')}
                    onBlur={handleBlur('phonenumber')}
                    value={values.phonenumber}
                    keyboardType="numeric"
                    cursorColor={isdarkMode === true ? '#fff' : '#000'}
                    maxLength={15}
                    style={{
                      width: '80%',
                      // alignItems: 'center',
                      // height: 50,
                      paddingStart: 8,
                      textAlign: 'left',
                    }}
                  />

                  {touched.phonenumber && errors.phonenumber && (
                    <Text
                      style={{
                        color: 'red',
                        textAlign: 'right',
                        width: '20%',
                        // left:4,
                        right: 4,
                      }}>
                      {errors.phonenumber}
                    </Text>
                  )}
                </View>
              </View>
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
              <Ionicons
                name="lock-closed"
                size={18}
                color={
                  card.complete != true && isDarkMode !== true
                    ? 'rgba(255,255,255,0.7)'
                    : card.complete != true
                    ? 'rgba(255,255,255,0.2)'
                    : '#fff'
                }
              />
            </TouchableOpacity>
          </>
        )}
      </Formik>

      {/* <View
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
          if (await isPlatformPaySupported({googlePay: {testEnv: true}})) {
            console.log('Supported');
          } else {
            console.log('Not Supported! ');

            // Show alternative payment options
          }
        }}
      /> */}
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
    color: Colors.lighter,
    width: 100,
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
    width: windowWidth / 2 + 20,
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
