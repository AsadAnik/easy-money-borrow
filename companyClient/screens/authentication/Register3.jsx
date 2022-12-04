import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Platform,
    TextInput,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FontAwesome } from '@expo/vector-icons';
import { Button, OutlineButton } from '../../components/widgets/Button';


const Register3 = ({ navigation, route }) => {
    const [data, setData] = React.useState({
        ...route.params,
        offersRate: null,
    });

    // Handle Register Method..
    const handleRegister = () => {
        if (data.offersRate === "" || data.offersRate === null) {
            Alert.alert("If you don't provide the interests rate, so it will be 10% by default!");
            navigation.navigate("UploadProfile", data);
        } else {
            navigation.navigate("UploadProfile", data);
        }
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
                {/* ---- Interests Rate ---- */}
                <Text style={[styles.text_footer, { marginTop: 20 }]}>Interests Rate</Text>
                <View style={styles.action}>
                    <FontAwesome name="percent" size={20} color="#05375a" />
                    <TextInput
                        placeholder="5"
                        keyboardType={"numeric"}
                        style={styles.textInput}
                        onChangeText={(value) => setData({ ...data, offersRate: value })}
                    />

                </View>

                {/* ---- Buttons ---- */}
                <View style={{ marginTop: 30 }}>
                    <Button
                        title="Register"
                        color1st="lightgreen"
                        color2nd="green"
                        size={18}
                        textColor="white"
                        width="100%"
                        height={50}
                        onPress={() => handleRegister()}
                    />

                    <View style={{ marginTop: 20 }}>
                        <OutlineButton
                            title="Back"
                            color="red"
                            size={18}
                            width="100%"
                            height={50}
                            onPress={() => navigation.navigate("Register2")}
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
        flex: 3,
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

export default Register3;