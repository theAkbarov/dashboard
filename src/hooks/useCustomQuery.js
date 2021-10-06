import { useQuery } from "react-query";
import api from "services/api";

const useCustomQuery = ({
  url,
  params = {},
  extractData = (response) => response.data,
}) => {
  const result = useQuery(
    [url, params],
    async () => {
      const response = await api.request.get(url, { params });
      const data = extractData(response);

      return data;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );

  return result;
};

export default useCustomQuery;
