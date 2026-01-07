import { Component, ChangeDetectionStrategy } from '@angular/core';

interface TimelineItem {
  date: string;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  template: `
    <div class="p-6 md:p-8 bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl">
      <h2 class="text-3xl font-bold text-white mb-8">Career Trajectory</h2>
      <div class="relative border-l-2 border-cyan-500/30 ml-4">
        
        @for (item of timeline; track item.title) {
          <div class="mb-10 ml-8 group">
            <div class="absolute w-5 h-5 bg-gray-700 rounded-full -left-[11px] border-2 border-cyan-500 group-hover:bg-cyan-400 transition-colors duration-300"></div>
            <div class="p-4 bg-gray-800/50 border border-white/10 rounded-lg shadow-md transition-all duration-300 group-hover:shadow-cyan-500/20 group-hover:border-cyan-500/50 group-hover:scale-[1.02]">
              <time class="block mb-1 text-sm font-normal leading-none text-gray-400">{{ item.date }}</time>
              <h3 class="text-xl font-semibold text-white">{{ item.title }}</h3>
              <h4 class="text-md font-medium text-cyan-400 mb-2">{{ item.subtitle }}</h4>
              <p class="mb-3 text-base font-normal text-gray-300">{{ item.description }}</p>
              <div class="flex flex-wrap gap-2">
                @for (tech of item.tech; track tech) {
                  <span class="bg-gray-700 text-cyan-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{{ tech }}</span>
                }
              </div>
            </div>
          </div>
        }

      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  timeline: TimelineItem[] = [
    {
      date: '2022 - Present',
      title: 'Nexus AI',
      subtitle: 'Lead AI Engineer (Personal Project)',
      description: 'Architected a RAG-based document analysis system using Python, Gemini, and vector databases for advanced semantic search capabilities.',
      tech: ['Python', 'Gemini API', 'LangChain', 'Vector DB']
    },
    {
      date: '2020 - 2022',
      title: 'SwiftCart E-commerce',
      subtitle: 'Senior Frontend Developer (Freelance)',
      description: 'Built a high-performance e-commerce engine focusing on scalability and user experience with modern Jamstack architecture.',
      tech: ['Next.js', 'React', 'TypeScript', 'Vercel', 'Stripe']
    },
    {
      date: '2018 - 2020',
      title: 'Orbit Dashboard',
      subtitle: 'Data Visualization Engineer',
      description: 'Developed a real-time dashboard for tracking space debris, handling large data streams and visualizing them on an interactive 3D globe.',
      tech: ['Angular', 'D3.js', 'TypeScript', 'WebSockets']
    }
  ];
}
