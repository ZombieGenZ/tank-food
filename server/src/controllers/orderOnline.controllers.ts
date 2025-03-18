export const orderOnlineController = async (
  req: Request<ParamsDictionary, any, OrderOnlineRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage
  const image = req.image as ImageType

  try {
    await productService.create(req.body, image, user)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.OrderOnlineSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.OrderOnlineSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.CREATE_PRODUCT_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.CREATE_PRODUCT_SUCCESS
          : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.CREATE_PRODUCT_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.OrderOnlineFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.OrderOnlineFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.CREATE_PRODUCT_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.CREATE_PRODUCT_FAILURE
          : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.CREATE_PRODUCT_FAILURE
    })
  }
}