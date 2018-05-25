# 想星后台管理项目

## 管理提交

### 工具
使用commitizen管理项目提交
提交时候，请使用`npm run commit`

或者使用`git commit`打开vim，自定义编写提交，应符合commit message书写规范

### 规则
> 禁用 `git commit -m 'fix bug #xxx'`

- commit 格式
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

**注意每一块之间空行**

- 标题行：必填，描述：修改类型，内容
- 主题内容：回答以下三个问题
  - 为什么修改
  - 做了什么修改
  - 开发的思路
- 页脚注释

具体对应字段

- type：commit的类型
  - feat：新特性
  - fix：修改bug
  - refactor：代码重构
  - docs：文档修改
  - style：代码格式修改（不是css样式修改的意思）
  - test：测试用例修改
  - chore：其他修改：eg：构建流程，依赖管理
- scope：commit影响的范围
  - route
  - component
  - utils
  - build
  - 等等。。。
- subject：commit的概述 建议再 50/72 字符之间
- body：commit具体修改内容，多行，每行 50/72
- footer：一些备注，如BREAKING CHANGE 或修复的bug链接