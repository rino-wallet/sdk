export const getResponseEntityMock = <T>(data: Array<T>) => {
  return {
    count: data.length,
    next: "",
    previous: "",
    results: data,
  };
};
