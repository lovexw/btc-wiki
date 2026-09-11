# PROGRESS · 开发进度台账

> **给接手的 AI / 开发者：本文件是唯一可信进度源。完成任何条目后，立刻回来更新这里的 checkbox 和统计数字，并同步推送到 GitHub。** 开发规范见 [AGENTS.md](AGENTS.md)。
>
> 最后更新：2026-09-12（journey 6 章 + 实用页面完成）

## 总览

| 板块 | 总量 | 已完成 | 状态 |
| --- | --- | --- | --- |
| 框架（VitePress 配置/主题/首页/导览页） | — | ✅ | 完成 |
| journey/ 学习之旅 | 6 | 6 | ✅ 全文翻译完成 |
| rabbit-holes/ 深度专题 | 17 | 0 | ⏳ 待翻译 |
| pages/ 实用页面（privacy/security/node） | 3 | 3 | ✅ 重写完成（本站语境） |
| glossary/ 术语表（标题+短定义） | 476 | 0 | ⏳ 待翻译 |
| glossary/ 术语表（全文精翻） | 476 | 0 | ⏳ 长期任务 |
| 原创中文示意图 | ≥4 | 0 | ⏳ 待绘制 |
| 交互组件（原站 Svelte widget 的 Vue 复刻） | 7 | 0 | ⏳ 未开始，非必需 |
| Cloudflare Pages 部署 | — | 0 | ⏳ 需用户在 Dashboard 操作 |

## 构建与部署

```bash
npm install
npm run build                  # 常规构建
STRICT_LINKS=1 npm run build   # 严格模式：死链会让构建失败（推送前必跑）
npm run glossary:gen           # 重新生成未翻译的术语页（不覆盖已有文件）
npm run glossary:sidebar       # 重新生成术语侧边栏
```

- Cloudflare Pages：Dashboard 连接 GitHub 仓库 `lovexw/btc-wiki`，构建命令 `npm run build`，输出目录 `docs/.vitepress/dist`。Node 版本设 20+（环境变量 `NODE_VERSION=20`）。
- **部署后需人工检查一次 cleanUrls 生成的无扩展名 URL 在 CF Pages 上是否正常**（正常应无问题；若 404，把 `docs/.vitepress/config.mts` 里 `cleanUrls: true` 改为 `false` 再构建）。
- 旧版纯 HTML 站点完整保留在 `legacy/html-site` 分支。

## 关键决策记录（不要推翻，除非有充分理由）

1. **技术栈 VitePress 1.x**，静态输出到 Cloudflare Pages。不用 Astro/Hexo。
2. **文件名 = 源仓库 slug**（如 `journey/why-money-is-broken.md`），保证与源仓库对照方便、URL 稳定。中文标题放 frontmatter `title`。
3. **术语页全部生成**（476 个文件都存在于 `docs/glossary/`）：已翻译的显示中文；未全文翻译的显示「中文标题 + 中文短定义 + 待翻译提示 + 相关词条链接」，保证全站内链永不死链。
4. **外链政策**：只保留权威技术参考（BIP 文档、bitcoinops.org、白皮书 PDF），删除营销类/新闻类/Wikipedia 类链接；术语页的 `sources` 列表在生成页中不展示。
5. **原文 frontmatter 的视频/图片引用一律删除**（资源在原站，不在内容仓库），关键位置用 `docs/public/images/` 下的原创中文 SVG 图替代。
6. **术语元数据管道**：`tools/glossary-meta.json`（英文元数据，勿手改）→ `tools/glossary-zh.json`（中文标题+短定义，翻译写入这里）→ `npm run glossary:gen` 生成页面 → `npm run glossary:sidebar` 生成侧边栏。
7. **生成器永不覆盖** `docs/glossary/` 下已存在的文件——全文精翻直接编辑页面文件本身，页面文件即最终事实源。

## 翻译进度明细

### journey/ 学习之旅（6/6 ✅）

- [x] `why-money-is-broken` 第 1 章 · 法币为什么坏了
- [x] `what-bitcoin-actually-is` 第 2 章 · 比特币到底是什么
- [x] `how-bitcoin-works` 第 3 章 · 比特币如何运转
- [x] `using-bitcoin` 第 4 章 · 如何使用比特币
- [x] `be-your-own-bank` 第 5 章 · 成为自己的银行
- [x] `sovereignty` 第 6 章 · 主权：最终的自立

### rabbit-holes/ 深度专题（0/17）

- [ ] `utxos`、`supply`、`halvings`、`mining`、`mempool`、`decentralization`
- [ ] `key-space`、`seed-backup-strategies`、`mt-gox-ftx-graveyard`
- [ ] `bitcoin-units`、`energy`、`inflation-bug-postmortem`
- [ ] `bitcoin-privacy`、`lightning-routing`、`block-size-war`、`bip-process`、`quantum-and-bitcoin`

### pages/ 实用页面（3/3 ✅，另有 index/manifesto/about 已重写完成）

- [x] `privacy` 隐私指南　[x] `security` 安全指南　[x] `node` 运行自己的节点

### glossary/ 术语表

- [ ] 476 条「标题 + 短定义」中文翻译（写入 `tools/glossary-zh.json`，由生成器产出全部页面）
- [ ] 476 条侧边栏（按首字母分组折叠）
- [ ] 全文精翻：`docs/glossary/` 中标注「已生成待精翻」的页面。**核对方法**：`grep -rl "glossary-stub" docs/glossary/ | wc -l` 得剩余数；精翻时删除页内 `glossary-stub` 注释块、补全文、保留 frontmatter。
- 已精翻（0）：暂无
- 建议第一批（高频词优先）：`address` `private-key` `public-key` `seed-phrase` `wallet` `node` `mining` `transaction` `block` `blockchain` `utxo-unspent-transaction-output` `fee-estimation` `lightning-network` `hash` `halving` `cold-storage` `hot-wallet` `multisig` `bech32` `bip-39` `consensus` `difficulty` `confirmation` `mempool` `fork` `sat` `whitepaper`

### 原创示意图（docs/public/images/）

- [x] `journey-inflation.svg` 第 1 章购买力稀释
- [x] `journey-bitcoin-stack.svg` 第 2 章比特币技术栈分层
- [x] `journey-block-lifecycle.svg` 第 3 章交易生命周期
- [x] `self-custody-flow.svg` 第 5 章自我托管决策流
- [ ] 可继续为 rabbit-holes 各篇补充

## 已知问题 / 待办

- [ ] Cloudflare Pages 首次部署 + cleanUrls 验证（需用户 GitHub 授权 CF，AI 无法代操作）
- [ ] 原站 Svelte 交互组件（7 个：SupplyChart、HalvingCountdown、UnitsConverter、KeySpaceVisualizer、MempoolHistogram、DifficultyClock、UnitsVisualization）可复刻为 Vue 组件增强对应页面；frontmatter 中原引用已删除
- [ ] 术语全文精翻（长期任务，按上面建议批次推进即可）
- [ ] `pages/terms.md`（源仓库的 Terms 页）已并入 `/about` 与术语表，不再单独翻译——如需可补
- [ ] 移动端与暗色模式抽查（已按 VitePress 默认主题设计，理论上无碍）

## 会话工作流程（每次 AI 会话必做）

1. 读 `PROGRESS.md` + `AGENTS.md`（就在仓库根目录，不用读别的文档）
2. 选一个未完成条目，按 AGENTS.md 规范干活
3. `STRICT_LINKS=1 npm run build` 验证
4. 更新本文件的 checkbox 与「最后更新」日期
5. git commit + push（每个板块一个 commit，信息用中文）
