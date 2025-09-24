"use client";

import { useTheme } from "@/contexts/theme.context";
import Image from "next/image";

export function LoginLogo() {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/logo-login-dark.png" : "/logo-login-light.png";

  return (
    <Image
      src={logoSrc}
      alt="Logo Omnicity"
      width={180}
      height={180}
      className="mb-4"
      priority
      draggable={false}
    />
  );
} 