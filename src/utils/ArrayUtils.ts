export class ArrayUtils {
  static unique<T>(array: Array<T>, isEqual: (left: T, right: T) => boolean) {
    return array.reduce<Array<T>>((acc, next) => {
      const existingItem = acc.find((item) => isEqual(item, next)) !== undefined

      if (!existingItem) {
        return [...acc, next]
      }

      return acc
    }, [])
  }

  static uniqueStrings(array: Array<string>) {
    return this.unique(array, (left, right) => left.localeCompare(right) === 0)
  }
}
