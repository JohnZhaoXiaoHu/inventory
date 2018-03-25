# inventory
> 高仿[SkyUI](https://www.nexusmods.com/skyrimspecialedition/mods/12604) 5的[Angular](https://github.com/angular/angular)物品栏.
> 
> An Inventory highly resembles [SkyUI](https://www.nexusmods.com/skyrimspecialedition/mods/12604) 5

主要是希望当成 [GraphQL](https://github.com/graphql/graphql-js) 和 [Angular-Redux](https://github.com/angular-redux/store) 的练手项目。

由于所需技术栈尚未补全，这里只是挖个坑，正式动工应该还有一段时间。😐

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
物品栏分类图标可能会显示不下，此时多余部分变成一个统一的“更多”按钮，（有点像EA Origin的菜单），点了之后下拉菜单中显示。

每一项物品最后多一个“更多”的箭头，点了是个下拉菜单，里面有（以后再整的）equip drop favorite，以及详情。

点击详情后，左侧物品栏退出，右侧详情界面在正中间出现，这时候顶上会多一个返回箭头按钮。点击返回按钮，详情页消失，物品栏从左边弹回来。

### 后台

使用nodejs后台，koa + GraphQL 框架

后台数据库用mongo，数据集还没有设计。后面再说。

# License

MIT License

所有图标、界面的版权属于Bethesda Game Studios和/或SkyUI团队。

Thanks to Bethesda Game Studios for creating The Elder Scrolls V: Skyrim (SSE), providing the base content and allowing us to mod it.
