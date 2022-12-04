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
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Button, OutlineButton } from '../../components/widgets/Button';


const Register2 = ({ navigation, route }) => {
    const [data, setData] = React.useState({
        ...route.params,
        address: '',
        password: '',
        retypePassword: '',
        check_textInputChange: false,
        secureTextEntry: true
    });
    const [error, setError] = React.useState({
        passwordErrorMsg: '',
        rePasswordErrorMsg: '',
        isValidPassword: true,
        isValidRePassword: true
    });

    // Showing Error Message..
    const displayErrorMessage = (msg) => (
        <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>{msg}</Text>
        </Animatable.View>
    );

    const textInputChange = (value, type) => {
        // Email text on change..
        if (type === 'ADDRESS') {
            if (value.length !== 0) {
                setData({
                    ...data,
                    address: value,
                });
            } else {
                setData({
                    ...data,
                    address: value,
                });
            }
        }
        // Password on change text..
        if (type === 'PASSWORD') {
            if (value.length < 7) {
                setError({
                    ...error,
                    isValidPassword: false,
                    passwordErrorMsg: 'Password should be at least 8 characters',
                });
            } else {
                setError({
                    ...error,
                    isValidPassword: true,
                });
            }
            setData({
                ...data,
                password: value
            });
        }

        // ReType Password on change text..
        if (type === 'RETYPE-PASSWORD') {
            if (value !== data.password) {
                setError({
                    ...error,
                    isValidRePassword: false,
                    rePasswordErrorMsg: 'Password is not matched!'
                });
            } else {
                setError({
                    ...error,
                    isValidRePassword: true,
                });
                setData({
                    ...data,
                    retypePassword: value
                });
            }
        }
    };

    // Handle On Next Button Press...
    const handleOnNextPress = () => {
        console.log(data)
        if (data.address !== '' && data.password !== '' && data.retypePassword !== '') {
            if (error.isValidPassword && error.isValidRePassword) {
                navigation.navigate("Register3", data);
            }
        } else {
            alert("Please provide all data!");
        }
    };

    // Secure Text Entry Updating Function..
    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    };

    return (
        <ImageBackground
            style={styles.container}
            source={require('../../assets/images/post1.jpg')}
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
                {/* ---- Address ---- */}
                <Text style={styles.text_footer}>Address</Text>
                <View style={styles.action}>
                    <FontAwesome5 name="address-card" size={20} color="#05375a" />
                    <TextInput
                        placeholder="Mannan Plaza, Khilkhet, Dhaka"
                        style={styles.textInput}
                        onChangeText={(value) => textInputChange(value, "ADDRESS")}
                        autoCorrect={false}
                        autoCapitalize={true}
                    />
                </View>

                {/* ---- Password ---- */}
                <Text style={[styles.text_footer, { marginTop: 20 }]}>Password</Text>
                <View style={styles.action}>
                    <Feather name="lock" size={20} color="#05375a" />
                    <TextInput
                        placeholder="abcABC123!@#$"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(value) => textInputChange(value, "PASSWORD")}
                        autoCorrect={false}
                    />

                    <TouchableOpacity onPress={updateSecureTextEntry}>
                        {data.secureTextEntry ? <Feather name="eye-off" size={20} color="grey" /> : <Feather name="eye" size={20} color="grey" />}
                    </TouchableOpacity>
                </View>
                {!error.isValidPassword && displayErrorMessage(error.passwordErrorMsg)}

                {/* ---- Retype Password ---- */}
                <Text style={[styles.text_footer, { marginTop: 20 }]}>Retype Password</Text>
                <View style={styles.action}>
                    <Feather name="lock" size={20} color="#05375a" />
                    <TextInput
                        placeholder="abcABC123!@#$"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(value) => textInputChange(value, "RETYPE-PASSWORD")}
                        autoCorrect={false}
                    />

                    <TouchableOpacity onPress={updateSecureTextEntry}>
                        {data.secureTextEntry ? <Feather name="eye-off" size={20} color="grey" /> : <Feather name="eye" size={20} color="grey" />}
                    </TouchableOpacity>
                </View>
                {!error.isValidRePassword && displayErrorMessage(error.rePasswordErrorMsg)}

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
                        onPress={() => handleOnNextPress()}
                    />

                    <View style={{ marginTop: 20 }}>
                        <OutlineButton
                            title="Back"
                            color="red"
                            size={18}
                            width="100%"
                            height={50}
                            onPress={() => navigation.navigate("Register")}
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
        flex: 3,
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

export default Register2;