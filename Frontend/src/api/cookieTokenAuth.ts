import HOST from "../context/HostContext";

export const cookieTokenAuth = async (): Promise<boolean> => {
  const API_BASE_URL = `${HOST}`;
  try {
    const response = await fetch(`${API_BASE_URL}/users/auth/check`, {
      method: "GET",
      credentials: "include", 
    });

    if (response.ok) {
      return true; 
    } else {
      return false;
    }
  } catch (error) {
    console.error((error as Error).message)
    return false; 
  }
};