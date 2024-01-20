import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";
import { encode } from "base-64";

const App = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [camera, setCamera] = useState(null);
    const [imageArray, setImageArray] = useState([]);

    const reqPermCam = () => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    };

    const stWebSocket = () => {
        const ws = new WebSocket("ws://192.168.84.177:2121/");
        ws.onopen = () => {
            // Connection opened
            console.log("WebSocket connection opened");
            ws.send("Hello, server!"); // Send a message to the server
        };
        ws.onmessage = (e) => {
            // Receive a message from the server
            console.log(e.data);
        };
        ws.onerror = (e) => {
            // An error occurred
            console.log(e.message);
        };
        ws.onclose = (e) => {
            // Connection closed
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

            // Save image to project's data directory
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
        // Remove the discarded image from the array
        const updatedImageArray = imageArray.filter((uri) => uri !== imageUri);
        setImageArray(updatedImageArray);

        // Delete the image file from the directory
        FileSystem.deleteAsync(imageUri, { idempotent: true });
    };

    const saveImages = async () => {
        // Perform any additional actions before saving images if needed
        console.log("Images saved!");
    };

    const Options = [
        { id: 2, type: "HR 26 DQ 5551", owner: "Divjot Singh, Haryana" },
        { id: 3, type: "DL 28 GE 6887", owner: "Divit Mittal, Delhi" },
    ];

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
        },
        optionOwner: {
            marginTop: 50,
            color: "green",
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
                {/* Add the logo image */}
                <Image
                    source={require("./assets/logo.png")}
                    style={styles.logo}
                />

                {/* Add the ZESTA text */}
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
                                    option.id === 3 && { color: "red" },
                                ]}
                            >
                                {option.type}
                            </Text>
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
                        <Text style={styles.CarText}>Save Images</Text>
                    </TouchableOpacity>
                )}
            </View>
        </LinearGradient>
    );
};

export default App;
