import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class OpenaiService {
  private openai;
  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async createCompletion(prompt) {
    try {
      const messages = [];
      messages.push({ role: 'user', content: prompt });
      const completion = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages,
      });

      return completion.data.choices[0].message.content;
    } catch (error) {
      console.log(error.response?.status);
      console.log(error.response?.data);
    }
  }
}
