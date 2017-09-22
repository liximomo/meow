export default function createAction(type, payloadCreator = a => a, metaCreator) {
  return (...args) => {
    try {
      const action = {
        type,
        payload: payloadCreator(...args),
      };
      if (typeof metaCreator === 'function') {
        action.meta = metaCreator(...args);
      }
      return action;
    } catch (error) {
      return {
        type,
        payload: error,
        error: true,
      };
    }
  };
}
