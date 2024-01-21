import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";
import fortu from "./assets/fortu.jpeg";

const App = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [camera, setCamera] = useState(null);
    const [imageArray, setImageArray] = useState([]);
    const exampleImageUri = Image.resolveAssetSource(fortu).uri;
    const [lID, setlID] = useState("DL9CAP0941")
    const [Options, setOptions] = useState([
        {
            id: 1,
            type: "Captured Image",
            owner: "",
            imageSource: exampleImageUri,
        },
        { id: 2, type: lID, owner: "Divit Mittal, Delhi" },
    ]);

    const reqPermCam = () => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    };

    const ws = new WebSocket("ws://192.168.84.177:2121/");
    const stWebSocket = () => {
        ws.onopen = () => {
            console.log("WebSocket connection opened");
        };
        ws.onerror = (e) => {
            console.log(e.message);
        };
        ws.onclose = (e) => {
            console.log(e.code, e.reason);
        };
    };

    useEffect(reqPermCam, []);
    useEffect(stWebSocket, []);

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const takePicture = async () => {
        if (camera) {
            const photo = await camera.takePictureAsync(null);
            const asset = await FileSystem.getInfoAsync(photo.uri);

            const newImageUri = `${
                FileSystem.documentDirectory
            }${Date.now()}.jpg`;

            await FileSystem.moveAsync({
                from: asset.uri,
                to: newImageUri,
            });

            const newImageArray = [...imageArray, newImageUri];
            setImageArray(newImageArray);
        }
    };

    const discardImage = (imageUri) => {
        const updatedImageArray = imageArray.filter((uri) => uri !== imageUri);
        setImageArray(updatedImageArray);

        FileSystem.deleteAsync(imageUri, { idempotent: true });
    };

    const encImage = async (uri) => {
        try {
            const base64String = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return base64String;
        } catch (error) {
            console.error("Error reading image:", error);
            throw error;
        }
    };

    const saveImages = async (lID) => {
        try {
            clickImgURI = imageArray[imageArray.length - 1];
            const base64String = await encImage(clickImgURI);
            ws.send(base64String);

            ws.onmessage = (e) => {
                const updatedlID = e.data;
                setlID(updatedlID);
            }

            const updatedOptions = [...Options];
            updatedOptions[0] = {
                id: 1,
                type: "Captured Image",
                owner: "",
                imageSource: clickImgURI,
            };

            updatedOptions[1] = {
                id: 2,
                type: "DL9CAP0941",
                owner: "Ramin, Delhi",
            };

            setOptions(updatedOptions);

        } catch (error) {
            console.error("Error saving images:", error);
        }
    };

    const darkGradientColors = ["#0F0F0F", "#1A1A1A"];

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "flex-end",
            borderRadius: 5,
            alignItems: "center",
            marginTop: 30,
        },
        logo: {
            width: 100,
            height: 110,
            margin: 10,
            marginTop: 20,
        },
        zestaText: {
            fontSize: 24,
            fontWeight: "bold",
            color: "white",
            marginBottom: 10,
        },
        cameraContainer: {
            flex: 1,
            margin: 10,
            height: "70%",
            width: "90%",
            borderRadius: 50,
            overflow: "hidden",
            marginTop: 0,
        },
        optionsContainer: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: 10,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
        },
        option: {
            flex: 1,
            marginRight: 5,
            color: "white",
            borderWidth: 1,
            backgroundColor: "white",
            borderColor: "black",
            borderRadius: 8,
            padding: 10,
            marginBottom: 10,
        },
        optionType: {
            fontSize: 18,
            fontWeight: "bold",
            color: 'red',
        },
        optionOwner: {
            marginTop: 0,
            color: "black",
        },
        CarButton: {
            backgroundColor: "green",
            padding: 16,
            borderRadius: 8,
            margin: 16,
            alignItems: "center",
        },
        CarText: {
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
        },
        savedImage: {
            width: 100,
            height: 100,
            margin: 5,
            borderRadius: 5,
        },
        discardButton: {
            backgroundColor: "red",
            padding: 8,
            borderRadius: 5,
            marginTop: 5,
            alignItems: "center",
        },
        discardText: {
            color: "white",
            fontSize: 14,
        },
    });

    return (
        <LinearGradient colors={darkGradientColors} style={{ flex: 1 }}>
            <View style={styles.container}>
                <Image
                    source={require("./assets/logo.png")}
                    style={styles.logo}
                />
                <Text style={styles.zestaText}>ZESTA</Text>

                <View style={styles.cameraContainer}>
                    <Camera
                        style={{
                            flex: 1,
                            borderWidth: 3,
                            borderColor: "black",
                            borderRadius: 20,
                            overflow: "hidden",
                        }}
                        type={type}
                        ref={(ref) => setCamera(ref)}
                    >
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "transparent",
                                flexDirection: "column",
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    flex: 0.1,
                                    alignSelf: "flex-end",
                                    alignItems: "center",
                                }}
                                onPress={() => {
                                    setType(
                                        type === Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back
                                    );
                                }}
                            />
                        </View>
                    </Camera>
                </View>

                <View style={styles.optionsContainer}>
                    {Options.map((option) => (
                        <TouchableOpacity key={option.id} style={styles.option}>
                            <Text
                                style={[
                                    styles.optionType,
                                    option.id === 1 && { color: "black" },
                                ]}
                            >
                                {option.type}
                            </Text>
                            {option.imageSource && (
                                <Image
                                    source={{ uri: option.imageSource }}
                                    style={{
                                        width: 150,
                                        height: 110,
                                        marginBottom: 1,
                                        borderRadius: 10,
                                    }}
                                />
                            )}
                            <Text
                                style={[
                                    styles.optionOwner,
                                    option.id === 3 && { color: "red" },
                                ]}
                            >
                                {option.owner}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.CarButton}
                    onPress={takePicture}
                >
                    <Text style={styles.CarText}>Click To Evaluate!!</Text>
                </TouchableOpacity>

                {imageArray.length > 0 && (
                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            marginTop: 20,
                        }}
                    >
                        {imageArray.map((image, index) => (
                            <View key={index} style={{ margin: 5 }}>
                                <Image
                                    source={{ uri: image }}
                                    style={styles.savedImage}
                                />
                                <TouchableOpacity
                                    onPress={() => discardImage(image)}
                                    style={styles.discardButton}
                                >
                                    <Text style={styles.discardText}>
                                        Discard
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                {imageArray.length > 0 && (
                    <TouchableOpacity
                        style={styles.CarButton}
                        onPress={saveImages}
                    >
                        <Text style={styles.CarText}>
                            Send to server for evaluation!!
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </LinearGradient>
    );
};

export default App;
