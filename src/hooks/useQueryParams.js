import { useHistory, useLocation } from "react-router-dom";
import qs from "qs";

const useQueryParams = () => {
    const history = useHistory();
    const location = useLocation();

    const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });

    const set = (name, value) => history.push({ search: qs.stringify({ ...queryParams, [name]: value }) });
    const clear = () => history.push({ search: qs.stringify({}) });
    const merge = (values) => history.push({ search: qs.stringify({ ...queryParams, ...values }) });
    const reset = (name) => {
        let newParams = { ...queryParams };
        if (newParams[name]) {
            delete newParams[name];
        }

        history.push({ search: qs.stringify({ ...newParams }) });
    };

    return { values: queryParams, set, reset, clear, merge };
};

export default useQueryParams;
