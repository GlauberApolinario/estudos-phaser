class Enemy extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, sprite){
        super(scene, x, y, sprite).setOrigin(0.5, 0.5);
        scene.add.existing(this);
    }
    update() {

    }
}