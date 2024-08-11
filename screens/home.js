import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react';
import { collection,onSnapshot,where,query } from 'firebase/firestore'
import { authentication,db } from '../firebase/firebaseconfig';
import { FlatList } from 'react-native';
//import { ListItem, Button } from 'react-native-elements';
import { Button } from 'react-native-elements';
//import firestore from 'react-native-firebase/firestore';
import { ListItem } from '../components/ListItem';

export default function Home({navigation}) {
    const [keyCounter, setKeyCounter] = useState(0);
    const keyExtractor = (user) => {
        setKeyCounter(keyCounter + 1); // Increment counter on each call
        return `${user.username}-${keyCounter}`;
      };

    const [users,setUsers]=useState([]);

    const logoutUser=async()=>{
        authentication.signOut()
            .then(()=>{
                navigation.replace('Login')
            })
}
// const fetchUsers = async () => {
//     try {
//         const usersSnapshot = await db.collection("users").get();
//         const usersData = usersSnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//         }));
//         setUsers(usersData);
//     } catch (error) {
//         console.error("Error fetching users: ", error);
//     }
// };

// const fetchUsers = async () => {
//     try {
//       const usersSnapshot = await firestore().collection("users").get();
//       const usersData = usersSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setUsers(usersData);
//     } catch (error) {
//       console.log("Error fetching users: ", error);
//     }
//   };
    const getUsers=()=>{
        const docsRef=collection(db,'users');
        const q= query(docsRef, where('userUID','!=',authentication?.currentUser?.uid));
        const docsSnap=onSnapshot(q,(onSnap)=>{
            let data=[];
            onSnap.docs.forEach(user=>{
                data.push({...user.data()})
                setUsers(data)
                console.log(user.data())
            })
        })
    }
    useEffect(()=>{
        getUsers()
    },[])
    // useEffect(() => {
    //     const unsubscribe = getUsers();
    //     return () => unsubscribe(); // Cleanup the onSnapshot listener on unmount
    //   }, []);
  return (
    <>
    <FlatList
    data={users}
    // key={(user) => {
    //     setKeyCounter(keyCounter + 1);
    //     return `${user.username}-${keyCounter}`;
    //   }}
    key={user=>user.email}
    renderItem={({item})=>
    <ListItem 
    title={item.username}
    subTitle={item.email}
    onPress={()=>navigation.navigate('Chat',{name:item.username, uid:item.userUID})}
    />
}
    />
    <Button
    title='logout'
    onPress={logoutUser}
    />
    </>
  )
}

const styles = StyleSheet.create({})