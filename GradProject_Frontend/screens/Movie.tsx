import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Button, Image, Alert, FlatList, SectionList, Dimensions, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useRecoilState } from "recoil";
import { isLeftState, moviesListState, searchKeywordState, userToken, userUID } from "./recoilstate";
import { StyleSheet } from "react-native";
// import sf_movie from "../sf.json";
// import major_movie from "../major.json";
// import { IconButton, useTheme } from 'react-native-paper';
import SearchBar from "./SearchBar";
import ToggleButton from "./toggleButton";
import axios from 'axios';
// const movies = [{ "name": "A", "date": "20-10-22", "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png" },
// { "name": "B", "date": "21-10-22" , "url" : "https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg"}]

const Movie = () => {
    const [uid, setuid] = useRecoilState(userUID);
    const [utoken, setutoken] = useRecoilState(userToken);
    const [sf_movie, setsf_movie] = useState([])
    const [major_movie, setmajor_movie] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            axios.get('http://10.0.2.2:3000/get_sf_movie')
                .then(response => {
                    console.log(response.data);

                    setsf_movie(response.data)

                })
                .catch(error => {
                    console.log('An error occurred:', error);
                });
            axios.get('http://10.0.2.2:3000/get_major_movie')
                .then(response => {
                    console.log(response.data, response.data.length);
                    setmajor_movie(response.data)

                })
                .catch(error => {
                    console.log('An error occurred:', error);
                });
        };
        fetchData();
    }, []);

    const [movie, setmovie] = useState(sf_movie);
    const [movieinList, setmovieinList] = useRecoilState(moviesListState);
    const [view, setView] = useState("gridview");
    const [list, setList] = useRecoilState(isLeftState);
    const [searchKeyword, setSearchKeyword] = useRecoilState(searchKeywordState);

    // const switchLists = () => {
    //     setList((list) => (list === 1 ? 2 : 1));
    //     handleReset();
    // };

    const toggleView = () => {
        if (view === "gridview") {
            setView("listview");
        } else {
            setView("gridview");
        }
    };
    const handleGridViewPress = () => {
        setView("gridview");
    };

    const handleListViewPress = () => {
        setView("listview");
    };

    const additem = (item: any, index: number) => () => {
        console.log('adding');
        
        const cinema = list === true ? 'sf' : 'major';
        console.log(item);
        const data = {'token':utoken, 'cinema': cinema, 'name': item.name, 'date': item.date, 'sypnosis': item.sypnosis, 'url': item.url, 'timestamp': item.timestamp, 'uid': uid };
        axios.post('http:10.0.2.2:3000/addmovie', data)
        showAlert()
    }

    const showAlert = () => {
        Alert.alert(
            "Added"
        )
    }

    const [showModal, setShowModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState({ "name": "A", "date": "A", "url": "A", "sypnosis": "A" });

    const handleImagePress = (item: any) => {
        setSelectedMovie(item);
        console.log(item);
        setShowModal(true);
        console.log(`showModal is now ${showModal}.`);
    };

    const handleModalClose = () => {
        setShowModal(false);
        console.log(`showModal is now ${showModal}.`);
    };

    // const callfunction = (item:any , index:number)  => {
    //     additem(item,index);
    //     showAlert()
    // }

    const handleSearch = (filteredMovies: any) => {
        setmovie(filteredMovies);
    };

    const handleReset = () => {
        console.log("Reset");
        if (list === true) {
            setmovie(sf_movie);
        } else {
            setmovie(major_movie);
        }
    };

    const gridViewStyle = view === 'gridview' ? { backgroundColor: '#D3D3D3' } : { backgroundColor: 'white' };
    const listViewStyle = view === 'listview' ? { backgroundColor: '#D3D3D3' } : { backgroundColor: 'white' };
    const gridViewIconStyle = view === 'gridview' ? { tintColor: 'black' } : { tintColor: '#A9A9A9' };
    const listViewIconStyle = view === 'listview' ? { tintColor: 'black' } : { tintColor: '#A9A9A9' };

    return (
        <SafeAreaView>
            <SearchBar movies={list === true ? sf_movie : major_movie} onSearch={handleSearch} onReset={handleReset} />
            <View style={styles.listcontainer}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingTop: 8, paddingBottom: 18, marginLeft: 10 }}>
                    <ToggleButton />
                </View>
                <TouchableOpacity style={[styles.listbutton, gridViewStyle]} onPress={handleGridViewPress}>
                    <Image source={require('./assets/grid-view.png')} style={[styles.icon, gridViewIconStyle]} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.listbutton, listViewStyle]} onPress={handleListViewPress}>
                    <Image source={require('./assets/list-view.png')} style={[styles.icon, listViewIconStyle]} />
                </TouchableOpacity>
            </View>
            {/* <Button onPress={switchLists} title="Test" /> */}
            {/* <View>
                <View style={styles.homebutton}>
                    <Button onPress={switchLists} title={list === 1 ? "SF" : "Major"} />
                </View> */}
            {/* <View style={styles.homebutton}>
                </View>
            </View> */}
            {/* use FlatList or SectionList depending on the current view mode */}
            {view === "gridview" ? (
                <FlatList
                    data={searchKeyword === '' ? (list === true ? sf_movie : major_movie) : movie}
                    numColumns={3}
                    renderItem={({ item, index }) => (
                        <View style={styles.gridItem}>
                            <TouchableOpacity onPress={() => handleImagePress(item)}>
                                <Image style={styles.imagesize} source={{ uri: item.url }} />
                            </TouchableOpacity>
                            <View style={styles.gridtextposition}>
                                <Text style={styles.gridtextposition}>{item.name}</Text>
                                <Text style={styles.gridtextposition}>{item.rawdate}</Text>
                                <View style={styles.addButtonContainer}>
                                    <Button onPress={additem(item, index)} title="Add" />
                                </View>
                            </View>
                            <Modal visible={showModal}>
                                <View style={styles.modalContainer}>
                                    <Image style={styles.modalImage} source={{ uri: selectedMovie.url }} />
                                    <ScrollView>
                                        <Text style={styles.modalText}>{selectedMovie.name}</Text>
                                        <Text style={styles.modalText}>{selectedMovie.rawdate}</Text>
                                        <Text style={styles.modalText}>{selectedMovie.sypnosis}</Text>
                                    </ScrollView>
                                    <View style={styles.modalButtonContainer}>
                                        <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
                                            <Text style={styles.modalButtonText}>Close</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <SectionList
                    sections={[
                        {
                            title: "Movies",
                            data: (searchKeyword === '' ? (list === true ? sf_movie : major_movie) : movie),
                        },
                    ]}
                    renderItem={({ item, index }) => (
                        <View style={styles.content}>
                            <TouchableOpacity onPress={() => handleImagePress(item)}>
                                <Image style={styles.imagesize} source={{ uri: item.url }} />
                            </TouchableOpacity>
                            <View style={styles.listtextposition}>
                                <Text style={styles.listtextposition}>{item.name}</Text>
                                <Text style={styles.listtextposition}>{item.rawdate}</Text>
                            </View>
                            <Button onPress={additem(item, index)} title="Add" />
                            <Modal visible={showModal}>
                                <View style={styles.modalContainer}>
                                    <Image style={styles.modalImage} source={{ uri: selectedMovie.url }} />
                                    <ScrollView>
                                        <Text style={styles.modalText}>{selectedMovie.name}</Text>
                                        <Text style={styles.modalText}>{selectedMovie.rawdate}</Text>
                                        <Text style={styles.modalText}>{selectedMovie.sypnosis}</Text>
                                    </ScrollView>
                                    <View style={styles.modalButtonContainer}>
                                        <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
                                            <Text style={styles.modalButtonText}>Close</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        </View>)}
                    keyExtractor={(item, index) => index.toString()} />)}
        </SafeAreaView>);
};

export default Movie;

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
        // textAlignVertical: "top",
        marginTop: 10, // add margin to the top of the textposition view
    },
    homebutton: {
        padding: 5,
        display: "flex",
    },
    gridItem: {
        flex: 1,
        width: "33%", // set the width to be 1/3 of the screen width
        alignItems: "center",
        justifyContent: "center",
    },
    addButtonContainer: {
        borderRadius: 20,
        marginBottom: 15, // add a margin around the button
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalImage: {
        width: 200,
        height: 300,
        marginBottom: 20,
        resizeMode: 'contain',
        borderRadius: 10,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    modalButton: {
        backgroundColor: '#2e8b57',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    listcontainer: {
        flexDirection: 'row',
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
//         width: 200
//     },
//     homebutton: {
//         padding: 5,
//         display: "flex",
//     },
//     // homebuttonpos: {
//     //     marginTop: 350,
//     // }
// });

