var workLogic = require('workLogic');

function LogAsCreep(creep,message)
{
    console.log("[Creep]["+ creep.name +"] " + message)
}

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep,sourceManager) {
        var target = creep.memory.target;
        if(creep.spawning)//产卵不用管
        {
            creep.memory.task = 'spawning';
            creep.memory.target = null;
            return;
        }
        if(target == null || target == undefined || creep.memory.task == 'waiting')//新建任务
        {
            LogAsCreep(creep,"准备开始新任务");
            //Give Creep a new task
            if(creep.store.getFreeCapacity() > 0) {
                var source = sourceManager.FindNASource(creep)
                if(source == null)
                {
                    LogAsCreep(creep,"FNA返回空值，待命");
                    return;
                }
                creep.memory.target = source.id;
                LogAsCreep(creep,"新建任务：采集 目标ID：" + creep.memory.target);
                creep.memory.task = 'harvest';
            }
            else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN ||
                                    structure.structureType == STRUCTURE_TOWER) && 
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                });
                if(targets.length > 0)
                {
                    creep.memory.task = 'transport'
                    creep.memory.target = targets[0].id;
                    LogAsCreep(creep,"新建任务：搬运 目标ID：" + creep.memory.target);
                }
                else{
                    LogAsCreep(creep,"创建搬运任务失败！");
                }
                    
            }
        }
        workLogic.Work(creep,sourceManager)
	}
};

module.exports = roleHarvester;