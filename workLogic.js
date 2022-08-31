const HarvestPathStroke = '#ffaa00' //采集任务路径描边：亮橙色
const TransportStroke = '#ffffff' //搬运任务路径描边：白色

function LogAsCreep(creep,message)
{
    console.log("[Creep]["+ creep.name +"] " + message)
}

var Tasks = {
    Work:function(creep,sourceManager,log = false)
    {
        target = creep.memory.target;
        //采集任务
        if(creep.memory.task == 'harvest')
        {
            if(log) LogAsCreep(creep,"进行采集任务：" + target);
            if(creep.store.getFreeCapacity() > 0) {
                if(creep.harvest(Game.getObjectById(target)) == ERR_NOT_IN_RANGE)
                    creep.moveTo(Game.getObjectById(target), {visualizePathStyle: {stroke: HarvestPathStroke}});
            }
            else
            {
                sourceManager.UnMarkSource(Game.getObjectById(target));
                creep.memory.target = null;
                creep.memory.task = 'waiting';
                if(log) LogAsCreep(creep,"任务结束，切换到待命状态。" );
            }
        }
        //搬运任务
        if(creep.memory.task == 'transport')
        {
            if(log) LogAsCreep(creep,"进行搬运任务" + target);
            if(creep.transfer(Game.getObjectById(target), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(target), {visualizePathStyle: {stroke: TransportStroke}});
            }
            if(creep.store.getFreeCapacity() > 0)
            {
                creep.memory.target = null;
                creep.memory.task = 'waiting'
                if(log) LogAsCreep(creep,"任务结束，切换到待命状态。");
            }
        }
    }
    
}

module.exports = Tasks;