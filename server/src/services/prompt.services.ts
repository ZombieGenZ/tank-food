// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

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
