import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import StartGame from "./game/main";
import { EventBus } from "./game/EventBus";

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps {
    currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
    function PhaserGame({ currentActiveScene }, ref) {
        const game = useRef<Phaser.Game | null>(null!);

        useLayoutEffect(() => {
            if (game.current === null) {
                game.current = StartGame("game-container");

                if (typeof ref === "function") {
                    ref({ game: game.current, scene: null });
                } else if (ref) {
                    ref.current = { game: game.current, scene: null };
                }
            }

            return () => {
                if (game.current) {
                    game.current.destroy(true);
                    if (game.current !== null) {
                        game.current = null;
                    }
                }
            };
        }, [ref]);

        useEffect(() => {
            EventBus.on(
                "current-scene-ready",
                (scene_instance: Phaser.Scene) => {
                    if (
                        currentActiveScene &&
                        typeof currentActiveScene === "function"
                    ) {
                        currentActiveScene(scene_instance);
                    }

                    if (typeof ref === "function") {
                        ref({ game: game.current, scene: scene_instance });
                    } else if (ref) {
                        ref.current = {
                            game: game.current,
                            scene: scene_instance,
                        };
                    }
                }
            );

            // Listen for game data updates
            EventBus.on("game-data-updated", () => {
                if (
                    game.current &&
                    currentActiveScene &&
                    typeof currentActiveScene === "function"
                ) {
                    // Get the current scene and trigger update
                    const currentScene = game.current.scene.getScenes(true)[0];
                    if (currentScene) {
                        currentActiveScene(currentScene);
                    }
                }
            });

            return () => {
                EventBus.removeListener("current-scene-ready");
                EventBus.removeListener("game-data-updated");
            };
        }, [currentActiveScene, ref]);

        return <div id="game-container"></div>;
    }
);
