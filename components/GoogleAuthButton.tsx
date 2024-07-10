"use client";

import { createClient } from "@/utils/supabase/client";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation'


export default function GoogleAuthButton() {
  const router = useRouter()
  const signInWithGoogle = async (response: any) => {
    const supabase = createClient();
    await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    })
    router.push('/')
  };

  return (
    <GoogleOAuthProvider clientId="662491215533-5ptivp021bjjef5jd7eroeum9nvhjvd7.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={credentialResponse => {
            signInWithGoogle(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </GoogleOAuthProvider>
  );
}
