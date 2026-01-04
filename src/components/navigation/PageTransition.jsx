import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNetworkError } from '../../contexts/NetworkErrorContext';
import Spinner from '../spinner/Spinner';

const PageTransition = () => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { setLoading, isLoading } = useNetworkError();

  useEffect(() => {
    setIsTransitioning(true);
    setLoading(true, true); // Save current path
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setLoading(false);
    }, 900); // 0.9 secondi

    return () => {
      clearTimeout(timer);
      setLoading(false);
    };
  }, [location.pathname, setLoading]);

  // If network error occurs during transition, stop transition
  useEffect(() => {
    if (!isLoading && isTransitioning) {
      setIsTransitioning(false);
    }
  }, [isLoading, isTransitioning]);

  return isTransitioning ? <Spinner /> : null;
};

export default PageTransition;



