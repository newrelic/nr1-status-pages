export const statusPageIoFormatter = data => {
  return {
    name: data.page.name,
    description: data.status.description,
    indicator: data.status.indicator
  };
};

export const statusPageIncidentFormatter = data => {
  return data.incidents;
};
