import Prompt from '~/models/schemas/prompt.schemas'
import databaseService from './database.services'

class PromptService {
  async insertPrompt(content: string) {
    await databaseService.prompt.insertOne(
      new Prompt({
        prompt_content: content
      })
    )
  }
}

const promptService = new PromptService()
export default promptService
