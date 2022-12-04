import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { OutlineButton } from '../../components/widgets/Button';
import { AntDesign } from '@expo/vector-icons';

// title, color, height, width, size, onPress, children

const RequestDone = ({ navigation, route }) => {
    // Params Data from previews Screen..
    const { companyId, loanId } = route.params;

    // Returning Statement..
    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={{marginBottom: 20}}>
                <AntDesign name="checkcircle" size={80} color="green" />
            </View>

            <Text style={styles.headingText}>Successfully Requested To</Text>
            <View style={styles.subHeadingText}>
                <Text style={{textAlign: 'center'}}>Yours request is send to company. Wait for response to your loan. Then you can check your account balance.</Text>
                <Text style={{textAlign: 'center', fontWeight: 'bold', marginTop: 10}}>Company ID</Text>
                <Text style={{ fontWeight: 'bold', color: 'green', textAlign: 'center'}}>{companyId}</Text>

                <Text style={{textAlign: 'center', fontWeight: 'bold', marginTop: 10}}>Loan ID</Text>
                <Text style={{ fontWeight: 'bold', color: 'orange', textAlign: 'center'}}>{loanId}</Text>
            </View>
            <OutlineButton
                title={"My Requests"}
                color={"green"}
                height={50}
                width={200}
                size={20}
                onPress={() => navigation.navigate("MyRequests")}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headingText: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    subHeadingText: {
        maxWidth: '90%',
        fontSize: 15,
        padding: 20
    }
});

export default RequestDone;