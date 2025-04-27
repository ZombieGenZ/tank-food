// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { ObjectId } from 'mongodb'

interface PromptType {
  _id?: ObjectId
  prompt_content: string
  response_content: string
  created_at?: Date
}

export default class Prompt {
  _id: ObjectId
  prompt_content: string
  response_content: string
  created_at: Date
  
  constructor(prompt: PromptType) {
    this._id = prompt._id || new ObjectId()
    this.prompt_content = prompt.prompt_content
    this.response_content = prompt.response_content
    this.created_at = prompt.created_at || new Date()
  }
}
