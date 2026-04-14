import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";

export const useUserSync = () => {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const syncMutation = useMutation({
    mutationFn: async () => {
      // Fetch token explicitly just in case axios interceptor isn't fast enough on first load
      const token = await getToken();
      return api.post(
        "/users/sync",
        {
          email: user?.primaryEmailAddress?.emailAddress,
          username: user?.username,
          avatarUrl: user?.imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    },
    onSuccess: (data) => {
      console.log("User successfully synced to backend:", data);
    },
    onError: (error) => {
      console.error("Failed to sync user to backend:", error);
    }
  });

  useEffect(() => {
    // Only attempt to sync if they are signed in and have a user object,
    // and we haven't already synced them in this specific session.
    if (isSignedIn && user) {
      if (!syncMutation.isPending && !syncMutation.isSuccess) {
        syncMutation.mutate();
      }
    }
  }, [isSignedIn, user?.id]);
};
