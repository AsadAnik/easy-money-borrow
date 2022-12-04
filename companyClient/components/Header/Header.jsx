import { View, Text, StyleSheet } from 'react-native';

const Header = ({ children }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>{children}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    header: {
        backgroundColor: '#efefef',
        paddingTop: 50,
        paddingBottom: 10,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#dedede'
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
    },
});

export default Header;