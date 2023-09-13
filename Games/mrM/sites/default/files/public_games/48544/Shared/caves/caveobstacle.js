var hazardDamage = {
    normal: 0,
    radiation: 1,
    lava: 2
}

// Needs to be destroyed or overcome
class CaveBlocker extends CaveNode
{
    totalHealth;
    currentHealth;

    update(deltaTime, drone)
    {
        this.currentHealth -= drone.damagePerSecond * deltaTime;
        if(this.currentHealth <= 0 && drone.waitAtNodeTime > this.duration)
        {
            drone.waitAtNodeTime = this.duration;
        }
    }

    onDroneEnter(drone)
    {
        if(drone.movementType != droneMovement.air && this.currentHealth > 0)
        {
            drone.wait(Infinity);
            drone.isActing = true;
            drone.setStatus(_("Drilling through obstacle"));
        }
        else
        {
            drone.wait(this.duration);
        }
    }

    getDurationForDrone(drone)
    {
        if(this.currentHealth > 0)
        {
            // Estimate time to destroy
            return this.currentHealth / drone.damagePerSecond;
        }
        return this.duration;
    }

    getIcon()
    {
        if(this.currentHealth <= 0) return null;
        return this.icon;
    }
}

// Affects movement speed for certain drones
class CaveTerrain extends CaveNode
{
    preferredMovementType;
    slowDurationMultiplier;

    onDroneEnter(drone)
    {
        if(drone.movementType == this.preferredMovementType)
        {
            drone.wait(this.duration)
        }
        else
        {
            drone.wait(this.duration * this.slowDurationMultiplier)
        }
    }

    getDurationForDrone(drone)
    {
        if(drone.movementType == this.preferredMovementType)
        {
            return this.duration;
        }
        return this.duration * this.slowDurationMultiplier;
    }
}

// Damages drones
class CaveHazard extends CaveNode
{
    damagePerSecond;
    preferredMovementType
    damageType;
    icon = caveIconRadiation;
    name = _("Radiation");
    description = _("Damages drones over time");

    update(deltaTime, drone)
    {
        if(drone.movementType != this.preferredMovementType)
        {
            drone.takeDamage(this.damagePerSecond * deltaTime, this.damageType);
        }
    }
}

class CaveBlockerRock extends CaveBlocker
{
    difficulty = 1;
    currentHealth = 100;
    totalHealth = 100;
    icon = caveIconRock;
    name = _("Boulder");
    description = _("Must be destroyed to progress");
}

class CaveTerrainMud extends CaveTerrain
{
    difficulty = 0.3;
    preferredMovementType = droneMovement.air;
    icon = caveIconMud;
    name = _("Mud");
    description = _("Slows down ground drones");
    slowDurationMultiplier = 2;
}

class CaveHazardRadiation extends CaveHazard
{
    difficulty = 3;
    damagePerSecond = 10;
    damageType = hazardDamage.radiation;
    icon = caveIconRadiation;
    name = _("Radiation");
    description = _("Damages drones over time");
}

class CaveHazardLava extends CaveHazard
{
    difficulty = 5;
    preferredMovementType = droneMovement.air;
    damagePerSecond = 15;
    damageType = hazardDamage.lava;
    icon = caveIconLava;
    name = _("Lava");
    description = _("Damages drones over time");
}