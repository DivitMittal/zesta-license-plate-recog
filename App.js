import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Header } from "react-native";
import { Camera } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";

export default function App() {
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

    useEffect(reqPermCam, []);

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    // Methods
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

    const uploadImageToServer = async (imageUri) => {
        try {
            const formData = new FormData();
            formData.append("image", {
                uri: imageUri,
                type: "image/jpeg",
                name: "photo.jpg",
            });

            const response = await fetch("http://192.168.84.177/upload", {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.ok) {
                console.log("Image uploaded successfully to the server!");
            } else {
                console.log("Failed to upload image to the server");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const saveImages = async () => {
        // Upload each image in imageArray to the server
        for (const imageUri of imageArray) {
            await uploadImageToServer(imageUri);
        }
        console.log("Images saved!");
    };

    const discardImage = (imageUri) => {
        const updatedImageArray = imageArray.filter((uri) => uri !== imageUri);
        setImageArray(updatedImageArray);

        FileSystem.deleteAsync(imageUri, { idempotent: true });
    };

    // JSON Object & variables
    const Options = [
        { id: 1, type: "MH 12 DE 1433", owner: "Attamaram Bhide, Maharashtra" },
        { id: 2, type: "HR 26 DQ 5551", owner: "Divjot Singh, Haryana" },
        { id: 3, type: "DL 28 GE 6887", owner: "Divit Mittal, Delhi" },
    ];

    const darkGradientColors = ["#0F0F0F", "#1A1A1A"];

    // Styles
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
        },
        cameraContainer: {
            flex: 0.5,
            height: "100%",
            width: "150%",
            aspectRatio: 1 / 1,
            borderRadius: 20,
            overflow: "hidden",
        },
        optionsContainer: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: 5,
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
        selectedOption: {
            backgroundColor: "lightblue",
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
        logo: {
            width: 100,
            height: 100,
            resizeMode: 'cover',
            alignSelf: 'flex-start',
            margin: 10,
        },
        headerContainer: {
            display: 'flex',
            flex: 0.25,
            backgroundColor: "green",
        }
    });

    return (
        <LinearGradient colors={darkGradientColors} style={{ flex: 1 }}>
            <View style={styles.container}>
                <Image source={require('./assets/logo_icon.png')} style={styles.logo} />
                <Text style={{ color: 'white' }}> Zesta - Automatic License Plate </Text>
                <View style={styles.cameraContainer}>
                    <Camera
                        style={{
                            flex: 1,
                            borderWidth: 3,
                            borderColor: "white",
                            borderRadius: 35,
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
                        <TouchableOpacity
                            key={option.id}
                            style={[styles.option]}
                        >
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
}
