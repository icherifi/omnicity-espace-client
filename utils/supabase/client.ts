import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export const getUserId = async (): Promise<string | null> => {
  const { data, error } = await createClient().auth.getUser();
  if (error) {
    console.error("Error getting user:", error);
    return null;
  }
  return data?.user?.id || null;
};

export const getToken = async (): Promise<string | null> => {
  const { data, error } = await createClient().auth.getSession();
  if (error) {
    console.error("Error getting token:", error);
    return null;
  }
  if (!data?.session?.access_token) {
    console.error("No access token found");
    return null;
  }
  return data.session.access_token;
};
