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

//Variável de controle para atirar
var playerPodeAtirar = 1;

//Variável de controle para criação dos tiros
var qtdeTiros = 0

//Dois tiros poderão ser disparados por vez
var laser1Ativo = 0;
var laser2Ativo = 0;

var strDebug;

//Variável para cronometrar o tempo em que o flare ficara visivel
var flareTimer = 0;

function init ()
{

}

//Nessa função serão adicionados todos os objetos a serem usados no projeto
function preload ()
{   
    //carregamento de imagens
    //this.load.image(key, source)
    //key: será o nome da imagem, src: será a pasta de origem da imagem
    //Imagem do background
    this.load.image('spr_bg', "src/assets/img/spr_bg.png")
    //Imagem da nave do jogador
    this.load.image('spr_player', 'src/assets/img/spr_player.png')
    //Imagem do laser
    this.load.image('spr_laser', 'src/assets/img/spr_laser.png')
    //Imagem do flare do tiro
    this.load.image('spr_flare', 'src/assets/img/spr_flare.png')

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

    //Depth são as camadas onde os objetos são criados, por padrão todos são criados na 0 e na ordem em q são inseridos
    //Jogamos os objetos do player e das animações das turbinas para a camada 1 ficando assim em uma camada acima dos lasers quando forem criados
    obj_player.depth = 1;
    obj_fire_fx1.depth = 1;
    obj_fire_fx2.depth = 1;


    //Criação da variável de DEBUG
    strDebug = this.add.text(400, 5, '-DEBUG-', {
        fontFamily: 'Verdana',
        fontSize: '20px',
        fill: '#FFFFFF'
    }).setOrigin(0.5,0);

    //Criação do flare dos tiros
    obj_flare = this.add.image(obj_player.x, obj_player.y-55, 'spr_flare').setOrigin(0.5, 0.5);
    obj_flare.visible = 0;

}

//Função responsavel por atualizar a cada segundo
function update ()
{
    //ajuste dos pontos para cada animação ficar no local correto da nave
    obj_fire_fx1.x = obj_player.x - 15;
    obj_fire_fx1.y = obj_player.y + 3;
    obj_fire_fx2.x = obj_player.x + 15;
    obj_fire_fx2.y = obj_player.y + 3;

    //If que faz com q a imagem do flare se decremente no alpha, x e y ate sumir completamente
    if(flareTimer > 0) {
        flareTimer -=0.1;
        obj_flare.alpha = flareTimer;
        obj_flare.scaleX = flareTimer;
        obj_flare.scaleY = flareTimer;
    } else {
        obj_flare.visible = 0
    }

    //Movimentação da nave ao pressionar as teclas para a esquerda e direita
    if(cursors.right.isDown){obj_player.x += 5};
    if(cursors.left.isDown){obj_player.x -= 5};

    //Movimentação do flare junto com a nave
    obj_flare.x = obj_player.x;
    obj_flare.y = obj_player.y-55;  

    //Para impedir que a nave saia da tela devemos travar seu ponto x para q fique dentro dos limites
    //como a imagem da nave tem 70 pixels e seu ponto pivot x está no seu centro, travamos 35 pixels de cada lado para impedir q ela saia da tela
    if(obj_player.x < 35) {obj_player.x = 35};
    if(obj_player.x > 765) {obj_player.x = 765};

    //Ao clicar no botão espaço, será criado um objeto nos pontos x e y do obj_player usando como fonte o spr_laser e usando como ponto
    //  pivot seu ponto central no eixo x e seu ponto superior no eixo y
    //-------Aqui é criado um problema, se o código ficar apenas assim será criado um laser sempre q a tecla espaço for pressionada,
    //-------e se for mantida pressionada serão criados lasers sem parar 
    //-------para corrigir esse problema será criada uma variável de controle q será ativada ao atirar e desativada ao soltar a tecla
    
    //Código antigo com o problema de atirar sem parar
    // if(cursors.space.isDown){
    //     obj_laser = this.add.image(obj_player.x, obj_player.y, 'spr_laser').setOrigin(0.5, 1)
    // }
    

    //Código com o problema resolvido
    //Adicionada a verificação para permitir apenas dois tiros
    if(cursors.space.isDown && playerPodeAtirar == 1 && qtdeTiros < 2){
        if(qtdeTiros <= 1 && laser1Ativo == 0) {
            obj_laser1 = this.add.image(obj_player.x, obj_player.y, 'spr_laser').setOrigin(0.5, 1);
            obj_flare.visible = 1;
            flareTimer = 1;
            laser1Ativo = 1;
        }
        if(qtdeTiros == 1 && laser2Ativo == 0) {
            obj_laser2 = this.add.image(obj_player.x, obj_player.y, 'spr_laser').setOrigin(0.5, 1);
            obj_flare.visible = 1;
            flareTimer = 1;
            laser2Ativo = 1;
        }
        qtdeTiros++;
        playerPodeAtirar = 0
    }

    //Resetando a variavel de controle ao soltar a tecla espaçao para que o jogador possa atirar novamente
    if(cursors.space.isUp){playerPodeAtirar = 1}

    //Variando o eixo y do laser para q ele se movimente na tela
    //-----Isso irá causar um outro problema, pois o obj_laser só será criado ao pressionar a tecla espaço,
    //-----então ao iniciar o jogo será apresentado um erro pelo objeto ainda não ter sido instanciado
    //-----Para resolver esse problema serpa criada uma variável de controle para saber se já foi dado algum tiro
    //Código antigo com problema
    //obj_laser.y--;

    //código novo com erro solucionado
    //A variável qtdeTiros também deverá ser alterada quando um tiro for dado
    // if(qtdeTiros > 0 ) {obj_laser.y--};
    //Código alterado para dois tiros
    if(laser1Ativo == 1){
        obj_laser1.y-=10; //y-=10 para aumentar a velocidade de subida do laser
        if(obj_laser1.y < -70){ //Destruir o obj_laser1 ao atingir determinada altura
            obj_laser1.destroy()
            laser1Ativo = 0
            qtdeTiros --
        }
    }

    if(laser2Ativo == 1){
        obj_laser2.y-=10;
        if(obj_laser2.y < -70){
            obj_laser2.destroy()
            laser2Ativo = 0
            qtdeTiros --
        }
    };

    strDebug.setText(
        'SInvaders' + '\n' +
        'Qtde de Tiros: ' + qtdeTiros + '\n' +
        'laser1Ativo: ' + laser1Ativo + '\n' +
        'laser2Ativo: ' + laser2Ativo
    )
}
 

function render ()
{

}