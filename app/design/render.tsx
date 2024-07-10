import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useUnity, UnityProvider  } from "./unityContext";


export default function Render() {

    const { unityProvider, sendMessage } = useUnity();

    const unityStyle: React.CSSProperties = {
        flex: 1, // Makes the Unity component flexible within its container
    };

    const containerStyle: React.CSSProperties = {
        display: 'flex', // This makes the container a flex container
        width: '100%', // Makes the container as wide as possible
        height: '100vh', // Makes the container as tall as the viewport
        marginLeft: '0', // Removes the left margin
    };

    function sendDataUnity() {
        sendMessage("GameController", "UpdateMessage", "send");
    }

    return (
        <div style={containerStyle}>
            <Unity style={unityStyle} unityProvider={unityProvider} />
        </div>
    );

}