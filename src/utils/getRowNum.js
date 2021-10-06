export const getRowNum = (index, page = 1, count, limit = 10) => {
  if (page >= 2) {
    if (count - (parseInt(page - 1) * limit + index) > 0) {
      return `${count - (parseInt(page - 1) * limit + index)}.`;
    }
    return "";
  }
  if (count - index > 0) {
    return `${count - index}.`;
  }
  return "";
};
