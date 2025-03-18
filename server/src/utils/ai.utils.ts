import { GoogleGenerativeAI } from '@google/generative-ai'
import GeminiAIPrompt from '~/constants/prompt.constants'
import promptService from '~/services/prompt.services'

const MODEL_NAME = process.env.GEMINI_AI_MODEL_NAME || ''
const API_KEY = process.env.GEMINI_AI_API_KEY || ''
const genAI = new GoogleGenerativeAI(API_KEY)

export const translateContent = async (content: string) => {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME })

  const prompt = GeminiAIPrompt.translate(content)

  await promptService.insertPrompt(prompt)

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  return text
}

export const CalculateShippingCosts = async (delivery_address: string, receiving_address: string) => {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME })

  const prompt = GeminiAIPrompt.CalculateShippingCosts(delivery_address, receiving_address)

  await promptService.insertPrompt(prompt)

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  return text
}
