import { isEqual, isObject, transform } from 'lodash'

/**
 * Deep diff between two object, using lodash.
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export function diff(object, base) {
  return transform(object, (result, value, key) => {
    if (!isEqual(value, base[key])) {
      result[key] =
        isObject(value) && isObject(base[key]) ? diff(value, base[key]) : value
    }
  })
}
