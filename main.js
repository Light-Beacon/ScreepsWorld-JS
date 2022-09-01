    const maxHarvesterCount = 4;
    const maxUpgraderCount = 3;
    const maxBuilderCount = 4;
    const maxRepairerCount = 2;
    const maxCreep = maxHarvesterCount + maxUpgraderCount  + maxBuilderCount + maxRepairerCount;

module.exports.loop = function () {

    //生成目标参数
    
    if(Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }

    //清除不存在的Creep内存
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('[System] 清除不存在的Creep内存:', name);
        }
    }
    
    var harvestersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
    var upgradersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
    var buildersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
    var repairersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer').length;

    var roles = require('role');
    //产卵
    if(Game.spawns['Spawn1'].spawning == null && Game.creeps.length < maxCreep)
    {
        if(harvestersCount < maxHarvesterCount) {
            var newName = 'Harvester' + Game.time;
            if(Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,MOVE], newName, {memory: {role: 'harvester'}}) == 0)
            {
                console.log('[Spawn1] 生成新的采集者: ' + newName);
            }
        }
        else if(upgradersCount < maxUpgraderCount) {
            var newName = 'Upgrader' + Game.time;
            if(Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE], newName, {memory: {role: 'upgrader'}}) == 0)
            {
                console.log('[Spawn1] 生成新的升级者: ' + newName);
            }
        }
        else if(repairersCount < maxRepairerCount) {
            var newName = 'Repairer' + Game.time;
            if(Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, {memory: {role: 'repairer'}}) == 0)
            {
                console.log('[Spawn1] 生成新的修复者: ' + newName);
            }
        }
        else if(buildersCount < maxBuilderCount) {
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