// Main game initialization

let game;

// Cấu hình Phaser 3
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'phaser-game',
    backgroundColor: '#000000',
    scene: DroneShowScene,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

function initGame() {
    if (game) {
        game.destroy(true);
    }
    game = new Phaser.Game(config);
}

// Xử lý resize
window.addEventListener('resize', () => {
    if (game) {
        game.scale.resize(window.innerWidth, window.innerHeight);
    }
});

// Khởi động game
initGame();
