import { GoogleGenerativeAI } from '@google/generative-ai'
import GeminiAIPrompt from '~/constants/prompt.constants'
import { OverviewResponseWithComparison } from '~/constants/statistical.constants'
import promptService from '~/services/prompt.services'

const MODEL_NAME = process.env.GEMINI_AI_MODEL_NAME || ''
const API_KEY = process.env.GEMINI_AI_API_KEY || ''
const genAI = new GoogleGenerativeAI(API_KEY)

export const translateContent = async (content: string) => {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME })

  const prompt = GeminiAIPrompt.translate(content)

  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text()

  await promptService.insertPrompt(prompt, text)

  return text
}

export const calculateShippingCosts = async (delivery_address: string, receiving_address: string) => {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME })

  const prompt = GeminiAIPrompt.calculateShippingCosts(delivery_address, receiving_address)

  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text()

  await promptService.insertPrompt(prompt, text)

  return text
}

export const reportComment = async (
  startTime: Date,
  endTime: Date,
  language: string,
  data: OverviewResponseWithComparison
) => {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME })

  const prompt = GeminiAIPrompt.reportComment(startTime, endTime, language, data)

  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text()

  await promptService.insertPrompt(prompt, text)

  return text
}
