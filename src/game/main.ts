import { Boot } from "./scenes/Boot";
import { Preloader } from "./scenes/Preloader";
import { MainMenu } from "./scenes/MainMenu";
import { CharacterCreation } from "./scenes/CharacterCreation";
import { BarangayMap } from "./scenes/BarangayMap";
import { CityMap } from "./scenes/CityMap";
import { QuizSystem } from "./scenes/QuizSystem";
import { AUTO, Game } from "phaser";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: "100%",
    height: "100%",
    parent: "game-container",
    backgroundColor: "#87CEEB", // Sky blue like Pokémon
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: "100%",
        height: "100%",
        min: {
            width: 320,
            height: 240,
        },
        max: {
            width: 1920,
            height: 1080,
        },
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0, x: 0 },
            debug: false,
        },
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        CharacterCreation,
        BarangayMap,
        CityMap,
        QuizSystem,
    ],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;

