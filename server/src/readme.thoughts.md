# 后台

使用nodejs后台，koa + GraphQL 框架

后台数据库用mongo

物品栏里展示的是ref，而不是base

打开物品栏的时候实际上是在查询“inventories”表中“我”拥有的项目



物品item base表： dbname, value, weight, category(填数据集名称(gears, comsumables, books))

物品系列子表：

gears表 (包括armor和weapon)

- armor: ..., rating(防护), type(轻甲、重甲), equip(头、身、足、手), effects

- weapon: ..., rating(伤害), type(长剑、单手斧、匕首……) equip(单手，双手), effects

(武器和护甲的区分就是根据type)

consumables表 (包括potion、scroll、food、ingredients)，在type字段里区分

- potion: ..., effects(法术效果)数组

- ...

- 包括法术书

- scroll 当然不包括 Elder Scrolls ... 😏

- 弓箭属于gears(因为弓箭有ratings，并且可以装备在身上)，子弹属于comsumables

- 弓箭刚射出时，refitem的num减少1。如果num减少到0，则删除这个refitem，并且在inventories表中遍历并删除记录。当弓箭着陆时（射中目标或射偏到旁边墙上树上），新增一条refitem，num是1，item仍然是这支箭。关于owner，如果射中Actor，那么就是这个actor，如果射偏，就是null。但是这个都扯远了，现阶段我是不会做战斗的。

- 交易原理也类似。当交易发生时，refitem的num减少1。如果num减少到0，则删除这个refitem，并且在inventories表中遍历并删除记录。紧接着，创建一个新refitem，num是1，item是这样东西，而owner是接收人。

books: ..., content(书的内容ID，书具体内容在translations数据集中)

玩家Actors: dbname, icon, equiped(装备中的装备)

物品ref表： dbname(外键连物品base表 dbname), owner(外键连玩家Actor ref表 dbname)
num(个数)。

物品inventory表：存放玩家的物品栏数据。(item: 外链refItems的主键_id，holder:外连actors的dbname)inventory，num由前端计算相同物品（item相同，owner也相同）的所有ref的num相加

translation表 存放翻译字符串。

