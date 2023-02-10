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

//Nessa função serão adicionados todos os objetos a serem usados no projeto
function preload ()
{   
    //carregamento de imagens
    //this.load.image(key, source)
    //key: será o nome da imagem, src: será a pasta de origem da imagem
    this.load.image('spr_bg', "src/assets/img/spr_bg.png")
    this.load.image('spr_player', 'src/assets/img/spr_player.png')

    //Carregamento de uma imagem q contenham sprites
    //this.load.spritesheet(key, src, {frameWidth, frameHeight})
    //assim como nas imagens, key e src se referem ao nome e origem respectivamente
    // frameWidth e framHeight se referem a largura e altura de respectivamente de cada frame dos sprites
    //No caso desse exemplo a imagem total tinha 80 de largura e 30 de altura, como são 5 imagens cada uma ficou com 16 de largura e 30 de altura
    this.load.spritesheet('spr_fire_fx', 'src/assets/img/spr_fire_fx.png', {
        frameWidth: 16,
        frameHeight: 30
    });
}

//Nessa função serão criados os objetos carregados na preload
function create ()
{
    //Adição da imagem de plano de fundo
    //this.add.image(x, y, key).setOrigin(pivotX, pivotY)
    //x e y: ponto da tela onde a imagem será inserida,
    //key: nome do objeto que será inserido
    //pivotX e pivotY: pontos de referencia da imagem que será usado ao inserir a mesma
    this.add.image(0, 0, 'spr_bg').setOrigin(0, 0)

    //Nesse caso foi criado um objeto obj_player e nele adicionada a imagem
    //diferente da imagem de fundo, a imagem do player foi adicionada no meio do eixo x e 10 pixels da parte inferior no eixo y
    //já seu ponto pivot no eixo x foi deslocado para o meio da imagem fazendo com q a imagem fique exatamente no centro do eixo x
    //o pivot do eixo y foi deslocado para sua parte inferior
    obj_player = this.add.image(400, 440, 'spr_player').setOrigin(0.5, 1);

    //Ao carregar imagens de sprites deverá ser criada uma animação
    //this.anims.create(key, frames, frameRate, repeat)
    //key: nome da animação
    //frames: frames que serão usados na animação, é usada a função this.anims.generateFrameNumbers(src), onde src é o arquivo dos sprites
    //frameRate: quantos quadros por segundo a animação irá rodar, será a velocidade da animação
    //repeat: irá informar se a animação irá ser repetida ao ser finalizada ou não. -1 irá fazer com q ela rode em loop
    this.anims.create({
        key: 'spr_fire_fx',
        frames: this.anims.generateFrameNumbers('spr_fire_fx'),
        frameRate: 24,
        repeat:-1
    });

    //Criado um objeto e inserido os sprites nele
    //como ponto de inserção foram usados os pontos x e y do obj_player (obj_player.x, obj_player.y), e a animação spr_fire_fx como fonte
    //Dessa forma, sempre que o jogador se movimentar a animação irá se mover junto
    //Já seus pontos pivots foram deslocados para a metade em cada eixo pra ficar logo embaixo da nave
    //obj_fire_fx = this.add.sprite(obj_player.x, obj_player.y, 'spr_fire_fx').setOrigin(0.5, 0.5);
    //Foram criados dois objetos reproduzindo a mesma animação para simular as duas turbinas da nave, uma de cada lado

    obj_fire_fx1 = this.add.sprite(obj_player.x, obj_player.y, 'spr_fire_fx').setOrigin(0.5, 0.5);
    obj_fire_fx2 = this.add.sprite(obj_player.x, obj_player.y, 'spr_fire_fx').setOrigin(0.5, 0.5);

    //Para finalizar usamos obj_fire_fx.anims.play(key, modo) para reproduzir a animação
    //onde key: é o nome da a nimação a ser reproduzida e modo será um booleano para reproduzir ou não, true como padrão
    obj_fire_fx1.anims.play('spr_fire_fx', true);
    obj_fire_fx2.anims.play('spr_fire_fx', true);

    //Criações dos cursores para a movimentação da nave
    cursors = this.input.keyboard.createCursorKeys();
}

//Função responsavel por atualizar a cada segundo
function update ()
{
    //ajuste dos pontos para cada animação ficar no local correto da nave
    obj_fire_fx1.x = obj_player.x - 15;
    obj_fire_fx1.y = obj_player.y + 3;
    obj_fire_fx2.x = obj_player.x + 15;
    obj_fire_fx2.y = obj_player.y + 3;

    //Movimentação da nave ao pressionar as teclas para a esquerda e direita
    if(cursors.right.isDown){obj_player.x += 5};
    if(cursors.left.isDown){obj_player.x -= 5};

    //Para impedir q a nave saia da tela devemos 
    if(obj_player.x < 35) {obj_player.x = 35};
    if(obj_player.x > 765) {obj_player.x = 765};
    
}

function render ()
{

}