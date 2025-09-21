/**
 * CIVIKA Audio Manager
 * Handles background music and sound effects with level-specific audio
 */

interface AudioSettings {
    masterVolume: number;
    musicVolume: number;
    effectsVolume: number;
    enableMusic: boolean;
    enableEffects: boolean;
}

export class AudioManager {
    private static instance: AudioManager;
    private audioContext: AudioContext | null = null;
    private currentMusic: HTMLAudioElement | null = null;
    private soundEffects: Map<string, HTMLAudioElement> = new Map();
    private settings: AudioSettings = {
        masterVolume: 0.7,
        musicVolume: 0.8,
        effectsVolume: 0.9,
        enableMusic: true,
        enableEffects: true,
    };
    private isInitialized = false;

    // Level-specific music mapping
    private levelMusic = {
        MainMenu: "menu-theme.mp3",
        BarangayMap: "menu-theme.mp3",
        CityMap: "menu-theme.mp3",
        Quiz: "quiz-theme.mp3",
        Mission: "mission-theme.mp3",
    };

    // Sound effects mapping
    private soundEffectsMap = {
        "button-click": "button-click1.mp3",
        "mission-complete": "mission-complete.wav",
        "quiz-correct": "quiz-correct.wav",
        "quiz-wrong": "quiz-wrong.wav",
        "level-up": "level-up.wav",
        "coin-collect": "coin-collect.wav",
        "badge-earned": "badge-earned.wav",
        "npc-interact": "npc-interact.wav",
        "menu-open": "button-click.mp3",
        "menu-close": "button-click.mp3",
    };

    private constructor() {
        this.loadSettings();
        this.setupEventListeners();
    }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    /**
     * Initialize audio context (must be called after user interaction)
     */
    public async initialize(): Promise<void> {
        console.log("🎵 AudioManager: Starting initialization...");

        if (this.isInitialized) {
            console.log("🎵 AudioManager: Already initialized");
            return;
        }

        try {
            console.log("🎵 AudioManager: Loading settings...");
            // Load settings first
            this.loadSettings();
            console.log("🎵 AudioManager: Settings loaded:", this.settings);

            // Set up event listeners
            this.setupEventListeners();

            console.log("🎵 AudioManager: Creating audio context...");
            // Create audio context
            this.audioContext = new (window.AudioContext ||
                (window as any).webkitAudioContext)();

            console.log("🎵 AudioContext state:", this.audioContext.state);

            // Resume audio context if suspended (required by some browsers)
            if (this.audioContext.state === "suspended") {
                console.log("🎵 AudioContext suspended, resuming...");
                await this.audioContext.resume();
                console.log(
                    "🎵 AudioContext resumed, new state:",
                    this.audioContext.state
                );
            }

            console.log("🎵 AudioManager: Preloading sound effects...");
            // Preload sound effects
            await this.preloadSoundEffects();

            this.isInitialized = true;
            console.log("🎵 ✅ Audio Manager initialized successfully");
            console.log("🎵 Final settings:", this.settings);

            // Set up global audio manager reference
            window.gameAudioManager = {
                setMasterVolume: (volume: number) =>
                    this.setMasterVolume(volume),
                setMusicVolume: (volume: number) => this.setMusicVolume(volume),
                setEffectsVolume: (volume: number) =>
                    this.setEffectsVolume(volume),
                setMusicEnabled: (enabled: boolean) =>
                    this.setMusicEnabled(enabled),
                setEffectsEnabled: (enabled: boolean) =>
                    this.setEffectsEnabled(enabled),
            };
        } catch (error) {
            console.error("🎵 ❌ Failed to initialize audio:", error);
        }
    }

