# inventory
> 高仿[SkyUI](https://www.nexusmods.com/skyrimspecialedition/mods/12604) 5的[Angular](https://github.com/angular/angular)物品栏.
> 
> An Inventory highly resembles [SkyUI](https://www.nexusmods.com/skyrimspecialedition/mods/12604) 5

主要是希望当成 [GraphQL](https://github.com/graphql/graphql-js) 和 [Angular-Redux](https://github.com/angular-redux/store) 的练手项目。

由于所需技术栈尚未完全补全，这里只是挖个坑，进度应该会非常缓慢。😐

## 运行
``` bash
##### 后台 #####

# 编译 (Webpack)
npm run build:s

# 运行 (Koa)
npm run start:s

# 单元测试 (Jest)
npm run test:s

```

## 为啥做物品栏
Redux和GraphQL是针对大型复杂项目的，而自己能想到的大型一点的，但是又不是复杂到我无法完成的项目中，物品栏可能是比较合适的。业务逻辑比较清晰，比较灵活，比较常见。

## 为啥要仿SkyUI

首先我是老滚辐射粉😆!

然后SkyUI的设计比较现代，也相对来说对前端友好一些。

另外我不是美工。比如《巫师3》的：每一件物品都是图标。我这个手残让我画那么多图标？emmmmmm...

## 思路

### 前端
前端页面只做2种：PC端(>=992px)和移动端

pc端界面和老滚基本一致，只是：
- 模型那里改成物品类型图标，毕竟我不是3d建模师
- 没有底下的equip drop favorite，这些都以后再整

值得注意：
- 鼠标移到物品行上，右边的详情界面会载入相应的数据。

移动端：
物品栏分类图标可能会显示不下，此时多余部分变成一个统一的“更多”按钮，~~（有点像EA Origin的菜单）~~ 只有1个当前active的图标出现在最中间，点了之后下拉菜单中显示。

每一项物品最后多一个“更多”的箭头，点了是个下拉菜单，里面有（以后再整的）equip drop favorite，以及详情。

点击详情后，左侧物品栏退出，右侧详情界面在正中间出现，这时候顶上会多一个返回箭头按钮。点击返回按钮，详情页消失，物品栏从左边弹回来。

每一个分类按钮实际上是自定义filter。搜索也是filter（按name和dbname）

---------------------------------------
首页(/)：

以...身份登录 -> 选人页面  

打开物品栏 -> 物品栏首页

选人页面(/actors/select)：
（载入actors）

物品栏首页(/inventory/skyrim/)：
（载入ref_items, 选出当前身份所拥有的物品，根据每一条ref_item的dbname载入其他详细信息，最后合成一张大info表）
（存入redux store的是当前身份所拥有的ref_items）
默认位于“全部”标签
根据大info表展示出所有物品。

添加： 底下弹出“控制台”

删除


### 后台

使用nodejs后台，koa + GraphQL 框架

后台数据库用mongo，数据集正在设计。

---------------------------------------

物品栏里展示的是ref，而不是base

打开物品栏的时候实际上是在查询“inventories”表中“我”拥有的项目

后台数据集：

![dbDataflow](https://i.imgur.com/BpWrMrz.png)

物品item base表： dbname, value, weight, category (外键连gears表、consumables表、books)

物品系列子表：

gears表 (包括armor和weapon)

- armor: ..., rating(防护), type(轻甲、重甲), equip(头、身、足、手), effects

- weapon: ..., rating(伤害), type(长剑、单手斧、匕首……) equip(单手，双手), effects

consumables表 (包括potion、scroll、food、ingredients)，在type字段里区分

- potion: ..., effects(法术效果)数组

- ...

- 包括法术书

- scroll 当然不包括 Elder Scrolls ... 😏

- 弓箭属于gears(因为弓箭有ratings，并且可以装备在身上)，子弹属于comsumables

books: ..., content(书的内容)

effects法术效果表：dbname

玩家Actor ref表: dbname, icon, description

物品ref表： dbname(外键连物品base表 dbname), owner(外键连玩家Actor ref表 dbname)
num(个数)。

物品inventory表：存放玩家的物品栏数据。(item: 外链refItems的主键_id，holder:外连actors的dbname)inventory没有了，num由前端计算相同物品（item相同，owner也相同）的所有ref的num相加

name表（可能会是个外置json文件）dbname, en{name, description, categoies, types}, zh{name, description, categories, types}

# To Do:

前端：

- 界面：首页
- 界面：物品栏页（物品详情 增加物品-控制台 删除物品-R-移动端-更多）

后台：

- 数据库设计
- 接口单元测试

# License

MIT License

所有图标、界面的版权属于Bethesda Game Studios和/或SkyUI团队。

Thanks to Bethesda Game Studios for creating The Elder Scrolls V: Skyrim (and SSE), providing the base content and allowing us to mod it.
