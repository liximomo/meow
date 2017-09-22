// create redux state selector
export default function createKeysSelector(obj, stateKey) {
  const keyPath = stateKey.split('.');
  const getTarget = object => keyPath.reduce((value, key) => value[key], object);
  return Object.keys(obj).reduce((sels, key) => {
    // eslint-disable-next-line no-param-reassign
    sels[key] = state => getTarget(state)[key];
    return sels;
  }, {});
}
