import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
// import Header from '../../components/Header/Header';
import { StatusBar } from 'expo-status-bar';
import { logoutCompany } from '../../API';
import Loading from '../../components/widgets/Loading';
import { companyAuth, updateCompany } from '../../API';
import * as Animatable from 'react-native-animatable';
import { EditInputField } from '../../components/widgets/InputField';
import { OutlineButton } from '../../components/widgets/Button';

// title, color, height, width, size, onPress, children

const Profile = ({ navigation }) => {
    const [showBalance, setShowBalance] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [editMode, setEditMode] = useState(false);


    // Set profile data..
    const setProfileData = async () => {
        const response = await companyAuth();

        if (response.success) {
            setLoading(false);
            setData({ ...response?.company });
        }
    };

    // Make Profile Balance Show Off..
    useEffect(() => {
        setTimeout(() => {
            setShowBalance(false);
        }, 2000);
    }, [showBalance]);

    // Hook..
    useEffect(() => {
        // useEffect..
        setLoading(true);
        setProfileData();
    }, []);

    // console.log('PROFILE DATA == ', data);


    // Handle Profile Update Done..
    const handleUpdateProfile = async () => {
        // Send Response to Backend API to Update profile info..
        const response = await updateCompany({
            offersRate: data.offersRate,
            email: data.email,
            phone: data.phone,
            address: data.address
        });

        if (!response.success) {
            Alert.alert(response.message);
        }

        if (response.success) {
            Alert.alert("Update Done!");
        }

        setEditMode(false);
    };

    // Logout Function..
    const handleLogout = async () => {
        setLoading(true);

        try {
            const response = await logoutCompany();
            if (response.data) {
                const { isAuth } = response.data;
                if (!isAuth) {
                    setLoading(false);
                    navigation.navigate("Login");
                }
            }

        } catch (error) {
            alert(error.message);
        }
    };

    // Profile Picture Rendering..
    const renderProfilePicture = (profileURI) => (
        profileURI === "" || !profileURI ?
            (
                <Image
                    style={styles.profilePicture}
                    source={require('../../assets/images/avatar-male.png')}
                />
            )
            :
            (
                <Image
                    style={styles.profilePicture}
                    source={{ uri: profileURI }}
                />
            )
    );

    // Rendering the Edit Mode..
    const renderEditMode = (profileData) => (
        !profileData ?
            (
                <Loading visible={true} text={"Data Loading..."} />
            )
            :
            (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    {renderProfilePicture(profileData.logoURI)}

                    <View style={styles.namesTextWrapper}>
                        <Text style={styles.hiText}>We Are,</Text>
                        <Text style={styles.namesText}>{profileData.name}</Text>
                    </View>

                    {/** ----- Tap to See Balance -----
                     <TouchableOpacity
                    onPress={() => setShowBalance(true)}
                >
                    {renderBalanceAmounts(showBalance, profileData.balance)}
                </TouchableOpacity>
                **/}

                    <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
                        <View style={[styles.profileItemsBox, { flex: 1, alignItems: 'center' }]}>
                            <Text style={[styles.textCenter, { fontWeight: 'bold', color: 'gray' }]}>INTERESTS RATE</Text>
                            <EditInputField
                                placeholder={"10 %"}
                                value={`${profileData.offersRate}`}
                                onChangeText={(value) => setData({ ...data, offersRate: value })}
                            />
                        </View>

                        <View style={[styles.profileItemsBox, { marginLeft: 20, flex: 1, alignItems: 'center' }]}>
                            <Text style={[styles.textCenter, { fontWeight: 'bold', color: 'gray' }]}>EMAIL</Text>
                            <EditInputField
                                placeholder={"BD Task"}
                                value={profileData.email}
                                onChangeText={(value) => setData({ ...data, email: value })}
                            />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={[styles.profileItemsBox]}>
                            <Text style={[styles.textCenter, { fontWeight: 'bold', color: 'gray' }]}>PHONE</Text>
                            <EditInputField
                                placeholder={"+880XXXXXXXXXX"}
                                value={profileData.phone}
                                onChangeText={(value) => setData({ ...data, phone: value })}
                            />
                        </View>

                        <View style={[styles.profileItemsBox, { marginLeft: 20 }]}>
                            <Text style={[styles.textCenter, { fontWeight: 'bold', color: 'gray' }]}>ADDRESS</Text>
                            <EditInputField
                                placeholder={"Dhaka, Bangladesh"}
                                value={profileData.address}
                                onChangeText={(value) => setData({ ...data, address: value })}
                            />
                        </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <OutlineButton
                            title={"Edit Done"}
                            color={"orange"}
                            height={50}
                            width={380}
                            size={20}
                            onPress={() => handleUpdateProfile()}
                        />
                    </View>
                </View>
            )
    );

    // Profile Rendering..
    const renderProfile = (profileData) => (
        !profileData ?
            (
                <Loading visible={true} text={"Data Loading..."} />
            )
            :
            (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    {renderProfilePicture(profileData.logoURI)}

                    <View style={styles.namesTextWrapper}>
                        <Text style={styles.hiText}>We Are,</Text>
                        <Text style={styles.namesText}>{profileData.name}</Text>
                    </View>

                    {/** ----- Tap to See Balance -----
                         <TouchableOpacity
                        onPress={() => setShowBalance(true)}
                    >
                        {renderBalanceAmounts(showBalance, profileData.balance)}
                    </TouchableOpacity>
                    **/}

                    <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
                        <View style={[styles.profileItemsBox, { flex: 1, alignItems: 'center' }]}>
                            <Text style={[styles.textCenter, { fontWeight: 'bold', color: 'gray' }]}>INTERESTS RATE</Text>
                            <Text>{profileData.offersRate}%</Text>
                        </View>

                        <View style={[styles.profileItemsBox, { marginLeft: 20, flex: 1, alignItems: 'center' }]}>
                            <Text style={[styles.textCenter, { fontWeight: 'bold', color: 'gray' }]}>EMAIL</Text>
                            <Text>{profileData.email}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={[styles.profileItemsBox]}>
                            <Text style={[styles.textCenter, { fontWeight: 'bold', color: 'gray' }]}>PHONE</Text>
                            <Text>{profileData.phone}</Text>
                        </View>

                        <View style={[styles.profileItemsBox, { marginLeft: 20 }]}>
                            <Text style={[styles.textCenter, { fontWeight: 'bold', color: 'gray' }]}>ADDRESS</Text>
                            <Text>{profileData.address}</Text>
                        </View>
                    </View>
                </View>
            )
    );

    // Balance Rendering..
    // const renderBalanceAmounts = (show, amount) => (
    //     !show ?
    //         (
    //             <View style={styles.checkBalance}>
    //                 <Text style={styles.checkBalanceText}>Tab To Check Balance</Text>
    //             </View>
    //         )
    //         :
    //         (
    //             <View style={[styles.checkBalance, styles.checkBalanceWithAmount]}>
    //                 <Text style={[styles.checkBalanceText, styles.checkBalanceTextWithBalance]}>{amount} TK</Text>
    //             </View>
    //         )
    // );

    return (
        <ImageBackground
            style={styles.container}
            source={data.profilePictureURI ? { uri: data.profilePictureURI } : require('../../assets/images/post2.jpg')}
        >

            <Loading
                visible={isLoading}
                text={"Loading..."}
                textStyle={{ color: 'white' }}
            />

            {/* <Header>My Profile</Header> */}
            <StatusBar style="auto" />


            <View style={{ flex: 1, flexDirection: 'row' }}>
                {/*------ Logout Button -------*/}
                <View style={{ marginTop: 30, marginLeft: 300, marginRight: 10 }}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => handleLogout()}
                    >
                        <AntDesign name="logout" size={20} color="red" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                {/* -------- Profile Edit Button ------ */}
                <View style={{ marginTop: 30, marginleft: 300, marginRight: 50 }}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => {
                            // navigation.navigate("EditProfile", data)
                            setEditMode(!editMode ? true : false);
                        }}
                    >
                        <Feather name="edit" size={20} color="black" />
                        <Text style={styles.logoutText}>
                            {!editMode ? 'Edit' : 'Cancel'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* <View style={styles.profileBody}>
                {renderProfile(data)}
            </View> */}

            <Animatable.View
                style={styles.animatableViewContainer}
                animation="fadeInUpBig"
            >
                <View style={styles.profileBody}>
                    {!editMode ? renderProfile(data) : renderEditMode(data)}
                </View>
            </Animatable.View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    profileBody: {
        flexDirection: 'column',
    },
    animatableViewContainer: {
        flex: 6,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 30,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
    },
    profilePicture: {
        borderRadius: 100,
        // marginTop: 10,
        width: 150,
        height: 150
    },
    namesTextWrapper: {
        marginTop: 10
    },
    hiText: {
        fontSize: 30,
        color: 'gray',
        fontWeight: 'bold'
    },
    namesText: {
        fontSize: 20,
        marginLeft: 50,
        color: 'gray',
    },
    checkBalance: {
        marginTop: 20,
        backgroundColor: 'brown',
        padding: 5,
        borderRadius: 20
    },
    checkBalanceText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    checkBalanceWithAmount: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'brown',
    },
    checkBalanceTextWithBalance: {
        color: 'brown'
    },
    logoutButton: {
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: 'lightgray',
        width: 60,
        padding: 5,
        borderRadius: 8,
        // borderWidth: 1,   
    },
    logoutText: {
        color: 'black',
        fontSize: 10,
        // fontWeight: 'bold'
    },
    textCenter: {
        textAlign: 'center',
    },
    profileItemsBox: {
        // backgroundColor: 'lightgray',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'lightgray',
        width: 180,
        alignItems: 'center'
    }
});


export default Profile;