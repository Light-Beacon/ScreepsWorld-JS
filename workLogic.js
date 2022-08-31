const HarvestPathStroke = '#ffaa00' //采集任务路径描边：亮橙色
const TransportStroke = '#ffffff' //搬运任务路径描边：白色
const BuildPathStroke = '#99ffaa' //建造任务描边：绿色
const UpgradePathStroke = '#99aaff' //升级任务描边：蓝色
const RepairPathStroke = '#aa00ff' //修复任务描边：紫色

function LogAsCreep(creep,message)
{
    console.log("[Creep]["+ creep.name +"] " + message)
}

function StartHarvestTask(creep,sourceManager,Outputlog = false)
{
    if(Outputlog) LogAsCreep(creep,"准备开始新任务");
        //Give Creep a new task
    if(creep.store.getFreeCapacity() > 0) {
        var source = sourceManager.FindNASource(creep)
        if(source == null)
        {
            if(Outputlog) LogAsCreep(creep,"FNA返回空值，待命");
            return;
        }
        creep.memory.target = source.id;
        if(Outputlog) LogAsCreep(creep,"新建任务：采集 目标ID：" + creep.memory.target);
        creep.say('🔄');
        creep.memory.task = 'harvest';
    }
}

function StartTransportTask(creep,sourceManager = null,Outputlog = false)
{
    var targets = creep.room.find(FIND_MY_STRUCTURES,{
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && 
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if(targets.length)
    {
        creep.memory.task = 'transport';
        creep.memory.target = targets[0].id;
        if(Outputlog) LogAsCreep(creep,"新建任务：搬运 目标ID：" + creep.memory.target);
    }else{
        if(Outputlog) LogAsCreep(creep,"创建搬运任务失败:没有可供搬运的对象！尝试创建升级任务");
        StartUpgradeTask(creep,sourceManager = null,Outputlog);
    }
}

function StartBuildTask(creep,sourceManager = null,Outputlog = false)
{
    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if(targets.length)
    {
        creep.memory.task = 'build';
        creep.memory.target = targets[0].id;
        if(Outputlog) LogAsCreep(creep,"新建任务：建造 目标ID：" + creep.memory.target);
    }else{
        if(Outputlog) LogAsCreep(creep,"创建建造任务失败:没有可供建造的对象！");
    }
}

function StartUpgradeTask(creep,sourceManager = null,Outputlog = false)
{
    creep.memory.task = 'upgrade';
    creep.memory.target = creep.room.controller.id;
    if(Outputlog) LogAsCreep(creep,"新建任务：升级 目标ID：" + creep.memory.target);
}

function StartRepairTask(creep,sourceManager = null,Outputlog = false)
{
    creep.memory.task = 'repair';
    var targets = creep.room.find(FIND_MY_STRUCTURES,{
        filter: (structure) => {
            return structure.hits < structure.hitsMax;
        }
    });
    if(!targets.length){
        targets = creep.room.find(FIND_STRUCTURES,{
            filter: (structure) => {
                return structure.hits < structure.hitsMax;
            }
        });
    }
    if(targets.length)
    {
        var damagestTarget = targets[0];
        var targetHealthPercent = damagestTarget.hits/damagestTarget.hitsMax;
        for(var name in targets)
        {
            var healthPercent = targets[name].hits/targets[name].hitsMax
            if(targetHealthPercent > healthPercent);
            {
                damagestTarget = target[name];
                targetHealthPercent = healthPercent;
            }
        }
        creep.memory.task = 'repair';
        creep.memory.target = damagestTarget.id;
        if(Outputlog) LogAsCreep(creep,"新建任务：修复 目标ID：" + creep.memory.target);
    }else{
        if(Outputlog) LogAsCreep(creep,"创建修复任务失败:没有可供修复的对象！尝试创建搬运任务");
        StartTransportTask(creep,sourceManager = null,Outputlog);
    }
}

function EndTask(creep,log = false)
{
    creep.memory.target = null;
    creep.memory.task = 'waiting';
    if(log) LogAsCreep(creep,"任务结束，切换到待命状态。" );
}
    
var Tasks = {
    //执行各种任务的主要逻辑
    Work:function(creep,sourceManager,log = false)
    {
        target = creep.memory.target;
        targetObj = Game.getObjectById(target)
        if(targetObj == null || targetObj == undefined)
        {
            EndTask(creep,log);
        }
        //采集任务
        if(creep.memory.task == 'harvest')
        {
            if(log) LogAsCreep(creep,"进行采集任务：" + target);
            if(creep.store.getFreeCapacity() > 0) {
                if(creep.harvest(targetObj) == ERR_NOT_IN_RANGE)
                    creep.moveTo(targetObj, {visualizePathStyle: {stroke: HarvestPathStroke}});
            }
            else
            {
                sourceManager.UnMarkSource(targetObj);
                EndTask(creep,log);
            }
        }
        //搬运任务
        if(creep.memory.task == 'transport')
        {
            if(log) LogAsCreep(creep,"进行搬运任务" + target);
            if(creep.transfer(targetObj, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo((targetObj), {visualizePathStyle: {stroke: TransportStroke}});
            }
            if(creep.store[RESOURCE_ENERGY] == 0 || targetObj.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            {
                EndTask(creep,log);
            }
        }
        //建造任务
        if(creep.memory.task == 'build')
        {
            if(log) LogAsCreep(creep,"进行建造任务" + target);
            if(creep.build(targetObj)  == ERR_NOT_IN_RANGE) {
                creep.moveTo((targetObj), {visualizePathStyle: {stroke: BuildPathStroke}});
            }
            if(creep.store[RESOURCE_ENERGY] == 0 || targetObj.progress >= targetObj.progressTotal)
            {
                EndTask(creep,log);
            }
        }
        //升级任务
        if(creep.memory.task == 'upgrade')
        {
            if(log) LogAsCreep(creep,"进行升级任务" + target);
            if(creep.upgradeController(creep.room.controller)  == ERR_NOT_IN_RANGE) {
                creep.moveTo((targetObj), {visualizePathStyle: {stroke: UpgradePathStroke}});
            }
            if(creep.store[RESOURCE_ENERGY] == 0)
            {
                EndTask(creep,log);
            }
        }
        //修复任务
        if(creep.memory.task == 'repair')
        {
            if(log) LogAsCreep(creep,"进行修复任务" + target);
            if(creep.repair(targetObj)  == ERR_NOT_IN_RANGE) {
                creep.moveTo((targetObj), {visualizePathStyle: {stroke: RepairPathStroke}});
            }
            if(creep.store[RESOURCE_ENERGY] == 0 || targetObj.hits == targetObj.hitsMax)
            {
                EndTask(creep,log);
            }
        }
    },
    StartHarvestTask:function(creep,sourceManager,log = false){StartHarvestTask(creep,sourceManager,log)},
    StartTransportTask:function(creep,sourceManager = null,log = false){StartTransportTask(creep,sourceManager,log)},
    StartBuildTask:function(creep,sourceManager = null,log = false){StartBuildTask(creep,sourceManager,log)},
    StartUpgradeTask:function(creep,sourceManager = null,log = false){StartUpgradeTask(creep,sourceManager,log)},
    StartRepairTask:function(creep,sourceManager = null,log = false){StartRepairTask(creep,sourceManager,log)}
}

module.exports = Tasks;