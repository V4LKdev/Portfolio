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
  // Enhanced project details for detailed view
  status?: string;
  year?: string;
  duration?: string;
  team?: string;
  role?: string;
  links?: {
    demo?: string;
    github?: string;
    external?: string;
  };
  design?: {
    overview: string;
    challenges: string[];
    solutions: string[];
    images: string[];
  };
  code?: {
    architecture: string;
    keyFeatures: string[];
    codeSnippets: {
      title: string;
      language: string;
      code: string;
    }[];
  };
  implementation?: {
    process: string;
    timeline: {
      phase: string;
      duration: string;
      description: string;
    }[];
    challenges: string[];
    results: string[];
  };
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
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    status: 'Complete',
    year: '2024',
    duration: '4 months',
    team: 'Solo Project',
    role: 'Audio Programmer',
    links: {
      github: 'https://github.com/yourusername/music-framework',
      demo: 'https://your-demo-link.com'
    },
    design: {
      overview: 'The Music Game Framework was designed to bridge the gap between traditional music production and interactive gaming. The goal was to create a system that could dynamically respond to MIDI input while maintaining high performance in a real-time game environment.',
      challenges: [
        'Achieving real-time MIDI processing with minimal latency',
        'Creating an intuitive editor interface for non-programmers',
        'Balancing audio quality with performance requirements',
        'Synchronizing multiple audio systems within UE5\'s framework'
      ],
      solutions: [
        'Implemented multi-threaded MIDI processing pipeline',
        'Developed visual node-based editor for music system configuration',
        'Created custom audio buffer management for optimal performance',
        'Built seamless integration layer with UE5\'s MetaSounds system'
      ],
      images: [
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=800&q=80'
      ]
    },
    code: {
      architecture: 'Built using Unreal Engine 5 with a hybrid C++/Blueprint approach. Core MIDI processing and audio systems written in C++ for performance, while the editor tools and UI logic utilize Blueprints for rapid iteration.',
      keyFeatures: [
        'Real-time MIDI input processing with chord detection',
        'Custom synthesizer and sampler systems',
        'Dynamic music layering based on gameplay events',
        'Visual editor extension for runtime music system configuration',
        'Integration with UE5 MetaSounds for advanced audio processing'
      ],
      codeSnippets: [
        {
          title: 'MIDI Input Handler',
          language: 'cpp',
          code: `class MUSICFRAMEWORK_API UMidiInputHandler : public UObject
{
    GENERATED_BODY()

public:
    UFUNCTION(BlueprintCallable)
    void ProcessMidiMessage(const FMidiMessage& Message);
    
    UFUNCTION(BlueprintCallable)
    TArray<int32> DetectChord(const TArray<int32>& ActiveNotes);

private:
    TArray<int32> ActiveNotes;
    float LastNoteTime = 0.0f;
    
    void UpdateChordDetection();
    bool IsValidChord(const TArray<int32>& Notes);
};`
        },
        {
          title: 'Dynamic Music System',
          language: 'cpp',
          code: `void UMusicGameSystem::UpdateMusicLayers(EGameState GameState)
{
    switch(GameState)
    {
        case EGameState::Exploration:
            SetLayerIntensity("Ambient", 1.0f);
            SetLayerIntensity("Combat", 0.0f);
            break;
        case EGameState::Combat:
            SetLayerIntensity("Combat", 1.0f);
            FadeOutLayer("Ambient", 2.0f);
            break;
    }
}`
        }
      ]
    },
    implementation: {
      process: 'Development started with research into MIDI protocols and UE5 audio architecture. After establishing the core MIDI processing pipeline, I built the synthesizer components and integrated them with MetaSounds. The final phase focused on creating the editor tools and optimization.',
      timeline: [
        { phase: 'Research & Planning', duration: '2 weeks', description: 'MIDI protocol research and UE5 audio system analysis' },
        { phase: 'Core Systems', duration: '6 weeks', description: 'MIDI processing, synthesizer, and chord detection implementation' },
        { phase: 'Editor Tools', duration: '3 weeks', description: 'Visual editor extension and runtime configuration system' },
        { phase: 'Integration & Polish', duration: '3 weeks', description: 'MetaSounds integration and performance optimization' }
      ],
      challenges: [
        'Ensuring sub-10ms latency for real-time MIDI processing',
        'Managing memory allocation for audio buffers without garbage collection spikes',
        'Creating thread-safe communication between MIDI input and audio rendering threads',
        'Optimizing for both development and packaged game performance'
      ],
      results: [
        'Achieved consistent 5-8ms MIDI input latency',
        'Successfully processes up to 64 simultaneous MIDI channels',
        'Editor tools reduce music system setup time by 75%',
        'Integrated into 3 shipped game projects with positive developer feedback'
      ]
    }
  },
  {
    id: 'inkvocation',
    title: 'Inkvocation Prototype',
    category: 'Gameplay',
    type: 'solo',
    tags: ['UE5', 'C++', 'FPS', 'Platformer'],
    description: 'Fast-paced fps platformer with shape drawing and detection in UE5',
    details: 'Gameplay programming • Custom shape detection algorithms • C++ and UE5 implementation',
    image: 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?auto=format&fit=crop&w=800&q=80',
    status: 'In Progress',
    year: '2024',
    duration: '2 months',
    team: 'Solo Project',
    role: 'Gameplay Programmer',
    design: {
      overview: 'Inkvocation combines fast-paced FPS action with creative shape-drawing mechanics, where players draw symbols to cast spells and navigate through challenging platforming sections.',
      challenges: [
        'Accurate shape recognition in real-time gameplay',
        'Balancing drawing complexity with game pace',
        'Creating responsive platforming feel'
      ],
      solutions: [
        'Implemented machine learning-based shape recognition',
        'Created simplified gesture system for common actions',
        'Developed custom movement system with precise air control'
      ],
      images: [
        'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=800&q=80'
      ]
    }
  },
  {
    id: 'asymptomagickal',
    title: 'Asymptomagickal',
    category: 'Multiplayer',
    type: 'team',
    tags: ['UE5', 'Networking', 'Steam', 'Editor Tools'],
    description: 'Collaborative project with 3 People, implemented a replicated and interactive instanced static mesh and steam sessions integration. Developed a custom editor module for runtime editing of instanced meshes and additional data.',
    details: 'Grid system optimization • Networking (Steam & Iris) • Custom Unreal editor tools',
    image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=800&q=80',
    status: 'Complete',
    year: '2024',
    duration: '6 months',
    team: '3 developers',
    role: 'Network Programmer',
    design: {
      overview: 'A collaborative building game where players can construct complex structures together in real-time, with focus on seamless multiplayer experience and intuitive building tools.',
      challenges: [
        'Synchronizing thousands of building blocks across multiple clients',
        'Creating intuitive building interface for collaborative work',
        'Managing large-scale persistent world data'
      ],
      solutions: [
        'Implemented efficient instanced mesh replication system',
        'Created spatial partitioning for network optimization',
        'Developed custom editor tools for runtime world editing'
      ],
      images: [
        'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=800&q=80'
      ]
    }
  },
  {
    id: 'esoteric-instinct',
    title: 'Esoteric Instinct',
    category: 'Team Lead',
    type: 'team',
    tags: ['UE5', 'GAS', 'Multiplayer', 'Perforce'],
    description: 'Programming lead in a team of 12, developing a multiplayer game, focusing on gameplay, tool development, and the Gameplay Ability System.',
    details: 'Multiplayer systems • Gameplay Ability System (GAS) • Tool development • Version control with Perforce',
    image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=800&q=80',
    status: 'In Progress',
    year: '2024',
    duration: '8 months',
    team: '12 developers',
    role: 'Programming Lead',
    design: {
      overview: 'Leading the technical development of a multiplayer action game with complex ability systems and team-based gameplay mechanics.',
      challenges: [
        'Coordinating technical work across a large team',
        'Implementing complex multiplayer ability system',
        'Managing version control and build processes'
      ],
      solutions: [
        'Established clear coding standards and review processes',
        'Created automated build and testing pipeline',
        'Implemented modular ability system architecture'
      ],
      images: [
        'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=800&q=80'
      ]
    }
  }
];
