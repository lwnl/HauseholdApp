import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { cookieTokenAuth } from '../api/cookieTokenAuth'

interface ProtectedRouteProps {
  children: ReactNode;
}

const TokenVerifizierung = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const isValid = await cookieTokenAuth(); 
        setIsAuthenticated(isValid);
      } catch (error) {
        console.error("Token-Validierungsfehler:", error);
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      {isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />}
    </div>
  );
};

export default TokenVerifizierung;