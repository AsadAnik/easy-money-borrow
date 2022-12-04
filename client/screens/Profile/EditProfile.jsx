import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import InputField from '../../components/widgets/InputField';
import { OutlineButton } from '../../components/widgets/Button';
import { updateProfile, authChecker } from '../../API';

// title, color, height, width, size, onPress, children

// Edit Profile..
const EditProfile = ({ route, navigation }) => {
    // State Hook..
    const [data, setData] = useState({
        firstname: route?.params?.firstname,
        lastname: route?.params?.lastname,
        title: route?.params?.title,
        email: route?.params?.email,
    });

    // Update Handler..
    const handleUpdate = async () => {
        const response = await updateProfile(data);
        
        if (!response.success) {
            Alert.alert(response.message);
        }

        if (response.success) {
            await authChecker();
            Alert.alert("Updated Successfully!");
            navigation.navigate("MainTabs");
        }
    };

    // Returning statement..
    return (
        <View style={styles.container}>
            <InputField
                label={"First Name"}
                placeholder={"Update First Name"}
                value={data.firstname}
                onChangeText={(value) => setData({ ...data, firstname: value })}
            />

            <InputField
                label={"Last Name"}
                placeholder={"Update Last Name"}
                value={data.lastname}
                onChangeText={(value) => setData({ ...data, lastname: value })}
            />

            <InputField
                label={"Title"}
                placeholder={"Update Title"}
                value={data.title}
                onChangeText={(value) => setData({ ...data, title: value })}
            />

            <InputField
                label={"Email"}
                placeholder={"Update Email"}
                value={data.email}
                onChangeText={(value) => setData({ ...data, email: value })}
            />

            <View style={{margin: 10, marginTop: 20}}>
                <OutlineButton
                    title={"Update Done"}
                    color={"orange"}
                    height={50}
                    width={"100%"}
                    size={20}
                    onPress={() => handleUpdate()}
                />
            </View>


        </View>
    );
};

// Styles..
const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10
    },
});

export default EditProfile;