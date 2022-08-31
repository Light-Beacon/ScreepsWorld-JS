const MaxCreepInEachSource = 4;//每个能量源最大容载爬量
function FindNearestAvailableSource(room,pos)
{
    if(room.memory.sourcesMarks == undefined)
        room.memory.sourcesMarks = new Object;
    var targets = room.find(FIND_SOURCES);
    var shortestPathLength = 99999;
    var NearestSource = null;
    for(var index in targets)
    {
        //遍历能量源
        if(!IsSourceAvaible(targets[index]))
            continue;//能量源不可用时跳过该能量源
        //寻找最短路径
        var pathLength = room.findPath(pos,targets[index].pos).length;
        //console.log('[PathFinder] 找到路径长度：' + pathLength + ' ID:' + targets[index].id);
        if(pathLength < shortestPathLength)
        {
            shortestPathLength = pathLength;
            NearestSource = targets[index];
        }
    }
    //console.log('[PathFinder] 最短路径长度：' + shortestPathLength);
    if(shortestPathLength == 99999) //全部能量源不可用
    {
        //console.log('[SourceManager] 无可用资源点！');
        return null;//返回null使其原地待命
    }
        
    AddMark(NearestSource);//给该能量源增加标记
    return NearestSource;//返回最近可用能量源
}

function AddMark(source)
{
    var sourceMarks = source.room.memory.sourcesMarks;
    var sourceID = source.id;
    if(!sourceMarks.hasOwnProperty(sourceID))
        sourceMarks[sourceID] = 1;//新能量源增加标记
    else
        sourceMarks[sourceID]++;//老能量源直接增加
    //console.log('[SourceManager] 新增标记：' + sourceID +' 当前标记数：' + sourceMarks[sourceID]);

}

function UnMark(source)
{
    var sourceMarks = source.room.memory.sourcesMarks;
    var sourceID = source.id;
    sourceMarks[sourceID]--;//取消一次标记
    //console.log('[SourceManager] 资源' + sourceID + '取消一次标记' + ' 当前标记数：' + sourceMarks[sourceID]);
}

function IsSourceAvaible(source)
{
    var sourceMarks = source.room.memory.sourcesMarks;
    //console.log(sourceMarks[source.id]);
    if(source.room.memory.sourcesMarks[source.id] == undefined || MaxCreepInEachSource > sourceMarks[source.id])
        return true;
    return false
}

var sourceManager = 
{
    FindNASource: function(creep)
    {
        return FindNearestAvailableSource(creep.room,creep.pos);
    },
    UnMarkSource: function(source) { UnMark(source); }
}

module.exports = sourceManager;