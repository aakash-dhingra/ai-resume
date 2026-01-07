import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="relative w-full h-[400px] md:h-[350px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/10 p-6 md:p-8 flex flex-col justify-between">
      <div class="absolute inset-0 bg-black/50 z-10"></div>
      
      @if (isLoading()) {
        <div class="absolute inset-0 flex items-center justify-center bg-black/70 z-30">
            <div class="loader"></div>
            <p class="ml-4 text-cyan-400 animate-pulse">Generating futuristic branding...</p>
        </div>
        <style>
          .loader {
            border: 4px solid rgba(255, 255, 255, 0.2);
            border-left-color: #22d3ee;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      }

      @if (headerImageUrl()) {
        <img [src]="headerImageUrl()" alt="AI Generated Header" class="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000" [class.opacity-0]="isLoading()" [class.opacity-100]="!isLoading()">
      }

      <div class="relative z-20">
        <h1 class="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">AAKASH DHINGRA</h1>
        <p class="text-xl md:text-2xl text-cyan-300 drop-shadow-md">Lead Full-Stack & AI Engineer</p>
      </div>

      <div class="relative z-20 w-full max-w-md self-center">
        <p class="text-center text-white/80 mb-2 text-sm">See how I'd brand for your company. Enter name:</p>
        <div class="flex gap-2 bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-2 shadow-lg">
          <input 
            type="text" 
            [value]="companyName()"
            (input)="onInputChange($event)"
            (keyup.enter)="onEnterPress()"
            placeholder="e.g., Google, OpenAI, NASA" 
            class="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none px-2">
          <button 
            (click)="generateNewHeader()" 
            [disabled]="isLoading()"
            class="bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-600 text-black font-bold py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center">
            @if (isLoading()) {
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            } @else {
              <span>Generate</span>
            }
          </button>
        </div>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private geminiService = inject(GeminiService);

  companyName = signal('Google');
  headerImageUrl = signal<string | null>('https://picsum.photos/1280/720?grayscale&blur=2');
  isLoading = signal(false);

  async generateNewHeader() {
    if (!this.companyName() || this.isLoading()) return;
    
    this.isLoading.set(true);
    this.headerImageUrl.set(null);

    const imageUrl = await this.geminiService.generateHeaderImage(this.companyName());

    this.headerImageUrl.set(imageUrl || 'https://picsum.photos/1280/720?grayscale&blur=2&random=1');
    this.isLoading.set(false);
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.companyName.set(input.value);
  }

  onEnterPress() {
    this.generateNewHeader();
  }
}
