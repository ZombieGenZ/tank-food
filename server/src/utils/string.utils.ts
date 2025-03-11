export const SplitTranslationString = (content: string) => {
  const firstPart: string = content.substring(0, 5)
  const secondPart: string = content.substring(9, 14)
  const remainingPart: string = content.substring(15)

  return {
    language_1: firstPart,
    language_2: secondPart,
    translate_string: remainingPart
  }
}
