// Projects Data
// Contains all portfolio project information
// Edit this file to add, remove, or modify projects

export interface Project {
  id: string;
  title: string;
  category: string;
  type: 'solo' | 'team' | 'academic';
  tags: string[];
  description: string;
  details: string;
  image: string;
}

export const projects: Project[] = [
  {
    id: 'music-framework',
    title: 'Music Game Framework',
    category: 'Audio Systems',
    type: 'solo',
    tags: ['C++', 'MIDI', 'UE5', 'MetaSounds'],
    description: 'Built an interactive music system with MIDI input using a piano, able to detect notes and chords. Created a custom synthesizer, sampler, and chord generation. Editor Extension to manage level based dynamic music system.',
    details: 'Custom audio systems • MIDI input handling • C++ and MetaSounds integration • Editor tools',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'inkvocation',
    title: 'Inkvocation Prototype',
    category: 'Gameplay',
    type: 'solo',
    tags: ['UE5', 'C++', 'FPS', 'Platformer'],
    description: 'Fast-paced fps platformer with shape drawing and detection in UE5',
    details: 'Gameplay programming • Custom shape detection algorithms • C++ and UE5 implementation',
    image: 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'asymptomagickal',
    title: 'Asymptomagickal',
    category: 'Multiplayer',
    type: 'team',
    tags: ['UE5', 'Networking', 'Steam', 'Editor Tools'],
    description: 'Collaborative project with 3 People, implemented a replicated and interactive instanced static mesh and steam sessions integration. Developed a custom editor module for runtime editing of instanced meshes and additional data.',
    details: 'Grid system optimization • Networking (Steam & Iris) • Custom Unreal editor tools',
    image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'esoteric-instinct',
    title: 'Esoteric Instinct',
    category: 'Team Lead',
    type: 'team',
    tags: ['UE5', 'GAS', 'Multiplayer', 'Perforce'],
    description: 'Programming lead in a team of 12, developing a multiplayer game, focusing on gameplay, tool development, and the Gameplay Ability System.',
    details: 'Multiplayer systems • Gameplay Ability System (GAS) • Tool development • Version control with Perforce',
    image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=800&q=80'
  }
];
