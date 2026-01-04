import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Global reference to network error handler (set by NetworkErrorProvider)
// This avoids circular dependency with AuthContext
let globalHandlePageErrorRef = null;

export const setGlobalNetworkErrorHandler = (handler) => {
  globalHandlePageErrorRef = handler;
};

export const getGlobalNetworkErrorHandler = () => {
  return globalHandlePageErrorRef;
};

const NetworkErrorContext = createContext();

export const useNetworkError = () => useContext(NetworkErrorContext);

// Check if error is a network error (exported for use in other files)
export const isNetworkError = (error) => {
    if (!error) return false;
    
    // Firebase network errors
    if (error.code === 'unavailable' || 
        error.code === 'failed-precondition' ||
        error.message?.includes('network') ||
        error.message?.includes('Network') ||
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('NetworkError') ||
        error.code === 'auth/network-request-failed') {
        return true;
    }

    // Generic network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
        return true;
    }

    return false;
};

export const NetworkErrorProvider = ({ children }) => {
    const [networkError, setNetworkError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [previousPath, setPreviousPath] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();


    // Handle network error during loading
    const handleLoadingError = useCallback((error) => {
        if (isNetworkError(error)) {
            setIsLoading(false);
            // Navigate back to previous path if available
            if (previousPath && previousPath !== location.pathname) {
                navigate(previousPath);
            } else {
                navigate(-1); // Go back in history
            }
            setPreviousPath(null);
        }
    }, [navigate, location.pathname, previousPath]);

    // Handle network error on current page
    const handlePageError = useCallback((error) => {
        if (isNetworkError(error)) {
            setNetworkError({
                message: 'networkError',
                timestamp: Date.now()
            });
            // Auto-hide after 5 seconds
            setTimeout(() => {
                setNetworkError(null);
            }, 5000);
        }
    }, []);

    // Set loading state and track previous path
    const setLoading = useCallback((loading, savePath = true) => {
        setIsLoading(loading);
        if (loading && savePath) {
            setPreviousPath(location.pathname);
        } else if (!loading) {
            setPreviousPath(null);
        }
    }, [location.pathname]);

    // Clear network error
    const clearError = useCallback(() => {
        setNetworkError(null);
    }, []);

    // Set global handler for AuthContext
    useEffect(() => {
        setGlobalNetworkErrorHandler(handlePageError);
        return () => {
            setGlobalNetworkErrorHandler(null);
        };
    }, [handlePageError]);

    const value = {
        networkError,
        isLoading,
        isNetworkError,
        handleLoadingError,
        handlePageError,
        setLoading,
        clearError,
    };

    return (
        <NetworkErrorContext.Provider value={value}>
            {children}
        </NetworkErrorContext.Provider>
    );
};

