// Utility functions for network error handling
import { useNetworkError, isNetworkError as checkNetworkError } from '../contexts/NetworkErrorContext';

// Hook to use network error handling in components
export const useNetworkErrorHandler = () => {
    const networkError = useNetworkError();
    
    const handleError = (error, isDuringLoading = false) => {
        if (checkNetworkError(error)) {
            if (isDuringLoading) {
                networkError.handleLoadingError(error);
            } else {
                networkError.handlePageError(error);
            }
            return true; // Error was handled
        }
        return false; // Error was not a network error
    };

    return { handleError, isNetworkError: checkNetworkError };
};

