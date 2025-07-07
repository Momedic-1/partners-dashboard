export const isTokenExpired = (token: string): boolean => {
    try {
      const [, payload] = token.split(".");
      const decoded = JSON.parse(atob(payload));
      const exp = decoded.exp;
      return Date.now() >= exp * 1000; // Convert to ms
    } catch {
      return true; // treat as expired if parsing fails
    }
  };
  