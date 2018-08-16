const browserStorage = (name, sessionOnly) => {
  // Code for localStorage/sessionStorage.
  const storage = sessionOnly ? sessionStorage : localStorage;
  return {
    get: () => {
      const store = storage.getItem(name);
      return store && JSON.parse(store);
    },
    set: (store = {}) => storage.setItem(name, JSON.stringify(store)),
    remove: () => storage.removeItem(name),
    clear: () => storage.clear(),
  };
};

const memoryStorage = name => {
  let memoryPersistor = {};
  return {
    get: () => memoryPersistor[name],
    set: store => (memoryPersistor[name] = store),
    remove: () => delete memoryPersistor[name],
    clear: () => (memoryPersistor = {}),
  };
};

export default (name, sessionOnly) =>
  typeof Storage !== 'undefined'
    ? browserStorage(name, sessionOnly)
    : memoryStorage(name);
