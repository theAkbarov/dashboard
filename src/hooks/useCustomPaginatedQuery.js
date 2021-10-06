import { usePaginatedQuery } from "react-query";

import { request } from "services/api";

const useCustomPaginatedQuery = ({
  url,
  params = {},
  extractData = (response) => response.data,
}) => {
  const result = usePaginatedQuery(
    [url, params],
    async () => {
      const response = await request.get(url, { params });
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

export default useCustomPaginatedQuery;
