var workLogic = require('workLogic');

function LogAsCreep(creep,message)
{
    console.log("[Creep]["+ creep.name +"] " + message)
}
var roleBuilder = {

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
            if(creep.store.getFreeCapacity() > 0)
                workLogic.StartHarvestTask(creep,sourceManager,true);
            else
                workLogic.StartBuildTask(creep,sourceManager,true);
        }   
        workLogic.Work(creep,sourceManager)
	}
};

module.exports = roleBuilder;