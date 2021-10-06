import React, { useState } from "react";

const useItemWithError = (value = "") => {
  const [item, setItem] = useState(value);
  const [error, setError] = useState(false);
  const set = (val) => setItem(val);
  const err = (val) => setError(val);

  const result = {
    value: item,
    error,
    set,
    err,
  };

  return result;
};

export default useItemWithError;
