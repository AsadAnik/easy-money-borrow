import { useState, useEffect } from 'react';
import { View, Alert, Text, ScrollView, RefreshControl } from 'react-native';
import Header from '../../components/Header/Header';
import LoanRequestCard from '../../components/LoanLogCard/LoanLogCard';
import { getPendingDispatchs } from '../../API';
import { getFormatedDate } from '../../services/dateFormatService';
import { MaterialCommunityIcons } from '@expo/vector-icons';


// Dispatch Action Component..
const DispatchAction = () => {
    const [pendingDispatchData, setPendingDispatchData] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const fetchData = async () => {
        const response = await getPendingDispatchs();

        if (response) {
            if (!response.success) {
                Alert.alert(response.message);
            }

            if (response.success) {
                setPendingDispatchData(response.pendings);
            }
        }
    };

    // console.log('The Loan Info -- ', loanInfo);

    useEffect(() => {
        fetchData();

        // The Cleanup Function here..
        return () => {
            setPendingDispatchData([]);
        };
    }, []);

    // console.log('Pending ---- ', pendingDispatchData);

    // When Pull Down Refreshed the page..
    const pullMe = () => {
        setRefresh(true);
        fetchData();

        if (pendingDispatchData.length) {
            fetchData();
            // checkLoanStatus();
        }

        setTimeout(() => {
            setRefresh(false);
        }, 1000);
    };

    const renderPendingDispatchList = (data) => {
        if (!data) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 150 }}>
                    <MaterialCommunityIcons name="flask-empty-off-outline" size={80} color="lightgray" />
                    <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'lightgray' }}>No Data</Text>
                </View>
            );
        }

        if (data) {
            if (data.length) {
                return data.map(pendingDispatch => {
                    return (
                        <View key={pendingDispatch._id}>
                            <LoanRequestCard
                                type={"PENDING"}
                                status={pendingDispatch.status}
                                amount={pendingDispatch.amounts}
                                staticAmounts={pendingDispatch.staticAmounts}
                                duration={pendingDispatch.months}
                                staticDuration={pendingDispatch.staticMonths}
                                company={"LJO"}
                                userId={pendingDispatch.userId}
                                startedDate={getFormatedDate(new Date(pendingDispatch?.updatedAt))}
                            // onPress={() => navigation.navigate("Acceptance", loan)}
                            />
                        </View>
                    );
                });
            } else {
                return (
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 150 }}>
                        <MaterialCommunityIcons name="flask-empty-off-outline" size={80} color="lightgray" />
                        <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'lightgray' }}>Nothing To Dispatch</Text>
                    </View>
                );
            }
        }
    };

    return (
        <View>
            <Header>Dispatch Actions</Header>

            <ScrollView
                style={{ padding: 5, height: '100%' }}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={() => pullMe()} />
                }
            >
                {renderPendingDispatchList(pendingDispatchData)}
            </ScrollView>
        </View>
    );
};

export default DispatchAction;