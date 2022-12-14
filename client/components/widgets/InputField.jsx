import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';

// Device Screen Width..
const windowWidth = Dimensions.get('window').width;


const InputField = ({ label, placeholder, value, keyboardType, onChangeText }) => {
    return (
        <View>
            <Text style={styles.text}>{label}</Text>

            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                keyboardType={keyboardType}
                onChangeText={onChangeText}
                autoCapitalize={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        paddingLeft: 10,
        paddingTop: 10,
        textTransform: "capitalize"
    },
    input: {
        fontSize: 20,
        padding: 10,
        backgroundColor: 'lightgray',
        margin: 10,
        textAlign: 'center',
        borderRadius: 10,
        width: windowWidth - 30 * 2,
    }
});

export default InputField;