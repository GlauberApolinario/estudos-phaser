class Enemy extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, sprite){
        super(scene, x, y, sprite).setOrigin(0.5, 0.5);
        scene.add.existing(this);
    }
    update() {
        //Movimentando o bloco de inimigos de acordo com a movimentação criada para o agente de verificação
        this.x = (obj_agent.x - agentOldX) + this.x
        this.y = (obj_agent.y - agentOldY) + this.y

        //Variáveis para verificar a distancia dos lasers com os inimigos
        var DistLaser1;
        var DistLaser2;
        //Verificando cada um dos dois lasers 
        if(laser1Ativo == 1){
            DistLaser1 = Phaser.Math.Distance.Between(obj_laser1.x, obj_laser1.y, this.x, this.y);
        }
        if(laser2Ativo == 1){
            DistLaser2 = Phaser.Math.Distance.Between(obj_laser2.x, obj_laser2.y, this.x, this.y)
        }
        //Se o laser acertar o inimigo devera destruir o objeto e destruir tbm o objeto do laser
        //assim como atulizar os estados e quantidades dos tiros
        if(DistLaser1 < 30){
            this.destroy();
            obj_laser1.destroy();
            laser1Ativo = -1;
            qtdeTiros --;
        };  
        if(DistLaser2 < 30){
            this.destroy();
            obj_laser2.destroy();
            laser2Ativo = -1;
            qtdeTiros --;
        };
    }
}