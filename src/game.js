var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    input: {
        activePointers: 3
    },
    pixelArt: true,
    backGroundColor: 0x000000,
    scene: {init: init, preload: preload, create: create, update: update, render: render}
}
var game = new Phaser.Game(config);
function init ()
{

}

function preload ()
{
    this.load.image('spr_bg', "src/assets/img/spr_bg.png")
}

function create ()
{
    this.add.image(0, 0, 'spr_bg').setOrigin(0, 0)
}

function update ()
{

}

function render ()
{

}