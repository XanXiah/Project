import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Button, View, Text, Image, SafeAreaView, ScrollView, SectionList, FlatList, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { useRecoilState } from "recoil";
import { moviesListState, userUID } from "./recoilstate";
import { StyleSheet } from "react-native";
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Movie from "./Movie";
import Setting from "./Setting";
// import { NativeBaseProvider } from 'native-base';

const Home = () => {
    const [uid, setuid] = useRecoilState(userUID);
    const isFocused = useIsFocused();
    const [itemremoved , setitemremoved] = useState(false)
    useEffect(() => {
        if (isFocused || itemremoved) {
            console.log("Fetch");
            
            const fetchData = async () => {
                console.log('Fetchdata fucntion');
                
                const data = { 'uid': uid };
                axios.post('http://10.0.2.2:3000/getusermovie', data)
                    .then(response => {
                        console.log('come in this function');
                        
                        console.log(response.data);
                        setmovieinList(response.data)
                    })
                    .catch(error => {
                        console.log('An error occurred:', error);
                    });
            }
            fetchData();
            setitemremoved(false)
        };
    }, [isFocused , itemremoved]);

    const [moviesList, setmovieinList] = useRecoilState(moviesListState);
    const [view, setView] = useState("gridview");

    const handleGridViewPress = () => {
        setView("gridview");
    };

    const handleListViewPress = () => {
        setView("listview");
    };

    const removeitem = (item:any) => () => {
        const data = { 'name': item.name , 'date': item.date , 'sypnosis': item.sypnosis , 'url': item.url , 'timestamp': item.timestamp , 'uid': uid};
        axios.post('http:10.0.2.2:3000/removemovie', data)
        setitemremoved(true)
        showAlert()
    }

    const showAlert = () => {
        Alert.alert(
            "Remove"
        )
    }

    const gridViewStyle = view === 'gridview' ? { backgroundColor: '#D3D3D3' } : { backgroundColor: 'white' };
    const listViewStyle = view === 'listview' ? { backgroundColor: '#D3D3D3' } : { backgroundColor: 'white' };
    const gridViewIconStyle = view === 'gridview' ? { tintColor: 'black' } : { tintColor: '#A9A9A9' };
    const listViewIconStyle = view === 'listview' ? { tintColor: 'black' } : { tintColor: '#A9A9A9' };

    let bottomdata = moviesList.length%3 === 0 ? 3 : moviesList.length%3
    return (
        <SafeAreaView>
            <View>
                {/* <View style={styles.homebutton}> */}
                {/* new button to toggle the view */}
                {/* <Button onPress={toggleView} title={view} /> */}
                <View style={styles.listcontainer}>
                    <TouchableOpacity style={[styles.listbutton, gridViewStyle]} onPress={handleGridViewPress}>
                        <Image source={require('./assets/grid-view.png')} style={[styles.icon, gridViewIconStyle]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.listbutton, listViewStyle]} onPress={handleListViewPress}>
                        <Image source={require('./assets/list-view.png')} style={[styles.icon, listViewIconStyle]} />
                    </TouchableOpacity>
                </View>
                {/* </View> */}
            </View>
            {moviesList.length === 0 ? (
                <View style={{ justifyContent: 'center', alignItems: 'center', height: '80%' }}>
                    <Text style={{ color: 'grey', fontSize: 28, fontFamily: 'Roboto' }}>Movie not found</Text>
                </View>
            ) : (
                view === "gridview" ? (
                    <FlatList
                        data={moviesList}
                        numColumns={3}
                        renderItem={({ item, index }) => (
                            <View style={styles.gridItem}>
                                <Image style={styles.imagesize} source={{ uri: item.url }} />
                                <View style={styles.gridtextposition}>
                                    <Text style={styles.gridtextposition}>{item.name}</Text>
                                    <Text style={styles.gridtextposition}>{item.date}</Text>
                                    {index < moviesList.length-bottomdata ? (<View>
                                        <Button onPress={removeitem(item)} title="Remove" color="#ff0000" />
                                    </View>) : (<View style={{marginBottom:120}}>
                                        <Button onPress={removeitem(item)} title="Remove" color="#ff0000" />
                                    </View>)}
                                </View>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                ) : (
                    <SectionList
                        sections={[
                            {
                                title: "Movies",
                                data: moviesList,
                            },
                        ]}
                        renderItem={({ item, index }) => (
                            <View style={styles.content}>
                                <Image style={styles.imagesize} source={{ uri: item.url }} />
                                <View style={styles.listtextposition}>
                                    <Text style={styles.listtextposition}>{item.name}</Text>
                                    <Text style={styles.listtextposition}>{item.date}</Text>
                                </View>
                                <Button onPress={removeitem(index)} title="Remove" color="#ff0000" />
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                )
            )}

        </SafeAreaView>);
};

export default Home

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    content: {
        justifyContent: "space-between",
        flexDirection: "row",
        padding: 5,
        alignItems: "center",
        margin: 5
    },
    imagesize: {
        width: 87.5,
        height: 129.62,
    },
    gridtextposition: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlignVertical: "top",
    },
    listtextposition: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: 10,
    },
    homebutton: {
        padding: 5,
        display: "flex",
    },
    gridItem: {
        flex: 1,
        width: "33%",
        alignItems: "center",
        justifyContent: "center",
    },
    listcontainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10,
        marginTop: 10,
    },
    listbutton: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOpacity: 0,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 0,
        elevation: 0,
        marginBottom: 10,
        marginRight: 10,
    },
    icon: {
        width: 24,
        height: 24,
    },
});

//         <SafeAreaView >
//                 <ScrollView style={styles.scollviewcss}>
//                     {moviesList.map((movie: { "name": string, "date": string, "url": string, "index": number }) => {
//                         return (
//                             <View style={styles.content}>
//                                 <Image style={styles.imagesize} source={{ uri: movie.url }} />
//                                 <View style={styles.textposition}>
//                                     <Text style={styles.textposition}>{movie.name}</Text>
//                                     <Text style={styles.textposition}>{movie.date}</Text>
//                                 </View>
//                                 <Button color="red" onPress={removeitem(movie.index)} title="Remove" />
//                             </View>
//                         )
//                     })}
//                 <View style={styles.homebuttonpos}>
//                     <View style={styles.homebutton}>
//                         <Button onPress={() => navigation.navigate("Movie")} title="MOVIE" />
//                     </View>
//                     <View style={styles.homebutton}>
//                         <Button onPress={() => navigation.navigate("Setting")} title="SETTING" />
//                     </View>
//                     <View style={styles.homebutton}>
//                         <Button onPress={() => navigation.navigate("LoginPage")} title="LOGOUT"/>
//                     </View>
//                 </View>
//                 </ScrollView>
//         </SafeAreaView>
//     );
// };

// export default Home;

// const styles = StyleSheet.create({
//     content: {
//         justifyContent: "space-between",
//         flexDirection: "row",
//         padding: 5,
//         alignItems: 'center',
//     },
//     imagesize: {
//         width: 87.5,
//         height: 129.62
//     },
//     textposition: {
//         justifyContent: "center",
//         flexDirection: "column",
//         textAlignVertical: "top",
//         width:200
//     },
//     homebutton: {
//         padding: 5,
//         display: "flex",
//     },
//     scollviewcss: {
//         // position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//     },
//     homebuttonpos: {
//     //     width: '100%',
//     //     height: 100,
//     //     backgroundColor: '#EE5407',
//     //     justifyContent: 'center',
//     //     alignItems: 'center',
//         // position: 'absolute',
//         bottom:0,
//     },
// })