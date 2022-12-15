import { View, TouchableOpacity } from 'react-native';
import Header from '../../components/Header/Header';
import LoanRequestCard from '../../components/LoanLogCard/LoanLogCard';

const DispatchAction = () => {

    return (
        <View>
            <Header>Dispatch Actions</Header>

            <TouchableOpacity>
                <LoanRequestCard
                    type={"PENDING"}
                    status={"NULL"}
                    amount={1200}
                    staticAmounts={"1200"}
                    duration={5}
                    staticDuration={5}
                    company={"loan.companyId"}
                    userId={"loan.userId"}
                    startedDate={"getFormatedDate(new Date(loan?.createdAt))"}
                    // onPress={() => navigation.navigate("Acceptance", loan)}
                />
            </TouchableOpacity>
        </View>
    );
};

export default DispatchAction;