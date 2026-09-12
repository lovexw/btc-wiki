# PROGRESS · 开发进度台账

> **给接手的 AI / 开发者：本文件是唯一可信进度源。完成任何条目后，立刻回来更新这里的 checkbox 和统计数字，并同步推送到 GitHub。** 开发规范见 [AGENTS.md](AGENTS.md)。
>
> 最后更新：2026-09-12（首期开发完成 + Cloudflare Pages 上线 https://btc-wiki-7oo.pages.dev；后续会话继续术语精翻）

## 总览

| 板块 | 总量 | 已完成 | 状态 |
| --- | --- | --- | --- |
| 框架（VitePress 配置/主题/首页/导览页） | — | ✅ | 完成 |
| journey/ 学习之旅 | 6 | 6 | ✅ 全文翻译完成 |
| rabbit-holes/ 深度专题 | 17 | 0 | ⏳ 待翻译 |
| pages/ 实用页面（privacy/security/node） | 3 | 3 | ✅ 重写完成（本站语境） |
| glossary/ 术语表（标题+短定义） | 476 | 476 | ✅ 全部完成并生成页面 |
| glossary/ 术语表（全文精翻） | 476 | 13 | ⏳ 进行中，按下方批次计划推进 |
| 原创中文示意图 | 5 | 5 | ✅ 首批完成（可继续扩充） |
| 交互组件（原站 Svelte widget 的 Vue 复刻） | 7 | 0 | ⏳ 未开始，非必需 |
| Cloudflare Pages 部署 | — | ✅ | 已上线 https://btc-wiki-7oo.pages.dev |

## 构建与部署

```bash
npm install
npm run build                  # 常规构建
STRICT_LINKS=1 npm run build   # 严格模式：死链会让构建失败（推送前必跑）
npm run glossary:gen           # 重新生成未翻译的术语页（不覆盖已有文件）
npm run glossary:sidebar       # 重新生成术语侧边栏
```

- Cloudflare Pages：**wrangler 直传部署**（未走 Dashboard 连 GitHub）。命令：`npm run build && npx wrangler pages deploy docs/.vitepress/dist --project-name=btc-wiki --branch=main`。生产域名 https://btc-wiki-7oo.pages.dev 。
  - wrangler 需 ≥ 4.131.1：旧版 4.38.0 上传 1500+ 文件时会大量 EPIPE 报错（已全局升级，若换机器注意）。
  - `docs/.vitepress/dist` 里出现过 `xxx 2.svg` 之类的 Finder 垃圾副本（仅构建产物，源文件干净），部署前如发现可 `find docs/.vitepress/dist -name "* 2*" -delete`。
- cleanUrls 生成的无扩展名 URL 已在 CF Pages 上验证正常（`/glossary/private-key`、`/about` 均 308→200），无需改配置。
- 根目录 `.vitepress/config.mts` 是 **CI 兜底配置**：若 CI 构建命令写成 `npx vitepress build`（缺 `docs` 参数），会在仓库根构建、读不到 docs 配置，public 图片被误编译为模块 import 而报错（2026-09-12 实际发生）。兜底配置复用 docs 配置并覆盖 srcDir/outDir/cacheDir，使该命令也能正确产出；不影响 `npm run build`。
- 观察到一次 Git 自动构建失败即源于上述缺参命令，且该 Git 集成不在 wrangler CLI 登录的账号的任何 Pages 项目上（疑似另一个 Cloudflare 账号），CLI 无法代改其构建配置，故采用仓库侧兜底方案。
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

- [x] 476 条「标题 + 短定义」中文翻译（在 `tools/glossary-zh.json`，已生成全部页面）
- [x] 476 条侧边栏（按首字母分组折叠）
- [ ] 全文精翻：`docs/glossary/` 中标注「已生成待精翻」的页面。**核对方法**：`grep -rl "glossary-stub" docs/glossary/ | wc -l` 得剩余数；精翻时删除页内 `glossary-stub` 注释块、补全文、保留 frontmatter。
- 已精翻（13）：`address` `private-key` `public-key` `seed-phrase` `wallet` `node` `mining` `transaction` `block` `blockchain` `hash` `utxo-unspent-transaction-output` `lightning-network`（剩余 463 条，核对：`grep -rl "glossary-stub" docs/glossary/ | wc -l`）

