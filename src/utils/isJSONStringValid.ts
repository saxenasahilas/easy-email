// Exports:
export const isJSONStringValid = (JSONString: string) => {
  try {
    JSON.parse(JSONString);
  } catch (e) {
    return false;
  }
  return true;
};
