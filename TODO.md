# UI现代化改造待办清单

## 已完成
✓ 主页搜索框现代化 ([update] 主页搜索框现代化设计)
✓ 主页大厅区域现代化 ([update] 主页大厅区域现代化设计)
✓ match-card-small组件现代化 ([update] 比赛卡片组件现代化设计)
✓ team-card-small组件现代化 ([update] team-card-small组件现代化设计)
✓ team-card-big组件现代化 ([update] team-card-big组件现代化设计)
✓ event-card-big组件现代化 ([update] event-card-big组件现代化设计)
✓ player-card-small组件现代化 ([update] player-card-small组件现代化设计)
✓ 创建CLAUDE.md文档 ([add] CLAUDE.md 文档)
✓ 创建TODO.md待办清单 ([add] TODO.md 待办清单)

## 待办事项 (按优先级排序)

### 高优先级 - 卡片组件现代化
- [x] **event-card-big** (赛事大卡片) - `wechat-miniprogram/components/event-card-big/` ✓
- [x] **player-card-small** (球员小卡片) - `wechat-miniprogram/components/player-card-small/` ✓
- [ ] **player-card-big** (球员大卡片) - `wechat-miniprogram/components/player-card-big/`
- [ ] **user-card-small** (用户小卡片) - `wechat-miniprogram/components/user-card-small/`
- [ ] **user-card-big** (用户大卡片) - `wechat-miniprogram/components/user-card-big/`
- [ ] **news-card** (新闻卡片) - `wechat-miniprogram/components/news-card/`
- [ ] **match-card-big** (比赛大卡片) - `wechat-miniprogram/components/match-card-big/`

### 中优先级 - 页面现代化
- [ ] **profile_player/profile_player** (球员主页) - `wechat-miniprogram/pages/profile_player/`
- [ ] **management/management** (管理页面) - `wechat-miniprogram/pages/management/`
- [ ] **mine/mine** (我的页面) - `wechat-miniprogram/pages/mine/`

### 低优先级 - 全局优化
- [x] **颜色设计系统创建** - 已创建完整橙色系颜色设计系统
  - `docs/color-design-system.md` - 颜色设计系统文档
  - `wechat-miniprogram/utils/colors.js` - JavaScript颜色常量
  - `wechat-miniprogram/styles/mixins.wxss` - WXSS混入类
- [x] **已现代化组件颜色更新** - 更新已完成现代化改造的组件使用橙色系
  - ✓ player-card-small - 将深绿色标题改为橙色
  - ✓ team-card-small - 将深绿色标题改为橙色，更新渐变使用橙色系
  - ✓ team-card-big - 将深绿色标题改为橙色，更新渐变使用橙色系
  - ✓ event-card-big - 将深绿色标题改为橙色，将青绿到深绿渐变改为橙色渐变
  - ✓ match-card-small - 更新相关文本颜色为橙色系
- [ ] **pub目录页面** - `wechat-miniprogram/pages/pub/` 下的页面
- [ ] **微交互和动画细节** - 添加更多的交互反馈和过渡动画
- [ ] **响应式设计优化** - 确保在不同设备上的良好显示

## 设计原则
1. **统一使用橙色系配色方案**:
   - 主橙色#ed6c00为主色，用于标题、按钮、强调元素
   - 浅橙色#ff8c32用于渐变过渡、辅助元素
   - 极浅橙色#ffb366用于背景高光
   - 不再使用深绿色#003f43和青绿色#2bb7b3
2. **功能不变**: 只优化视觉表现
3. **现代化设计语言**: 使用渐变、阴影、圆角、过渡动画
4. **一致性**: 所有组件和页面统一设计语言，强制使用颜色设计系统

## 工作流程
1. 每次完成一个组件或页面的现代化改造后，立即提交git commit
2. 提交信息格式: `[update] 组件/页面名称 现代化设计`
3. 更新此TODO.md文件，标记已完成的项目
4. 继续下一个高优先级项目

## 颜色迁移流程
1. **新组件开发**: 必须使用颜色设计系统
   - JS中导入颜色常量: `import { Colors, Shadows, Gradients } from '../../utils/colors.js'`
   - WXSS中导入混入类: `@import '../../styles/mixins.wxss'`
   - 使用橙色系调色板，不使用深绿色或青绿色
2. **组件现代化改造**: 在改造过程中迁移到颜色系统
   - 更新标题颜色: 深绿色 → 主橙色 (#ed6c00)
   - 更新渐变: 青绿-深绿渐变 → 橙色系渐变
   - 更新阴影: 使用橙色透明度阴影
   - 测试视觉一致性
3. **已现代化组件更新**: 按优先级更新已完成组件
   - 第一优先级: player-card-small, team-card-small, team-card-big, event-card-big, match-card-small
   - 提交信息格式: `[update] 组件名称 颜色迁移到橙色系`

## 最后更新
2026-02-20 - 已完成7个组件的现代化改造 (player-card-small已完成)