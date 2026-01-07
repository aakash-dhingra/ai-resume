import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProofOfSkillComponent } from './components/proof-of-skill/proof-of-skill.component';
import { VibeChatComponent } from './components/vibe-chat/vibe-chat.component';
import { GeminiService } from './services/gemini.service';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="min-h-screen bg-black bg-grid-white/[0.05] relative flex flex-col items-center p-4 sm:p-8">
      <div class="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <main class="w-full max-w-5xl mx-auto z-10 flex flex-col gap-12 md:gap-20">
        <app-header></app-header>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <app-timeline></app-timeline>
          </div>
          <div>
            <app-proof-of-skill></app-proof-of-skill>
          </div>
        </div>
      </main>
      
      <app-vibe-chat></app-vibe-chat>

      <footer class="w-full text-center py-8 z-10 mt-16 text-gray-500">
        <p>Designed by AI, Built by Aakash Dhingra.</p>
        <p>This portfolio is powered by the Google Gemini API.</p>
      </footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeaderComponent,
    TimelineComponent,
    ProofOfSkillComponent,
    VibeChatComponent
  ],
})
export class AppComponent {}