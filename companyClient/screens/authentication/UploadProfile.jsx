import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Platform,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Button } from '../../components/widgets/Button';
import ImagePicker from '../../components/widgets/ImagePicker';
import BottomSheet from '../../components/widgets/BottomSheet';
import * as ExpoImagePicker from 'expo-image-picker';
import { registerAuth } from '../../API';
import Loading from '../../components/widgets/Loading';


// Cloudinary Name..
const CLOUDINARY_NAME = "dxshdnmvl";
// Cloudinary URL...
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/upload`;

// Component..
const UploadProfile = ({ navigation, route }) => {
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const bottomSheetRef = useRef(null);

    const [data, setData] = React.useState({
        ...route.params,
        logo: '',
        logoURI: '',
        check_textInputChange: false,
        secureTextEntry: true
    });
    const [isLoading, setLoading] = useState(false);

    console.log(data);

    // Check the Media Permission..
    const mediaLibraryPermission = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission Denied!');
            }
        }
    };

    useEffect(() => {
        mediaLibraryPermission();
    }, []);

    // Image Upload to CLoud..
    const uploadToCloudinary = (dataResult) => {
        const base64 = `data:image/jpg;base64,${dataResult.base64}`;
        const fileData = {
            file: base64,
            "upload_preset": "loan_app_uploads"
        };

        setLoading(true);
        setIsBottomSheetOpen(false);

        // POST Image to CLoud..
        fetch(CLOUDINARY_URL, {
            body: JSON.stringify(fileData),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
        })
            .then(async R => {
                let cloudData = await R.json();

                setData({
                    ...data,
                    logo: dataResult.fileName,
                    logoURI: cloudData.url,
                });

                setLoading(false);
            })
            .catch(error => {
                Alert.alert(error.message);
            });
    };

    // Handle To Camera Image Pick..
    const handleOpenCamera = async () => {
        // Close Bottom Sheet..
        handleBottomSheetClose();

        const result = await ExpoImagePicker.launchCameraAsync({
            mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5
        });

        if (!result.cancelled) {
            let newFile = {
                uri: result.uri,
                type: `test/${data.uri.split(".")[1]}`,
                name: `test.${data.uri.split(".")[1]}`
            };
        }
    };

    // Handle To Gallery Image Pick..
    const handleOpenGallery = async () => {
        // Close Bottom Sheet..
        handleBottomSheetClose();

        const result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        if (!result.cancelled) {
            // Make call to upload to cloudinary..
            uploadToCloudinary(result);
        }
    };

    // Alternative Way to Open Bottom Sheet..
    const handleBottomSheetOpen = () => {
        bottomSheetRef.current?.expand();
        setIsBottomSheetOpen(true);
    };

    const handleBottomSheetClose = () => {
        bottomSheetRef.current?.close();
        setIsBottomSheetOpen(false);
    };

    /**
     * ---- Handle Continue ----
     * With Registration API
     */
    const handleContinue = () => {

        console.log(' -- ', data);

        if (!data) {
            Alert.alert("Can't Continue");
        } else {
            // Data is Fine So,
            setLoading(true);

            registerAuth({
                name: data.name,
                logo: data.logo,
                logoURI: data.logoURI,
                email: data.email,
                phone: data.phone,
                password: data.password,
                address: data.address,
                offersRate: data.offersRate
            })
                .then(response => {
                    if (!response) {
                        Alert.alert("Sorry, Can't Created Account!");
                        setLoading(false);
                    } else {
                        Alert.alert("Successfully Created");
                        setLoading(false);
                        // Just Redirected To Main Home Tab Navigations Screen..
                        navigation.navigate("Login");
                    }
                })
        }
    };


    return (
        <ImageBackground
            style={styles.container}
            source={require('../../assets/images/post1.jpg')}
        >
            <StatusBar style="light" />

            {/* ---- Loading --- */}
            <Loading
                visible={isLoading}
                text={"Creating Your Profile..."}
                textStyle={{color: 'white'}}
            />

            {/* ---- Header ---- */}
            <View style={styles.header}>
            </View>

            {/* ---- Footer ---- */}
            <Animatable.View
                style={[styles.footer, { opacity: !isBottomSheetOpen ? 1 : 0.25 }]}
                animation="fadeInUpBig"
            >
                <View style={{ alignItems: 'center' }}>
                    <ImagePicker
                        image={data.logoURI ? { uri: data.logoURI } : require('../../assets/images/avatar-male.png')}
                        height={200}
                        width={200}
                        onPress={() => handleBottomSheetOpen()}
                    />
                </View>


                {/* ---- Make Continue After Upload Image ---- */}
                <View style={{ marginTop: 30 }}>
                    <Button
                        title="Continue"
                        color1st="lightgreen"
                        color2nd="green"
                        size={18}
                        textColor="white"
                        width="100%"
                        height={50}
                        onPress={() => handleContinue()}
                    />
                </View>

                {/* ---- Back Button ---- */}
                <View style={{ marginTop: 30 }}>
                    <Button
                        title="Go Back"
                        color1st="orange"
                        color2nd="brown"
                        size={18}
                        textColor="white"
                        width="100%"
                        height={50}
                        onPress={() => navigation.navigate("Register3")}
                    />
                </View>
            </Animatable.View>

            {/* ---- Header ---- */}
            <View style={styles.header}>
            </View>

            {/* ---- The Bottom Sheet here ---- */}
            <BottomSheet
                bottomSheetRef={bottomSheetRef}
                setIsOpen={setIsBottomSheetOpen}
                snapPoint="40%"
            // handleSnapPress={handleSnapPress}
            >
                <View style={{ padding: 20 }}>
                    <Text style={styles.title}>Upload Profile</Text>

                    {/* <View style={{ marginTop: 20 }}>
                        <Button
                            title="Take Photo"
                            color1st="yellow"
                            color2nd="orange"
                            size={20}
                            height={50}
                            width="100%"
                            textColor="black"
                            onPress={() => handleOpenCamera()}
                        />
                    </View> */}

                    <View style={{ marginTop: 20 }}>
                        <Button
                            title="Upload Profile"
                            color1st="royalblue"
                            color2nd="blue"
                            size={20}
                            height={50}
                            width="100%"
                            textColor="white"
                            onPress={() => handleOpenGallery()}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Button
                            title="Cancel"
                            color1st="brown"
                            color2nd="red"
                            size={20}
                            height={50}
                            width="100%"
                            textColor="white"
                            onPress={() => handleBottomSheetClose()}
                        />
                    </View>
                </View>
            </BottomSheet>
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
    title: {
        fontSize: 30,
        color: '#05375a',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    text_header: {
        color: '#fff',
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
    }
});

export default UploadProfile;