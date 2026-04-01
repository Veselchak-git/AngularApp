import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatInterface } from '../interfaces/chat.interface';
import { ChatMessageInterface } from '../interfaces/chat-message.interface';

@Injectable({
  providedIn: 'root'
})
export class Chat {
  http = inject(HttpClient);
  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  createPersonalChat(userId: number) {
    return this.http.post<ChatInterface>(`${this.baseApiUrl}chat/${userId}`, {});
  }

  getPersonalChat(userId: number) {
    return this.http.get<ChatInterface>(`${this.baseApiUrl}chat/${userId}`);
  }

  getChats() {
    return this.http.get<ChatInterface>(`${this.baseApiUrl}chat/get_my_chats/`);
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post<ChatMessageInterface>(`${this.baseApiUrl}message/send/${chatId}`, message);
  }

  getMyMessage(messageId: number) {
    return this.http.get<ChatMessageInterface>(`${this.baseApiUrl}message/${messageId}`);
  }

  editMyMessage(messageId: number, text: string) {
    return this.http.patch<ChatMessageInterface>(`${this.baseApiUrl}message/${messageId}`, text);
  }

  deleteMyMessage(messageId: number) {
    return this.http.delete(`${this.baseApiUrl}message/${messageId}`);
  }
}
