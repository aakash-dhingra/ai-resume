import { Component, ChangeDetectionStrategy, signal, inject, ElementRef, viewChild } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';

interface Message {
  author: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-vibe-chat',
  standalone: true,
  template: `
    <div>
      <!-- Chat Bubble -->
      <button (click)="toggleChat()" class="fixed bottom-6 right-6 w-16 h-16 bg-cyan-500 rounded-full text-white shadow-lg shadow-cyan-500/50 flex items-center justify-center z-50 transition-transform hover:scale-110">
        @if (isOpen()) {
          <!-- Close Icon (X) -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        } @else {
          <!-- Chat Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        }
      </button>

      <!-- Chat Window -->
      @if (isOpen()) {
        <div class="fixed bottom-24 right-6 w-[calc(100vw-3rem)] max-w-sm h-[60vh] max-h-[500px] flex flex-col bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-40 vibe-chat-window">
          <div class="p-4 border-b border-white/10">
            <h3 class="font-bold text-lg text-white">Vibe Chat</h3>
            <p class="text-sm text-gray-400">Chat with my AI assistant</p>
          </div>

          <div #chatContainer class="flex-1 p-4 overflow-y-auto space-y-4">
            @for (message of messages(); track $index) {
              <div class="flex" [class.justify-end]="message.author === 'user'">
                <div 
                  class="max-w-[80%] rounded-xl px-4 py-2"
                  [class.bg-cyan-600]="message.author === 'user'"
                  [class.text-white]="message.author === 'user'"
                  [class.bg-gray-700]="message.author === 'ai'"
                  [class.text-gray-200]="message.author === 'ai'">
                  <p class="text-sm whitespace-pre-wrap">{{ message.text }}</p>
                </div>
              </div>
            }
            @if (isLoading()) {
              <div class="flex justify-start">
                <div class="max-w-[80%] rounded-xl px-4 py-2 bg-gray-700 text-gray-200">
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse-fast"></div>
                    <div class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse-medium"></div>
                    <div class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse-slow"></div>
                  </div>
                </div>
              </div>
            }
          </div>

          <div class="p-4 border-t border-white/10">
            <div class="flex items-center gap-2">
              <input 
                type="text"
                [value]="currentQuery()"
                (input)="onQueryChange($event)"
                (keyup.enter)="sendMessage()"
                [disabled]="isLoading()"
                placeholder="Ask about my projects..."
                class="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <button (click)="sendMessage()" [disabled]="isLoading()" class="bg-cyan-500 text-black p-2 rounded-lg hover:bg-cyan-400 disabled:bg-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .vibe-chat-window {
      animation: slideInUp 0.3s ease-out forwards;
    }

    @keyframes pulse-opacity {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }

    .animate-pulse-fast {
      animation: pulse-opacity 1s infinite;
    }
    .animate-pulse-medium {
      animation: pulse-opacity 1s infinite;
      animation-delay: 0.2s;
    }
    .animate-pulse-slow {
      animation: pulse-opacity 1s infinite;
      animation-delay: 0.4s;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VibeChatComponent {
  private geminiService = inject(GeminiService);
  private chatContainer = viewChild<ElementRef>('chatContainer');

  isOpen = signal(false);
  isLoading = signal(false);
  currentQuery = signal('');
  messages = signal<Message[]>([
    { author: 'ai', text: "Hey there! I'm Aakash's AI assistant. Ask me anything about his projects or skills." }
  ]);

  toggleChat() {
    this.isOpen.update(open => !open);
  }

  async sendMessage() {
    const userMessage = this.currentQuery().trim();
    if (!userMessage || this.isLoading()) return;

    this.messages.update(m => [...m, { author: 'user', text: userMessage }]);
    this.currentQuery.set('');
    this.isLoading.set(true);
    this.scrollToBottom();

    const aiResponse = await this.geminiService.generateVibeChatResponse(userMessage);
    
    this.messages.update(m => [...m, { author: 'ai', text: aiResponse }]);
    this.isLoading.set(false);
    this.scrollToBottom();
  }

  onQueryChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.currentQuery.set(target.value);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
        try {
            const el = this.chatContainer()?.nativeElement;
            if(el) {
                el.scrollTop = el.scrollHeight;
            }
        } catch {}
    }, 0);
  }
}
