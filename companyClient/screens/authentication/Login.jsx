import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Platform,
    TextInput,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { Button, OutlineButton } from '../../components/widgets/Button';
import { loginAuth } from '../../API';
import Loading from '../../components/widgets/Loading';


// Login Component..
const Login = ({ navigation }) => {
    const [data, setData] = useState({
        email: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
        errorMsg: ''
    });
    const [isLoading, setLoading] = useState(false);

    // useEffect(() => {
    //     console.log('I am useEffect');
    //     checkHealth();
    // }, []);

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
            setData({
                ...data,
                check_textInputChange: false,
                isValidUser: false,
                errorMsg: 'This is not valid Email Address!'
            });
        }
    };


    const textInputChange = (value, type) => {
        // email text on change..
        if (type === 'EMAIL') {
            if (value.length === 0) {
                setData({
                    ...data,
                    email: value,
                    check_textInputChange: false,
                    isValidUser: true,
                    errorMsg: ''
                });
            } else {
                setData({
                    ...data,
                    email: value,
                    check_textInputChange: true,
                    isValidUser: true,
                    errorMsg: ''
                });
            }
        }

        // Password on change text..
        if (type === 'PASSWORD') {
            if (value.length === 0) {
                setData({
                    ...data,
                    password: value,
                    isValidPassword: true,
                    errorMsg: ''
                });
            } else {
                if (value.length < 7) {
                    setData({
                        ...data,
                        password: value,
                        isValidPassword: false,
                        errorMsg: 'Password Should be at least 8 characters!'
                    });
                } else {
                    setData({
                        ...data,
                        password: value,
                        isValidPassword: true,
                        errorMsg: ''
                    });
                }
            }
        }
    };

    /**
     * ----- Login Press -----
     * Working with Auth Login API
     */
    const handleLoginClick = () => {
        const { email, password, isValidUser, isValidPassword } = data;

        if (email !== '' && password !== '') {
            if (isValidUser && isValidPassword) {
                setLoading(true);
                loginAuth({ email, password })
                    .then(response => {
                        if (!response) {
                            setLoading(false);
                            Alert.alert("Can't Login");

                        } else {
                            setLoading(false);
                            if (!response.isAuth) {
                                Alert.alert("User Not Found!");
                            } else {
                                navigation.navigate("MainTabs");
                            }
                        }
                    })
                    .catch(error => {
                        setLoading(false);
                        Alert.alert(error.message);
                    });

            } else {
                Alert.alert("Please Make Sure Your Information is Correct.");
            }
        } else {
            Alert.alert("Fields Are Empty!");
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

            <Loading
                visible={isLoading}
                text={"Logging in..."}
                textStyle={{ color: "white" }}
            />

            {/* ---- Header ---- */}
            <View style={styles.header}>
            </View>

            {/* ---- Footer ---- */}
            <Animatable.View
                style={styles.footer}
                animation="fadeInUpBig"
            >
                <Text style={[styles.text_header, { marginBottom: 20, textAlign: 'center' }]}>Sign In</Text>

                {/* ---- email Number ---- */}
                <Text style={styles.text_footer}>Email</Text>
                <View style={styles.action}>
                    <FontAwesome name="user-o" size={20} color="#05375a" />
                    <TextInput
                        placeholder="bdtask@gmail.com"
                        style={styles.textInput}
                        autoCapitalize="none"
                        value={data.email}
                        onChangeText={(value) => textInputChange(value, "EMAIL")}
                        onEndEditing={(event) => handleValidEmail(event)}
                    />

                    <Animatable.View animation="bounceIn">
                        {data.check_textInputChange && <Feather name="check-circle" size={20} color="green" />}
                    </Animatable.View>
                </View>
                {/* ------ Showing the User Error Message ---- */}
                {!data.isValidUser && displayErrorMessage(data.errorMsg)}

                {/* ---- Password ---- */}
                <Text style={[styles.text_footer, { marginTop: 30 }]}>Password</Text>
                <View style={styles.action}>
                    <Feather name="lock" size={20} color="#05375a" />
                    <TextInput
                        placeholder="########"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(value) => textInputChange(value, "PASSWORD")}
                    />

                    <TouchableOpacity onPress={updateSecureTextEntry}>
                        {data.secureTextEntry ? <Feather name="eye-off" size={20} color="grey" /> : <Feather name="eye" size={20} color="grey" />}
                    </TouchableOpacity>
                </View>
                {/* ----- Showing Password Error Message -----  */}
                {!data.isValidPassword && displayErrorMessage(data.errorMsg)}

                <View style={{ marginTop: 30 }}>
                    <Button
                        title="Login"
                        color1st="yellow"
                        color2nd="orange"
                        size={18}
                        textColor="black"
                        width="100%"
                        height={50}
                        onPress={handleLoginClick}
                    />

                    <View style={{ marginTop: 20 }}>
                        <OutlineButton
                            title="Sign Up"
                            color="orange"
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black'
    },
    footer: {
        flex: 2,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: '#fff',
        // borderTopLeftRadius: 30,
        // borderTopRightRadius: 30,
        borderRadius: 30,
        paddingVertical: 30,
        paddingHorizontal: 20
    },
    text_header: {
        color: '#05375a',
        fontWeight: 'bold',
        fontSize: 30
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

export default Login;