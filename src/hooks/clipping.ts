import { useMemo } from "react"
import { Dimensions } from "react-native"
import { Clipping } from "../schema/generated"

export function useClippingCellAvgHeight(cs: Pick<Clipping, 'content'>[]) {
  const itemSizeCellHeight = useMemo(() => {
    const recents = cs
    if (!recents) {
      return 10
    }
    const screenWidth = Dimensions.get('screen').width
    const availableWidth = screenWidth - 16 * 2 - 8 * 2
    const textsInOneLine = availableWidth / 14
    const lines = recents.reduce((acc, cur) => {
      const ls = cur.content.length / textsInOneLine
      acc += ls
      return acc
    }, 0)
    const avgLines = lines / recents.length
    // 行数 * line-height * font-size + paddingTop + paddingBottom
    const cellHeight = avgLines * 1.2 * 14 + 16 * 2
    return cellHeight
  }, [cs])
  return itemSizeCellHeight
}
