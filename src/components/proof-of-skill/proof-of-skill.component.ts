import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-proof-of-skill',
  standalone: true,
  template: `
    <div class="h-full p-6 md:p-8 bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl flex flex-col">
      <h2 class="text-3xl font-bold text-white mb-2">Proof of Skill Scanner</h2>
      <p class="text-gray-400 mb-6">Upload a code snippet or problem screenshot. My AI will analyze it.</p>

      <div class="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-purple-500/50 rounded-lg p-4 text-center bg-purple-500/5 transition-colors hover:bg-purple-500/10 hover:border-purple-500">
        <input type="file" id="skill-upload" class="hidden" (change)="onFileChange($event)" accept="image/png, image/jpeg, image/webp">
        <label for="skill-upload" class="cursor-pointer">
          <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          @if (uploadedImage()) {
            <p class="mt-2 text-sm text-gray-300">{{ fileName() }}</p>
          } @else {
            <p class="mt-2 text-sm text-cyan-400">Click to upload an image</p>
            <p class="text-xs text-gray-500">PNG, JPG, WEBP up to 4MB</p>
          }
        </label>
        @if(error()) {
          <p class="text-red-500 text-sm mt-2">{{error()}}</p>
        }
      </div>

      @if (uploadedImage()) {
        <div class="mt-6">
          <h3 class="font-semibold text-white">Image Preview:</h3>
          <img [src]="uploadedImage()" alt="Uploaded skill proof" class="mt-2 rounded-lg max-h-48 w-auto mx-auto border border-white/10">
        </div>
      }
      
      @if (isLoading() || analysisResult()) {
        <div class="mt-6 flex-grow">
          <h3 class="font-semibold text-white">AI Analysis:</h3>
          @if (isLoading()) {
            <div class="mt-2 p-4 bg-gray-800/50 rounded-lg animate-pulse">
                <div class="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div class="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          } @else if(analysisResult()) {
            <p class="mt-2 text-gray-300 p-4 bg-gray-800/50 rounded-lg whitespace-pre-wrap">{{ analysisResult() }}</p>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProofOfSkillComponent {
  private geminiService = inject(GeminiService);

  uploadedImage = signal<string | null>(null);
  analysisResult = signal<string | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  fileName = signal<string | null>(null);

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if(file.size > 4 * 1024 * 1024) {
        this.error.set("File is too large. Max size is 4MB.");
        return;
      }
      
      this.error.set(null);
      this.fileName.set(file.name);
      this.analysisResult.set(null);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImage.set(e.target.result);
        this.analyzeImage(file);
      };
      reader.readAsDataURL(file);
    }
  }
  
  private async analyzeImage(file: File) {
      if (!this.uploadedImage()) return;
      
      this.isLoading.set(true);

      // We need to strip the prefix `data:image/png;base64,`
      const base64Data = this.uploadedImage()!.split(',')[1];

      const result = await this.geminiService.analyzeSkillProof(base64Data, file.type);
      this.analysisResult.set(result);
      this.isLoading.set(false);
  }

}
