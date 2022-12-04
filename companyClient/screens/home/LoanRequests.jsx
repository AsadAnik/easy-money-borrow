import { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../../components/Header/Header';
import LoanRequestCard from '../../components/LoanLogCard/LoanLogCard';
import { getCompanyLoanRequests, loanStatus } from '../../API';
import { getFormatedDate } from '../../services/dateFormatService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Loan Requests..
const LoanRequests = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [isData, setIsData] = useState(false);

    // Fetching the company loans requests..
    const fetchCompanyLoanRequests = async () => {
        const response = await getCompanyLoanRequests();
        if (!response.success) {
            setIsData(false);
        }

        if (response.success) {
            setIsData(true);
            setData(response.loans);
        }
    };

    // React Hook..
    useEffect(() => {
        fetchCompanyLoanRequests();
    }, []);

    // Firstly Checks the loan status here..
    // Checking the loan status..
    const checkLoanStatus = async () => {
        const response = await loanStatus();
        return response;
    };

    useEffect(() => {
        checkLoanStatus();
    }, []);

    // When Pull Down Refreshed the page..
    const pullMe = () => {
        setRefresh(true);

        if (data.length) {
            fetchCompanyLoanRequests();
            checkLoanStatus();
        }

        setTimeout(() => {
            setRefresh(false);
        }, 1000);
    };

    // console.log('Data -- ', data);

    // Render request list..
    const renderRequestList = () => {
        if (!isData) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 150 }}>
                    <MaterialCommunityIcons name="flask-empty-off-outline" size={80} color="lightgray" />
                    <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'lightgray' }}>No Requests</Text>
                </View>
            );
        }

        if (isData) {
            return (
                data.length ?
                    data.map(loan => (
                        <View key={loan._id}>
                            <LoanRequestCard
                                type={loan.request}
                                status={loan.status}
                                amount={loan.amounts}
                                staticAmounts={loan.staticAmounts}
                                duration={loan.payDuration}
                                staticDuration={loan.staticPayDuration}
                                company={loan.companyId}
                                userId={loan.userId}
                                startedDate={getFormatedDate(new Date(loan?.createdAt))}
                                onPress={() => navigation.navigate("Acceptance", loan)}
                            />
                        </View>
                    )
                    )
                    :
                    (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'lightgray' }}>Loading...</Text>
                        </View>
                    )
            );
        }
    };

    // Returning Statement..
    return (
        <View style={{ flex: 1 }}>
            <StatusBar style="light" />

            <Header>
                <Text>Loan Requests</Text>
            </Header>

            <ScrollView
                style={{ padding: 5 }}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={() => pullMe()} />
                }
            >
                {renderRequestList()}
            </ScrollView>
        </View>
    );
};

export default LoanRequests;