// Projects Data
// Contains all portfolio project information
// Edit this file to add, remove, or modify projects

// --- Tab/Section model for synchronized tabs ---
export type SectionType = "text" | "code" | "gallery" | "quote" | "video" | "spacer";

export interface BaseSection {
  id?: string;
  type: SectionType;
  // Rows across tabs align by this key. Examples: "top", "intro", "mid", "bottom".
  syncKey?: string;
}

export interface TextSection extends BaseSection {
  type: "text" | "quote";
  title?: string;
  body: string;
}

export interface CodeSection extends BaseSection {
  type: "code";
  title?: string;
  language: string;
  code: string;
}

export interface GallerySection extends BaseSection {
  type: "gallery";
  title?: string;
  images: string[];
}

export interface SpacerSection extends BaseSection {
  type: "spacer";
  // Optional min height; rows auto-size to tallest section across tabs.
  minHeight?: string;
}

export interface VideoSection extends BaseSection {
  type: "video";
  title?: string;
  // Either provide a YouTube ID (preferred) or a direct URL/embed.
  youtubeId?: string;
  url?: string;
}

export type Section =
  | TextSection
  | CodeSection
  | GallerySection
  | VideoSection
  | SpacerSection;

export interface ProjectTab {
  id: string; // e.g., "design" | "code" | "implementation"
  label: string;
  icon?: string; // lucide icon name (optional; can be mapped later)
  sections: Section[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  type: "solo" | "team" | "academic";
  tags: string[];
  description: string;
  details: string;
  image: string;
  // Optional URL/metadata helpers (backward-compatible)
  slug?: string; // if omitted, a slug will be derived from the title
  gamemode?: "singleplayer" | "multiplayer" | "competitive" | "sandbox"; // optional override; otherwise derived from project fields
  featured?: boolean;
  createdAt?: string; // ISO date string
  cover?: string; // optional card cover image (defaults to image)
  // Enhanced project details for detailed view (optional)
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
  // Optional: explicit tabbed content model with synchronized rows
  tabs?: ProjectTab[];
}

export const projects: Project[] = [
  {
    id: "music-framework",
    title: "Music Game Framework",
    category: "Audio Systems",
    type: "solo",
    tags: ["C++", "MIDI", "UE5", "MetaSounds"],
    description:
      "Built an interactive music system with MIDI input using a piano, able to detect notes and chords. Created a custom synthesizer, sampler, and chord generation. Editor Extension to manage level based dynamic music system.",
    details:
      "Custom audio systems • MIDI input handling • C++ and MetaSounds integration • Editor tools",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    slug: "music-game-framework",
    createdAt: "2024-06-15",
    featured: true,
    status: "Complete",
    year: "2024",
    duration: "4 months",
    team: "Solo Project",
    role: "Audio Programmer",
    links: {
      github: "https://github.com/yourusername/music-framework",
      demo: "https://your-demo-link.com",
    },
    design: {
      overview:
        "The Music Game Framework was designed to bridge the gap between traditional music production and interactive gaming. The goal was to create a system that could dynamically respond to MIDI input while maintaining high performance in a real-time game environment.",
      challenges: [
        "Achieving real-time MIDI processing with minimal latency",
        "Creating an intuitive editor interface for non-programmers",
        "Balancing audio quality with performance requirements",
        "Synchronizing multiple audio systems within UE5's framework",
      ],
      solutions: [
        "Implemented multi-threaded MIDI processing pipeline",
        "Developed visual node-based editor for music system configuration",
        "Created custom audio buffer management for optimal performance",
        "Built seamless integration layer with UE5's MetaSounds system",
      ],
      images: [
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=800&q=80",
      ],
    },
    code: {
      architecture:
        "Built using Unreal Engine 5 with a hybrid C++/Blueprint approach. Core MIDI processing and audio systems written in C++ for performance, while the editor tools and UI logic utilize Blueprints for rapid iteration.",
      keyFeatures: [
        "Real-time MIDI input processing with chord detection",
        "Custom synthesizer and sampler systems",
        "Dynamic music layering based on gameplay events",
        "Visual editor extension for runtime music system configuration",
        "Integration with UE5 MetaSounds for advanced audio processing",
  ],
      codeSnippets: [
        {
          title: "MIDI Input Handler",
          language: "cpp",
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
};`,
        },
        {
          title: "Dynamic Music System",
          language: "cpp",
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
}`,
        },
      ],
    },
    implementation: {
      process:
        "Development started with research into MIDI protocols and UE5 audio architecture. After establishing the core MIDI processing pipeline, I built the synthesizer components and integrated them with MetaSounds. The final phase focused on creating the editor tools and optimization.",
      timeline: [
        {
          phase: "Research & Planning",
          duration: "2 weeks",
          description: "MIDI protocol research and UE5 audio system analysis",
        },
        {
          phase: "Core Systems",
          duration: "6 weeks",
          description:
            "MIDI processing, synthesizer, and chord detection implementation",
        },
        {
          phase: "Editor Tools",
          duration: "3 weeks",
          description:
            "Visual editor extension and runtime configuration system",
        },
        {
          phase: "Integration & Polish",
          duration: "3 weeks",
          description: "MetaSounds integration and performance optimization",
        },
      ],
      challenges: [
        "Ensuring sub-10ms latency for real-time MIDI processing",
        "Managing memory allocation for audio buffers without garbage collection spikes",
        "Creating thread-safe communication between MIDI input and audio rendering threads",
        "Optimizing for both development and packaged game performance",
      ],
      results: [
        "Achieved consistent 5-8ms MIDI input latency",
        "Successfully processes up to 64 simultaneous MIDI channels",
        "Editor tools reduce music system setup time by 75%",
        "Integrated into 3 shipped game projects with positive developer feedback",
      ],
    },
    // Example synchronized tabs for Phase 2 engine testing
    tabs: [
      {
        id: "design",
        label: "Design",
        sections: [
          {
            type: "text",
            syncKey: "top",
            title: "Overview",
            body:
              "The framework targets dynamic, real-time response to MIDI input while maintaining performance and intuitive authoring tools.\n\nKey goals:\n- Low-latency input to sound pipeline (sub-10ms)\n- Authoring tools usable by non-programmers\n- Layered composition with smooth transitions\n\nWe evaluated multiple approaches and landed on a hybrid C++/Blueprint model for both performance and iteration speed.",
          },
          {
            type: "gallery",
            syncKey: "mid",
            title: "Core",
            images: [
              "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80",
            ],
          },
          {
            type: "text",
            syncKey: "bottom",
            title: "Details",
            body:
              "Focus on latency, clear visual feedback, and layered composition.\n\nFormatting demo:\n1) Emphasis on critical path: input → parse → route → play\n2) Use of bullet points and numbered lists\n3) Support for multi-paragraph content with intentional spacing.",
          },
          {
            type: "text",
            syncKey: "perf",
            title: "Performance",
            body:
              "We target sub-10ms end-to-end latency.\n\nNotes:\n- MIDI message batching with lock-free queues\n- Fixed-size audio buffers to reduce GC pressure\n- Profiling shows stable frame times under load",
          },
          {
            type: "gallery",
            syncKey: "editor-tools",
            title: "Editor Tools",
            images: [
              "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=800&q=80",
            ],
          },
          {
            type: "text",
            syncKey: "roadmap",
            title: "Roadmap",
            body:
              "Planned:\n- Preset library expansion\n- Live recording capture\n- Autosave sessions\n\nStretch goals:\n- OSC bridge\n- Built-in stem exporter",
          },
          {
            type: "gallery",
            syncKey: "field",
            title: "Field Recordings",
            images: [
              "https://images.unsplash.com/photo-1461783436728-0a921771469f?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
            ],
          },
          {
            type: "text",
            syncKey: "faq",
            title: "FAQ",
            body:
              "Q: Can designers tweak without code?\nA: Yes—Blueprint wrappers expose common controls.\n\nQ: How do you keep latency low?\nA: Lock-free queues and preallocated buffers.",
          },
        ],
      },
      {
        id: "code",
        label: "Code",
        sections: [
          {
            type: "text",
            syncKey: "top",
            title: "Overview",
            body:
              "Hybrid C++/Blueprint. Core MIDI pipeline in C++ with thread-safe buffers; UI/editor tools in Blueprints.\n\nDetails:\n- C++ handles hot loop and audio threading\n- Blueprints wrap exposed functions for designers\n- Editor module provides visual routing graph\n\nThe following snippets illustrate key areas.",
          },
          {
            type: "code",
            syncKey: "mid",
            title: "Core",
            language: "cpp",
            code: "class UMidiInputHandler {\npublic: void ProcessMidiMessage(const FMidiMessage& Msg); };\n",
          },
          {
            type: "code",
            syncKey: "bottom",
            title: "Details",
            language: "cpp",
            code: "void UMusicGameSystem::UpdateMusicLayers(EGameState S) { /* ... */ }\n",
          },
          {
            type: "code",
            syncKey: "perf",
            title: "Performance",
            language: "cpp",
            code: "// Pseudo-benchmark\nvoid Benchmark() {\n  const int N = 1'000'000;\n  volatile int sum = 0;\n  for (int i = 0; i < N; ++i) sum += i;\n}",
          },
          {
            type: "code",
            syncKey: "api",
            title: "API",
            language: "ts",
            code: "export interface MidiMessage { type: string; note: number; velocity: number }\nexport function process(msg: MidiMessage) { /* ... */ }\n",
          },
          {
            type: "text",
            syncKey: "changelog",
            title: "Changelog",
            body:
              "v1.2.0: Added editor hooks.\nv1.1.0: Improved chord detection.\nv1.0.0: Initial release.",
          },
          {
            type: "text",
            syncKey: "roadmap",
            title: "Roadmap",
            body:
              "Near-term:\n- Expand unit tests\n- Public SDK typings\n\nLong-term:\n- Modular DSP graph\n- Multi-device sync",
          },
          {
            type: "text",
            syncKey: "faq",
            title: "FAQ",
            body:
              "Q: Is there a C API?\nA: Not planned. C++/TS bindings cover most cases.\n\nQ: Supported sampling rates?\nA: 44.1kHz, 48kHz.",
          },
        ],
      },
      {
        id: "implementation",
        label: "Implementation",
        sections: [
          {
            type: "gallery",
            syncKey: "top",
            title: "Overview",
            images: [
              "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=800&q=80",
            ],
          },
          {
            type: "video",
            syncKey: "mid",
            title: "Core",
            youtubeId: "hoQno8UyHY4"
          },
          { type: "spacer", syncKey: "mid" },
          {
            type: "text",
            syncKey: "bottom",
            title: "Details",
            body:
              "Latency 5-8ms; 64 channels; editor tools sped up setup by 75%.\n\nNext steps:\n- Expand test suite for edge-case chords\n- Add more authoring presets\n- Publish a quick-start template.",
          },
          {
            type: "text",
            syncKey: "editor-tools",
            title: "Editor Tools",
            body:
              "The runtime config editor supports hot reload and undo/redo.\nIt stores graphs as JSON for portability and versioning.",
          },
          {
            type: "text",
            syncKey: "changelog",
            title: "Changelog",
            body:
              "v1.2.0: New import/export for presets.\nv1.1.0: Performance pass on audio thread.\nv1.0.0: Initial integration.",
          },
          {
            type: "text",
            syncKey: "deployment",
            title: "Deployment",
            body:
              "Built with UE5 shipping profile.\nContinuous integration runs smoke tests and content validation.",
          },
          {
            type: "text",
            syncKey: "roadmap",
            title: "Roadmap",
            body:
              "Rollout plan:\n- Dogfood in internal projects\n- Prepare marketplace package\n- Write migration guide",
          },
          {
            type: "text",
            syncKey: "faq",
            title: "FAQ",
            body:
              "Q: How do I report bugs?\nA: Open an issue with logs and reproduction steps.\n\nQ: Does it work offline?\nA: Yes.",
          },
        ],
      },
    ],
  },
  {
    id: "inkvocation",
    title: "Inkvocation Prototype",
    category: "Gameplay",
    type: "solo",
    tags: ["UE5", "C++", "FPS", "Platformer"],
    description:
      "Fast-paced fps platformer with shape drawing and detection in UE5",
    details:
      "Gameplay programming • Custom shape detection algorithms • C++ and UE5 implementation",
    image:
      "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?auto=format&fit=crop&w=800&q=80",
    slug: "inkvocation-prototype",
    createdAt: "2024-08-01",
    status: "In Progress",
    year: "2024",
    duration: "2 months",
    role: "Gameplay Programmer",
    design: {
      overview:
        "Inkvocation combines fast-paced FPS action with creative shape-drawing mechanics, where players draw symbols to cast spells and navigate through challenging platforming sections.",
      challenges: [
        "Accurate shape recognition in real-time gameplay",
        "Balancing drawing complexity with game pace",
        "Creating responsive platforming feel",
      ],
      solutions: [
        "Implemented machine learning-based shape recognition",
        "Created simplified gesture system for common actions",
        "Developed custom movement system with precise air control",
      ],
      images: [
        "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=800&q=80",
      ],
    },
    code: {
      architecture:
        "Built with UE5 using C++ for core gameplay systems and Blueprints for rapid prototyping of spell effects and UI elements. Its very cool!",
      keyFeatures: [
        "Real-time shape drawing and recognition system",
        "Fast-paced FPS movement with wall-running mechanics",
        "Dynamic spell casting based on drawn shapes",
        "Procedural platforming challenges",
      ],
      codeSnippets: [
        {
          title: "Shape Recognition System",
          language: "cpp",
          code: `class INKVOCATION_API UShapeRecognizer : public UObject
{
    GENERATED_BODY()

public:
    UFUNCTION(BlueprintCallable)
    ESpellType RecognizeShape(const TArray<FVector2D>& DrawnPoints);

private:
    float CalculateShapeScore(const TArray<FVector2D>& Points, ESpellType TargetShape);
    TArray<FVector2D> NormalizePoints(const TArray<FVector2D>& Points);
};`,
        },
      ],
    },
  },
  {
    id: "asymptomagickal",
    title: "Asymptomagickal",
    category: "Multiplayer",
    type: "team",
    tags: ["UE5", "Networking", "Steam", "Editor Tools"],
    description:
      "Collaborative project with 3 People, implemented a replicated and interactive instanced static mesh and steam sessions integration. Developed a custom editor module for runtime editing of instanced meshes and additional data.",
    details:
      "Grid system optimization • Networking (Steam & Iris) • Custom Unreal editor tools",
    image:
      "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=800&q=80",
    slug: "asymptomagickal",
    createdAt: "2024-04-10",
    featured: true,
    status: "Complete",
    year: "2024",
    duration: "6 months",
    team: "3 developers",
    role: "Network Programmer",
    implementation: {
      process:
        "Led the networking implementation for a collaborative building game. Focused on creating efficient replication systems for thousands of building blocks while maintaining smooth multiplayer experience.",
      timeline: [
        {
          phase: "Planning & Architecture",
          duration: "2 weeks",
          description:
            "Network architecture design and Steam integration planning",
        },
        {
          phase: "Core Networking",
          duration: "8 weeks",
          description:
            "Instanced mesh replication and Steam session management",
        },
        {
          phase: "Editor Tools",
          duration: "6 weeks",
          description: "Custom editor module for runtime mesh editing",
        },
        {
          phase: "Optimization & Testing",
          duration: "8 weeks",
          description: "Performance optimization and multiplayer testing",
        },
      ],
      challenges: [
        "Replicating thousands of building blocks efficiently",
        "Managing Steam session lifecycle and player connections",
        "Creating user-friendly editor tools for runtime editing",
        "Balancing network performance with visual fidelity",
      ],
      results: [
        "Supports up to 4 players building simultaneously",
        "Handles 10,000+ building blocks with stable performance",
        "Reduced network bandwidth usage by 60% through instancing",
        "Editor tools reduced development time by 40%",
      ],
    },
  },
  {
    id: "esoteric-instinct",
    title: "Esoteric Instinct",
    category: "Team Lead",
    type: "team",
    tags: ["UE5", "GAS", "Multiplayer", "Perforce"],
    description:
      "Programming lead in a team of 12, developing a multiplayer game, focusing on gameplay, tool development, and the Gameplay Ability System.",
    details:
      "Multiplayer systems • Gameplay Ability System (GAS) • Tool development • Version control with Perforce",
    image:
      "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=800&q=80",
    slug: "esoteric-instinct",
    createdAt: "2024-02-20",
    status: "In Progress",
    year: "2024",
    duration: "8 months",
    team: "12 developers",
    role: "Programming Lead",
    implementation: {
      process:
        "Leading the technical development of a multiplayer action game with complex ability systems. Managing a team of developers while implementing core gameplay systems and establishing development workflows.",
      timeline: [
        {
          phase: "Team Setup & Planning",
          duration: "4 weeks",
          description:
            "Team structure, coding standards, and technical architecture planning",
        },
        {
          phase: "Core Systems Development",
          duration: "12 weeks",
          description:
            "Gameplay Ability System implementation and multiplayer framework",
        },
        {
          phase: "Feature Development",
          duration: "16 weeks",
          description:
            "Game features, tools development, and team coordination",
        },
        {
          phase: "Polish & Optimization",
          duration: "8 weeks",
          description: "Performance optimization, bug fixes, and final polish",
        },
      ],
      challenges: [
        "Coordinating technical work across a large development team",
        "Implementing complex multiplayer ability systems with GAS",
        "Managing version control and build processes for 12 developers",
        "Balancing leadership responsibilities with hands-on programming",
      ],
      results: [
        "Successfully leading a team of 12 developers",
        "Established efficient development workflows and coding standards",
        "Implemented robust multiplayer ability system using GAS",
        "Reduced build conflicts by 80% through improved Perforce workflows",
      ],
    },
  },
  {
    id: "jam-echo-run",
    title: "Echo Run (Jam)",
    category: "Game Jam",
    type: "solo",
    tags: ["UE5", "Jam", "48h", "Prototype"],
    description:
      "A 48-hour game jam prototype where time-echoes of the player solve puzzles collaboratively.",
    details: "Time-loop mechanics • Rapid prototyping • Minimalist visuals",
    image:
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800&q=80",
    slug: "echo-run-jam",
    createdAt: "2023-11-05",
    status: "Complete",
    year: "2023",
    duration: "48 hours",
    role: "Solo Developer",
  },
];