    /**
     * Load settings from localStorage
     */
    private loadSettings(): void {
        try {
            const savedSettings = localStorage.getItem("civika-settings");
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                this.settings = { ...this.settings, ...parsed };
            }
        } catch (error) {
            console.error("Failed to load audio settings:", error);
        }
    }

    /**
     * Set up event listeners for settings changes
     */
    private setupEventListeners(): void {
        window.addEventListener("civika-settings-changed", (event: any) => {
            if (event.detail) {
                this.updateSettings(event.detail);
            }
        });
    }

    /**
     * Update audio settings
     */
    private updateSettings(newSettings: Partial<AudioSettings>): void {
        this.settings = { ...this.settings, ...newSettings };
        this.applyVolumeSettings();
    }

    /**
     * Apply volume settings to current audio
     */
    private applyVolumeSettings(): void {
        if (this.currentMusic) {
            this.currentMusic.volume = this.calculateVolume("music");
        }
    }

    /**
     * Calculate effective volume based on settings
     */
    private calculateVolume(type: "music" | "effects"): number {
        const baseVolume =
            type === "music"
                ? this.settings.musicVolume
                : this.settings.effectsVolume;
        const isEnabled =
            type === "music"
                ? this.settings.enableMusic
                : this.settings.enableEffects;

        return isEnabled ? baseVolume * this.settings.masterVolume : 0;
    }

    /**
     * Preload sound effects
     */
    private async preloadSoundEffects(): Promise<void> {
        const loadPromises = Object.entries(this.soundEffectsMap).map(
            async ([key, filename]) => {
                try {
                    const audio = new Audio(`/assets/audio/${filename}`);
                    audio.preload = "auto";
                    audio.volume = this.calculateVolume("effects");
                    this.soundEffects.set(key, audio);
                    console.log("sounds loaded", filename);
                } catch (error) {
                    console.warn(
                        `Failed to preload sound effect: ${filename}`,
                        error
                    );
                }
            }
        );

        await Promise.allSettled(loadPromises);
        console.log(`Preloaded ${this.soundEffects.size} sound effects`);
    }

    /**
     * Play background music for a specific level
     */
    public playLevelMusic(level: keyof typeof this.levelMusic): void {
        console.log(`🎵 Attempting to play music for level: ${level}`);
        console.log(`🎵 Audio initialized: ${this.isInitialized}`);
        console.log(`🎵 Music enabled: ${this.settings.enableMusic}`);

        if (!this.settings.enableMusic || !this.isInitialized) {
            console.warn(
                `🎵 Music blocked - Initialized: ${this.isInitialized}, Enabled: ${this.settings.enableMusic}`
            );
            return;
        }

        const musicFile = this.levelMusic[level];
        if (!musicFile) {
            console.warn(`🎵 No music defined for level: ${level}`);
            return;
        }

        console.log(`🎵 Loading music file: ${musicFile}`);

        // Stop current music
        this.stopMusic();

        try {
            // Create new audio element
            const audioPath = `/assets/audio/${musicFile}`;
            console.log(`🎵 Audio path: ${audioPath}`);

            this.currentMusic = new Audio(audioPath);
            this.currentMusic.loop = true;
            this.currentMusic.volume = this.calculateVolume("music");

            console.log(
                `🎵 Audio element created, volume: ${this.currentMusic.volume}`
            );

            // Add event listeners for debugging
            this.currentMusic.addEventListener("loadstart", () => {
                console.log(`🎵 Audio loadstart: ${musicFile}`);
            });

            this.currentMusic.addEventListener("loadeddata", () => {
                console.log(`🎵 Audio loaded: ${musicFile}`);
            });

            this.currentMusic.addEventListener("error", (e) => {
                console.error(`🎵 Audio error: ${musicFile}`, e);
            });

            // Play music
            const playPromise = this.currentMusic.play();
            if (playPromise) {
                playPromise
                    .then(() => {
                        console.log(
                            `🎵 ✅ Music started successfully: ${musicFile}`
                        );
                    })
                    .catch((error) => {
                        console.warn(
                            `🎵 ❌ Failed to play music: ${musicFile}`,
                            error
                        );

                        // Try to handle autoplay restrictions
                        if (error.name === "NotAllowedError") {
                            console.log(
                                `🎵 Autoplay blocked for ${musicFile}. Music will start after user interaction.`
                            );
                        }
                    });
            }

            console.log(
                `🎵 Playing background music for ${level}: ${musicFile}`
            );
        } catch (error) {
            console.error(`🎵 Error playing level music:`, error);
        }
    }

    /**
     * Stop current background music
     */
    public stopMusic(): void {
        console.log("🎵 Stopping current music...");
        if (this.currentMusic) {
            console.log("🎵 Current music found, stopping...");
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
            console.log("🎵 ✅ Music stopped successfully");
        } else {
            console.log("🎵 No current music to stop");
        }
    }

    /**
     * Play a sound effect
     */
    public playEffect(effectName: keyof typeof this.soundEffectsMap): void {
        if (!this.settings.enableEffects || !this.isInitialized) return;

        const effect = this.soundEffects.get(effectName);
        if (effect) {
            try {
                effect.currentTime = 0; // Reset to beginning
                effect.volume = this.calculateVolume("effects");
                const playPromise = effect.play();
                if (playPromise) {
                    playPromise.catch((error) => {
                        console.warn(
                            `Failed to play sound effect: ${effectName}`,
                            error
                        );
                    });
                }
            } catch (error) {
                console.warn(
                    `Error playing sound effect: ${effectName}`,
                    error
                );
            }
        } else {
            console.warn(`Sound effect not found: ${effectName}`);
        }
    }

    /**
     * Set master volume
     */
    public setMasterVolume(volume: number): void {
        this.settings.masterVolume = Math.max(0, Math.min(1, volume));
        this.applyVolumeSettings();
    }

    /**
     * Set music volume
     */
    public setMusicVolume(volume: number): void {
        this.settings.musicVolume = Math.max(0, Math.min(1, volume));
        this.applyVolumeSettings();
    }

    /**
     * Set effects volume
     */
    public setEffectsVolume(volume: number): void {
        this.settings.effectsVolume = Math.max(0, Math.min(1, volume));
        // Update all effect volumes
        this.soundEffects.forEach((effect) => {
            effect.volume = this.calculateVolume("effects");
        });
    }

    /**
     * Enable/disable music
     */
    public setMusicEnabled(enabled: boolean): void {
        this.settings.enableMusic = enabled;
        if (!enabled) {
            this.stopMusic();
        }
        this.applyVolumeSettings();
    }

    /**
     * Enable/disable sound effects
     */
    public setEffectsEnabled(enabled: boolean): void {
        this.settings.enableEffects = enabled;
    }

    /**
     * Get current settings
     */
    public getSettings(): AudioSettings {
        return { ...this.settings };
    }

    /**
     * Fade out current music
     */
    public fadeOutMusic(duration: number = 1000): Promise<void> {
        console.log(`🎵 🔇 Starting fade out (${duration}ms)...`);

        return new Promise((resolve) => {
            if (!this.currentMusic) {
                console.log("🎵 No music to fade out");
                resolve();
                return;
            }

            const startVolume = this.currentMusic.volume;
            const fadeStep = startVolume / (duration / 50);

            console.log(
                `🎵 Fade out - Start volume: ${startVolume}, Step: ${fadeStep}`
            );

            const fadeInterval = setInterval(() => {
                if (this.currentMusic && this.currentMusic.volume > fadeStep) {
                    this.currentMusic.volume -= fadeStep;
                    console.log(
                        `🎵 Fading... volume: ${this.currentMusic.volume.toFixed(
                            2
                        )}`
                    );
                } else {
                    console.log("🎵 Fade complete, stopping music");
                    clearInterval(fadeInterval);
                    this.stopMusic();
                    resolve();
                }
            }, 50);
        });
    }

    /**
     * Crossfade to new level music
     */
    public async crossfadeToLevel(
        level: keyof typeof this.levelMusic,
        fadeDuration: number = 1000
    ): Promise<void> {
        console.log(`🎵 🔄 Crossfading to level: ${level}`);
        console.log(
            `🎵 Current music before crossfade:`,
            this.currentMusic?.src || "None"
        );

        // Fade out current music
        await this.fadeOutMusic(fadeDuration / 2);

        console.log(`🎵 Fade out complete, starting new music for: ${level}`);

        // Start new music
        this.playLevelMusic(level);
    }
}

// Initialize global audio manager instance
export const audioManager = AudioManager.getInstance();
