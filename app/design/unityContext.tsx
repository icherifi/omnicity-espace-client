// UnityContext.js
import React, { createContext, useContext } from 'react';
import { useUnityContext } from "react-unity-webgl";

type UnityContextType = any; // Replace 'any' with the appropriate type for your Unity context

const UnityContext = createContext<UnityContextType | undefined>(undefined);

export const UnityProvider = ({ children }: { children: React.ReactNode }) => {
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

export const useUnity = () => useContext(UnityContext);