### 术语全文精翻 · 续接批次计划（新会话照此推进）

> 工作流（读源文件→重写页面文件→相关词条链接）见 `AGENTS.md`「术语表工作流 · 全文精翻」。原「建议第一批」中有 7 个 slug 在源数据中不存在（cold-storage、hot-wallet、bech32、consensus、confirmation、sat、halving 均为概念名而非真实 slug），已用真实 slug 修正。

- **节奏**：每批一个 commit，信息格式 `翻译：术语全文精翻 Bx <主题>（N 条）`；push 前跑 `STRICT_LINKS=1 npm run build`；每批完成立即更新「已精翻」清单与本表。
- **待翻清单以 stub 实时扫描为准**（跳过已翻、主题间重复的词先翻先跳过），枚举命令模板：

  ```bash
  grep -rl "glossary-stub" docs/glossary --include="*.md" | sed 's|.*glossary/||;s|\.md||' | grep -E '<关键词正则>'
  ```

| 批次 | 主题 | slug 匹配关键词 | 约数 |
| --- | --- | --- | --- |
| B2 | 高频核心补齐 | （固定清单）`fee-estimation` `multisig` `bip-39` `difficulty` `mempool` `fork` `whitepaper` `halving-halvening` `bech32m` `bip-173-bech32` `consensus-parameter` `satoshi-unit` | 12 |
| B3 | 钱包与密钥安全 | `seed\|mnemonic\|key\|wallet\|custod\|backup\|passphrase\|signature\|address\|cold\|multisig\|recovery\|entropy\|derivation\|xpub\|wif\|paper` | ~58 |
| B4 | 闪电网络 | `lightning\|htlc\|channel\|bolt\|lnurl\|gossip\|onion\|preimage\|invoice\|sphinx\|autopilot\|wumbo\|penalty` | ~40 |
| B5 | 挖矿与共识 | `mining\|miner\|hashrate\|difficulty\|proof\|consensus\|fork\|block-\|nonce\|asic\|pool\|subsidy\|halving\|retarget\|orphan\|mev` | ~68 |
| B6 | 隐私与合规 | `coinjoin\|privacy\|mixer\|wasabi\|samourai\|tumbler\|cluster\|heuristic\|analysis\|fingerprint\|kyc\|aml\|chain-` | ~15 |
| B7 | 字母序扫尾 | 不匹配上述关键词的其余全部剩余词条，每 50 条一批 | ~290 |

（各批数量按 2026-09-12 状态估算，跨批重复词以先遇到先翻、翻完自动从后续批消失为准。）

### 原创示意图（docs/public/images/）

- [x] `journey-inflation.svg` 第 1 章购买力稀释
- [x] `journey-bitcoin-stack.svg` 第 2 章比特币技术栈分层
- [x] `journey-block-lifecycle.svg` 第 3 章交易生命周期
- [x] `self-custody-flow.svg` 第 5 章自我托管决策流
- [ ] 可继续为 rabbit-holes 各篇补充

## 已知问题 / 待办

- [x] Cloudflare Pages 首次部署 + cleanUrls 验证 ✅ 2026-09-12 完成（wrangler 直传，cleanUrls 正常）
- [ ] 原站 Svelte 交互组件（7 个：SupplyChart、HalvingCountdown、UnitsConverter、KeySpaceVisualizer、MempoolHistogram、DifficultyClock、UnitsVisualization）可复刻为 Vue 组件增强对应页面；frontmatter 中原引用已删除
- [ ] 术语全文精翻（长期任务，按「glossary/ 术语表」章节的批次计划 B2→B7 逐批推进）
- [ ] `pages/terms.md`（源仓库的 Terms 页）已并入 `/about` 与术语表，不再单独翻译——如需可补
- [ ] 移动端与暗色模式抽查（已按 VitePress 默认主题设计，理论上无碍）

## 会话工作流程（每次 AI 会话必做）

1. 读 `PROGRESS.md` + `AGENTS.md`（就在仓库根目录，不用读别的文档）
2. 选一个未完成条目，按 AGENTS.md 规范干活
3. `STRICT_LINKS=1 npm run build` 验证
4. 更新本文件的 checkbox 与「最后更新」日期
5. git commit + push（每个板块一个 commit，信息用中文）
