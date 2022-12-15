import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons, AntDesign } from '@expo/vector-icons';
// import { MaterialIcons } from '@expo/vector-icons';

import HomeScreen from './home/LoanRequests';
import DispatchActionScreen from './dispatchAction/DispatchAction';
import ProfileScreen from './Profile/Profile';

// Tab Navigation..
const Tab = createMaterialBottomTabNavigator();

// Main Tabs Navigation here..
const MainTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName="HomeScreen"
            activeColor="black"
            inactiveColor="gray"
            barStyle={{ backgroundColor: '#efefef' }}
        >
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Loan',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="ios-home" size={24} color={color} />
                    )
                }}
            />

            <Tab.Screen
                name="MyRequests"
                component={DispatchActionScreen}
                options={{
                    tabBarLabel: 'Dispatchs',
                    tabBarIcon: ({ color }) => (
                        <AntDesign name="swap" size={24} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <AntDesign name="profile" size={24} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTabs;