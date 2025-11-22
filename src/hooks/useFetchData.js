import { useCallback, useEffect, useState } from "react";

export const useFetchData = (url, accessToken = null) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchingData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(url, {
          headers: {
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed while fetching data");
        }

        const data = await response.json();
        if (typeof data.success !== "undefined" && !data.success) {
          throw new Error(data.message || "Failed while fetching data");
        }

        setData(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (url) {
      fetchingData();
    }
  }, [accessToken, url, refetchTrigger]);

  return {
    isLoading,
    data,
    error,
    refetch,
  };
};
