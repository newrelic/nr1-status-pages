// TODO: Update once json structure is known
export const statusIoFormatter = data => {
  return {
    name: data['page']['name'],
    description: data['status']['description'],
    indicator: data['status']['indicator'],
  };
};

export const statusIoIncidentFormatter = data => {
  return data.incidents;
};
