
import { useCurrentUserInfoQuery, UserDto } from "../app/api"; // Adjust import path if 'UserDto' or 'useCurrentUserInfoQuery' is in a different file like '../app/store'

interface AuthHookResult {
  loggedIn: boolean;
  user?: UserDto;
  isLoading: boolean;
  isError: boolean;
  refetchUser: () => void;
}

export const useAuth = (): AuthHookResult => {
  const {
    data: user,
    isLoading, // True on initial load and when re-fetching
    isError,
    refetch, // RTK Query's refetch function
    isFetching, // True during any fetch (initial, refetch, background)
  } = useCurrentUserInfoQuery();

  const loggedIn = !!user && !isError;
  const combinedLoading = isLoading || isFetching;

  return {
    loggedIn,
    user,
    isLoading: combinedLoading,
    isError,
    refetchUser: refetch,
  };
};