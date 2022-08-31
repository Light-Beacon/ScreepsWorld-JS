var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repairer');

var sourceManager = require('sourceManager')

//获取地图上所有职业的Creeps对象

var roles = {
    harvestersCount: _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length,
    upgradersCount: _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length,
    buildersCount: _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length,
    repairersCount: _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer').length,
    //分配默认任务
    RunAllCreeps: function(){
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep,sourceManager);
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep,sourceManager);
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep,sourceManager);
            }
            if(creep.memory.role == 'repairer') {
                roleRepair.run(creep,sourceManager);
            }
        }
        /*
        for(var name in harvesters)
            if(Game.creeps[name])
                roleHarvester.run(harvesters[name]);
        for(var name in upgraders)
            if(Game.creeps[name])
                roleUpgrader.run(upgraders[name]);
        for(var name in builders)
            if(Game.creeps[name])
            roleBuilder.run(builders[name]);    */
    }
    
}

module.exports = roles;