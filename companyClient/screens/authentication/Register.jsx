import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Platform,
    TextInput
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Button, OutlineButton } from '../../components/widgets/Button';

const Register = ({ navigation }) => {
    const [data, setData] = React.useState({
        name: '',
        email: '',
        phone: '88',
    });
    const [error, setError] = React.useState({
        nameErrorMsg: '',
        emailErrorMsg: '',
        phoneErrorMsg: '',
        isValidName: true,
        isValidEmail: true,
        isValidPhone: true
    });

    // Displaynig Error Message Dynamically..
    const displayErrorMessage = (msg) => (
        <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>{msg}</Text>
        </Animatable.View>
    );

    // Handle Valid Email here...
    const handleValidEmail = (event) => {
        // Similar to Web like -- (event.target.value).
        const value = event.nativeEvent.text;
        const realValue = value.trim(); // Trim for not to take any space or else just the real value.
        const emailTest = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(realValue);

        if (!emailTest) {
            setError({
                ...error,
                isValidEmail: false,
                emailErrorMsg: 'Invalid Email Address!'
            });
        }else {
            setError({
                ...error,
                isValidEmail: true,
            });
        }
    };

    // End Of Editing Input Fields..
    const handleEndEditing = (event, type) => {
        const value = event.nativeEvent.text;

        if (type === 'NAME') {
            if (value.trim().length) {
                if (value.length <= 2 && value.length > 0) {
                    setError({
                        ...error,
                        nameErrorMsg: 'Name should be at least 3 characters.',
                        isValidName: false,
                    });

                } else {
                    setError({
                        ...error,
                        isValidName: true,
                    });
                }
            }
        }
    };

    // Text Change Input Fields..
    const handleOnChange = (value, type) => {
        // email text on change..
        if (type === 'EMAIL') {
            setData({
                ...data,
                email: value,
                isValidEmail: true,
                emailErrorMsg: ''
            });
        }

        if (type === 'PHONE') {
            if (value.length < 12) {
                setData({
                    ...data,
                    phone: value
                });
                setError({
                    ...error,
                    phoneErrorMsg: 'Phone Number Should be 11 Digits Also With Country Code',
                    isValidPhone: false
                });
            } else {
                setData({
                    ...data,
                    phone: value
                });
                setError({
                    ...error,
                    isValidPhone: true
                });
            }
        }
    };

    // Next Activity Handler Function ..
    const handleOnNextPress = () => {
        if (data.name && data.email && data.phone) {
            if (error.isValidEmail && error.isValidPhone) {
                navigation.navigate("Register2", data);
            }
        }
    };

    return (
        <ImageBackground
            style={styles.container}
            source={require('../../assets/images/post3.jpg')}
        >
            <StatusBar style="light" />

            {/* ---- Header ---- */}
            <View style={styles.header}>
            </View>

            {/* ---- Footer ---- */}
            <Animatable.View
                style={styles.footer}
                animation="fadeInUpBig"
            >
                {/* ---- Company Name ---- */}
                <Text style={styles.text_footer}>Company Name</Text>
                <View style={styles.action}>
                    <Octicons name="organization" size={20} color="#05375a" />
                    <TextInput
                        placeholder="BD Task"
                        style={styles.textInput}
                        onChangeText={(value) => setData({ ...data, name: value })}
                        onEndEditing={(event) => handleEndEditing(event, "NAME")}
                        autoCorrect={false}
                    />
                </View>
                {/* ------ Showing the User Error Message ---- */}
                {!error.isValidName && displayErrorMessage(error.nameErrorMsg)}

                {/* ---- Email ---- */}
                <Text style={[styles.text_footer, { marginTop: 20 }]}>Company Email</Text>
                <View style={styles.action}>
                    <Fontisto name="email" size={20} color="#05375a" />
                    <TextInput
                        placeholder="bdtask@gmail.com"
                        style={styles.textInput}
                        onChangeText={(value) => handleOnChange(value, "EMAIL")}
                        onEndEditing={(event) => handleValidEmail(event)}
                        autoCorrect={false}
                        autoCapitalize={false}
                    />
                </View>
                {/* ------ Showing the User Error Message ---- */}
                {!error.isValidEmail && displayErrorMessage(error.emailErrorMsg)}

                {/* ---- Phone ---- */}
                <Text style={[styles.text_footer, { marginTop: 20 }]}>Company Phone</Text>
                <View style={styles.action}>
                    <AntDesign name="phone" size={20} color="#3b4043" />
                    {console.log(data.phone)}
                    <TextInput
                        placeholder="Your Phone Number"
                        style={styles.textInput}
                        autoCapitalize="none"
                        keyboardType={"numeric"}
                        value={data.phone}
                        onChangeText={(value) => handleOnChange(value, "PHONE")}
                        autoCorrect={false}
                    />
                </View>
                {/* ------ Showing the User Error Message ---- */}
                {!error.isValidPhone && displayErrorMessage(error.phoneErrorMsg)}


                {/* ---- Buttons ---- */}
                <View style={{ marginTop: 30 }}>
                    <Button
                        title="Next"
                        color1st="royalblue"
                        color2nd="blue"
                        size={18}
                        textColor="white"
                        width="100%"
                        height={50}
                        onPress={handleOnNextPress}
                    />

                    <View style={{ marginTop: 20 }}>
                        <OutlineButton
                            title="Sign In"
                            color="orange"
                            size={18}
                            width="100%"
                            height={50}
                            onPress={() => navigation.navigate("Login")}
                        />
                    </View>
                </View>
            </Animatable.View>

            {/* ---- Header ---- */}
            <View style={styles.header}>
            </View>
        </ImageBackground>
    );
};


// Styling Part..
// @override from Splash Screen..
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'royalblue',
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black'
    },
    footer: {
        flex: 4,
        backgroundColor: '#fff',
        borderRadius: 30,
        marginLeft: 15,
        marginRight: 15,
        paddingVertical: 30,
        paddingHorizontal: 20
    },
    text_header: {
        color: '#05375a',
        fontWeight: 'bold',
        fontSize: 30,
        backgroundColor: 'white',
        padding: 5,
        opacity: 0.7
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontweight: 'bold',
    },
    errorMsg: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 13,
        marginTop: 5,
    }
});

export default Register;