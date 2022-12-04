import { View, Text, TextInput, StyleSheet } from 'react-native';


// Exported Module..
export const EditInputField = ({ placeholder, value, keyboardType, onChangeText }) => {
    return (
        <View>
            <TextInput
                style={styles.editInput}
                placeholder={placeholder}
                value={value}
                keyboardType={keyboardType}
                onChangeText={onChangeText}
                autoCapitalize={true}
            />
        </View>
    );
};


// Common Input Field Default Module..
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

// StyleSheet..
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
        borderRadius: 10
    },
    editInput: {
        fontSize: 15,
        padding: 5,
        backgroundColor: 'lightgray',
        margin: 5,
        textAlign: 'center',
        borderRadius: 5
    },
});

export default InputField;