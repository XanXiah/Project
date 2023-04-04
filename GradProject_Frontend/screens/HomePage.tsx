import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Home from './Home';
import Movie from './Movie';
import Ranking from './Ranking';
import Setting from './Setting';

const Tab = createMaterialBottomTabNavigator();

const MyTabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Movie" component={Movie} />
            <Tab.Screen name="Ranking" component={Ranking} />
            <Tab.Screen name="Setting" component={Setting} />
        </Tab.Navigator>
    );
}

export default MyTabs