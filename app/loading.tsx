"use client"
import { Progress } from '@/components/ui/progress';
import React, { useEffect, useState } from 'react'

function loading() {
    const [progress, setProgress] = useState(13)

    useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 100)
    return () => clearTimeout(timer)
    }, [])

    return (
    <div className="h-screen w-full flex flex-col items-center mt-16">
        <Progress value={progress} className="w-[60%]" />
    </div>
    )
}

export default loading