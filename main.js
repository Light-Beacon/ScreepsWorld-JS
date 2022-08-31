var roles = require('role');

module.exports.loop = function () {

    //生成目标参数
    const maxHarvesterCount = 3;
    const maxUpgraderCount = 5;
    const maxBuilderCount = 5;

    //清除不存在的Creep内存
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('[System] 清除不存在的Creep内存:', name);
        }
    }

    //产卵
    if(Game.spawns['Spawn1'].spawning == null)
    {
        if(roles.harvestersCount < maxHarvesterCount) {
            var newName = 'Harvester' + Game.time;
            if(Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,MOVE], newName, {memory: {role: 'harvester'}}) == 0)
            {
                console.log('[Spawn1] 生成新的采集者: ' + newName);
            }
        }
        else if(roles.upgradersCount < maxUpgraderCount) {
            var newName = 'Upgrader' + Game.time;
            if(Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'upgrader'}}) == 0)
            {
                console.log('[Spawn1] 生成新的升级者: ' + newName);
            }
        }
        else if(roles.buildersCount < maxBuilderCount) {
            var newName = 'Builder' + Game.time;
            if(Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'builder'}}) == 0)
            {
                console.log('[Spawn1] 生成新的建造者: ' + newName);
            }
        }
    }
    
    //运行Creeps职业逻辑
    roles.RunAllCreeps();

    /*var tower = Game.getObjectById('a0787f4d06abfd54aac045fc');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }*/
}