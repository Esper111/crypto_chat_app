import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './screens/login';
import Register from './screens/register'
import Chat from './screens/Chat'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/home'
import firebase from 'firebase/app';
import 'firebase/auth';
// import login from './screens/login';
// import register from './screens/register';

const Stack= createNativeStackNavigator()
export default function App() {
  return (
<NavigationContainer>
  <Stack.Navigator>
  <Stack.Screen
  name='Login'
  component={Login}
  />
    <Stack.Screen
  name='Register'
  component={Register}
  />
  <Stack.Screen
  name='Home'
  component={Home}
  options={{
    headerBackVisible:false,
    title:'Active users',
    headerTitleAlign:'center',
    headerTitleStyle:{fontWeight:'900'}
    }}
  />
  <Stack.Screen
  name='Chat'
  component={Chat}
  options={({route})=>({
    headerBackVisible:false,
    title:route.params.name,
    headerTitleStyle:{fontWeight:'bold'},
    headerTitleAlign:'center'
  })
}
  />
  </Stack.Navigator>
</NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
