# CRM UI Primitives Source Baseline

- 设计基准：`a46db7ee`
- 提取时 HEAD：`09427cc53070894fa7cbbf8cbb83ab579ae341ad`
- 相关路径差异：无
- 实现与 Story：270 files，55 CSF stories，1 MDX
- 测试：56 files，457 tests
- 基线结果：55 files passed，1 file failed；454 tests passed，3 tests failed

## 已知基线失败

`DatePicker.test.tsx` 的三个范围选择用例未固定初始月份。执行日期为
2026-07-10 时，空值 DateRangePicker 显示 2026-07/08，而测试查找
2026-06/07。迁入目标仓库时通过给三个用例提供明确 `defaultValue`
稳定测试，不修改组件行为。
