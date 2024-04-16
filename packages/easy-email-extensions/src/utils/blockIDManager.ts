// Constants:
export const CSS_ID_REGEX = /^[A-Za-z]+[\w\-\:\.]*$/;

// Functions:
export const getBlockIDMap = () => {
  const blockIDMap = sessionStorage.getItem('block-ids') ?? '{}';
  return JSON.parse(blockIDMap === 'undefined' ? '{}' : blockIDMap) as Record<string, string>;
};
export const setBlockIDMap = (newBlockIDMap: Record<string, string>) => sessionStorage.setItem('block-ids', JSON.stringify(newBlockIDMap));

export const removeIDAssociatedWithIndex = (index: string) => {
  let blockIDMap = getBlockIDMap();
  if (typeof blockIDMap[index] === 'undefined') return;
  delete blockIDMap[index];
  setBlockIDMap(blockIDMap);
};

export const setIDForIndex = (ID: string, index: string) => {
  let newBlockIDMap = getBlockIDMap();
  newBlockIDMap[index] = ID;
  setBlockIDMap(newBlockIDMap);
};

export const isIDValid = (index: string, value?: string) => {
  if (value && value?.trim().length > 0) {
    setIDForIndex(value, index);

    if (!CSS_ID_REGEX.test(value)) return 'ID is invalid!';

    let blockIDMap = getBlockIDMap();
    if (typeof blockIDMap[index] !== 'undefined') delete blockIDMap[index];

    const IDs = Object.values(blockIDMap);
    if (IDs.includes(value)) return 'ID is already taken!';
  }
};
