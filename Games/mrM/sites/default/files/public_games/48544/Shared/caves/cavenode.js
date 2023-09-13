class CaveNode
{
    x;
    y;
    parent;
    children = [];
    depth;
    difficulty = 0.1;
    id = "0"; // ID will describe path from root to this node

    name = _("Cave Chamber");
    icon = null;
    description = "";
    duration = 3;
    isSeen = false;

    effectColor;
    affectingDrone;

    onDroneEnter(drone)
    {
        drone.wait(this.duration);
    }
    onDroneExit(drone)
    {
        drone.resume();
    }

    update(deltaTime, drone) { }

    getDurationForDrone(drone)
    {
        return this.duration;
    }

    getIcon()
    {
        return this.icon;
    }

    isTerminal()
    {
        return this.children.length == 0;
    }

    printTree(depth = 0)
    {
        var str = "";
        for(var i = 0; i < depth; ++i) str += "  ";
        console.log(str + this.id);
        for(var i in this.children)
        {
            this.children[i].printTree(depth + 1);
        }
    }

    startEffect(affectingDrone, color)
    {
        this.affectingDrone = affectingDrone;
        this.effectColor = color;
    }
}