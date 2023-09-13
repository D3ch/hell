class BattleWindow extends PopupWindow
{
    layerName = "Battle"; // Used as key in activeLayers
    domElementId = "BATTLED"; // ID of dom element that gets shown or hidden
    context = BA;         // Canvas rendering context for popup

    constructor(boundingBox, worldIndex)
    {
        super(boundingBox); // Need to call base class constructor
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        for(var i = 0; i < 16; i++)
        {
            var column = Math.floor(i / 4);
            var entry = i % 4;

            this.addHitbox(new Hitbox(
                {
                    x: this.boundingBox.width * (0.04 + (0.227 * column)),     // Copied from renderButton call below
                    y: this.boundingBox.height * (.626 + (0.063 * entry)),
                    width: this.boundingBox.width * 0.219,
                    height: this.boundingBox.height * 0.05
                },
                {
                    onmousedown: function ()
                    {
                        var weaponIndex = parseInt(this.id.split("_")[1]);
                        if(battleInventory[weaponIndex].length > 0)
                        {
                            atk(weaponIndex);
                        }
                    }
                },
                'pointer',
                "weaponButton_" + i
            ));
        }

        this.closeButton = this.addHitbox(new Button(
            closei, "", "", "",
            {
                x: this.boundingBox.width * .93,
                y: 0,
                width: this.boundingBox.width * .06,
                height: this.boundingBox.width * .06
            },
            {
                onmousedown: function ()
                {
                    lostBattle();
                    if(!mutebuttons) closeAudio[rand(0, closeAudio.length - 1)].play();
                }
            },
            'pointer',
            "closeButton"
        ));
    }

    render()
    {
        this.context.save();
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.context.drawImage(battleBackground, 0, 0, 595, 520, 0, this.boundingBox.height * 0.02, this.boundingBox.width, this.boundingBox.height * .98);
        this.context.fillStyle = "#FFFFFF";

        for(var bi = 0; bi < 16; bi++)
        {
            var column = Math.ceil((bi + 1) / 4);
            var entry = bi % 4;

            if(battleInventory[bi])
            {
                if(battleInventory[bi][0] > -1)
                {
                    var isWeaponCharged = false;
                    var pcentAtk = 0;
                    var weaponChargeX = this.boundingBox.width * (0.087 + ((column - 1) * 0.228));
                    var weaponChargeY = this.boundingBox.height * (.693 + (.0623 * (entry - 1)));
                    var weaponChargeWidth = this.boundingBox.width * .173;
                    var weaponChargeHeight = this.boundingBox.height * .05;

                    if((currentTime() - atkWeps[bi]) >= getInventoryWeaponSpeed(bi))
                    {
                        isWeaponCharged = true; pcentAtk = 1;
                    }
                    else
                    {
                        pcentAtk = ((currentTime() - atkWeps[bi]) / getInventoryWeaponSpeed(bi));
                    }

                    this.context.fillStyle = "#dddddd";
                    this.context.globalAlpha = 0.8;
                    this.context.fillRect(weaponChargeX, weaponChargeY, (weaponChargeWidth * pcentAtk), this.boundingBox.height * .05);
                    this.context.globalAlpha = 1;

                    this.context.drawImage(getInventoryWeaponIcon(bi), 0, 0, 50, 50, this.boundingBox.width * (0.04 + ((column - 1) * 0.227)), weaponChargeY, this.boundingBox.width * .044, this.boundingBox.height * .05);
                    if(isWeaponCharged)
                    {
                        this.context.drawImage(titlelight, 2, Math.abs(7 - ((Math.floor(currentTime() / 50) + bi) % 15)), 1, 1, weaponChargeX, weaponChargeY, weaponChargeWidth, weaponChargeHeight);
                        this.context.fillStyle = "#77cc77";
                        this.context.globalAlpha = 0.5;
                        this.context.fillRect(weaponChargeX, weaponChargeY, weaponChargeWidth, weaponChargeHeight);
                        this.context.globalAlpha = 1;
                    }
                }
            }
        }


        this.context.drawImage(monsterStats[monsterID][6], monsterStats[monsterID][9] * (Math.floor(currentTime() / 100) % 3), 0, monsterStats[monsterID][9], monsterStats[monsterID][9], this.boundingBox.width * .4, this.boundingBox.height * .15, (this.boundingBox.width * .25), this.boundingBox.height * .45);


        this.context.fillStyle = "#991111";
        this.context.fillRect(this.boundingBox.width * .04, this.boundingBox.height * .065, (this.boundingBox.width * .905 * (monsterHP / monsterMaxHP)), this.boundingBox.height * .051);
        this.context.fillStyle = "#ffffff";

        this.context.fillText(beautifynum(monsterHP) + "/" + beautifynum(monsterMaxHP), this.boundingBox.width * .45, this.boundingBox.height * .1);
        if(!isBossBattleActive)
        {
            this.context.fillText("Wild " + monsterStats[monsterID][5], this.boundingBox.width * .055, this.boundingBox.height * .1);
        }
        else
        {
            this.context.fillText(monsterStats[monsterID][5], this.boundingBox.width * .055, this.boundingBox.height * .1);
        }

        this.context.fillStyle = "#991111";
        this.context.fillRect(this.boundingBox.width * .04, this.boundingBox.height * .879, (this.boundingBox.width * .905) * (userHP / userMaxHP), this.boundingBox.height * .051);
        this.context.fillStyle = "#ffffff";
        this.context.fillText(beautifynum(userHP) + "/" + beautifynum(userMaxHP), this.boundingBox.width * .45, this.boundingBox.height * .915);


        for(var DD = 0; DD < dealtDmg.length; DD++)
        {
            if(currentTime() - dealtDmg[DD][1] < 1000)
            {
                var alphaT = 1 - ((currentTime() - dealtDmg[DD][1]) / 1000);
                this.context.globalAlpha = alphaT;

                if(dealtDmg[DD][2])
                {
                    this.context.font = "bold 18px Verdana";
                }
                else
                {
                    this.context.font = "16px Verdana";
                }

                this.context.fillText("-" + dealtDmg[DD][0], (this.boundingBox.width * .5) + (DD * 3), this.boundingBox.height * .35 - (this.boundingBox.height * .3 * ((currentTime() - dealtDmg[DD][1]) / 1000)));
            }
            else
            {
                dealtDmg.splice(DD, 1);
                DD--;
            }
        }

        for(var TD = 0; TD < takenDmg.length; TD++)
        {
            if(currentTime() - takenDmg[TD][1] < 1000)
            {
                var alphaT = 1 - ((currentTime() - takenDmg[TD][1]) / 1000);
                this.context.globalAlpha = alphaT;
                this.context.fillStyle = "#FF2222";
                this.context.fillText("-" + takenDmg[TD][0], (this.boundingBox.width * .65) + (TD * 25), this.boundingBox.height * .915);
            }
            else
            {
                takenDmg.splice(TD, 1);
                TD--;
            }
        }
        this.context.globalAlpha = 1.0;

        if((currentTime() - monsterAtkTime) > monsterStats[monsterID][2])
        {
            monsterAtkTime = currentTime() - ((currentTime() - monsterAtkTime) - monsterStats[monsterID][2]);
            monsterAttacked();
        }
        this.context.fillStyle = "#000000";

        super.render(); // Render any child layers
        this.context.restore();
    }
}