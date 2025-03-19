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
