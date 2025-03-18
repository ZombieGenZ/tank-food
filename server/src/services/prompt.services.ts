import Prompt from '~/models/schemas/prompt.schemas'
import databaseService from './database.services'

class PromptService {
  async insertPrompt(prompt: string, response: string) {
    await databaseService.prompt.insertOne(
      new Prompt({
        prompt_content: prompt,
        response_content: response
      })
    )
  }
}

const promptService = new PromptService()
export default promptService
