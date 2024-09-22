"use client"
import React, { createContext, useContext } from 'react';
import { useUnityContext } from "react-unity-webgl";

type UnityContextType = any;

const UnityContext = createContext<UnityContextType | undefined>(undefined);

export const UnityContextProvider = ({ children }: { children: React.ReactNode }) => {
    const unityContext = useUnityContext({
        loaderUrl: "../UnityGame/Build/UnityGame.loader.js",
        dataUrl: "../UnityGame/Build/UnityGame.data",
        frameworkUrl: "../UnityGame/Build/UnityGame.framework.js",
        codeUrl: "../UnityGame/Build/UnityGame.wasm",
    });

    return (
        <UnityContext.Provider value={unityContext}>
            {children}
        </UnityContext.Provider>
    );
};

export function useUnity () {
    const context = useContext(UnityContext)
    if (!context) {
        throw Error ("useUnity must be used within UnityContextProvider")
    }
    return context
}
