# PROGRESS · 开发进度台账

> **给接手的 AI / 开发者：本文件是唯一可信进度源。完成任何条目后，立刻回来更新这里的 checkbox 和统计数字，并同步推送到 GitHub。** 开发规范见 [AGENTS.md](AGENTS.md)。
>
> 最后更新：2026-09-13（术语精翻 B7 字母序扫尾第一批完成 50/50，累计 268/476；第二批 50 条从 `bip-85` 起，断点详情见下方「B7 断点」）

## 总览

| 板块 | 总量 | 已完成 | 状态 |
| --- | --- | --- | --- |
| 框架（VitePress 配置/主题/首页/导览页） | — | ✅ | 完成 |
| journey/ 学习之旅 | 6 | 6 | ✅ 全文翻译完成 |
| rabbit-holes/ 深度专题 | 17 | 0 | ⏳ 待翻译 |
| pages/ 实用页面（privacy/security/node） | 3 | 3 | ✅ 重写完成（本站语境） |
| glossary/ 术语表（标题+短定义） | 476 | 476 | ✅ 全部完成并生成页面 |
| glossary/ 术语表（全文精翻） | 476 | 268 | ⏳ 进行中，按下方批次计划推进（B7 第一批已完成） |
| 原创中文示意图 | 5 | 5 | ✅ 首批完成（可继续扩充） |
| 交互组件（原站 Svelte widget 的 Vue 复刻） | 7 | 0 | ⏳ 未开始，非必需 |
| Cloudflare Pages 部署 | — | ✅ | 已上线 https://wiki.btchao.com（旧域名 btc-wiki-7oo.pages.dev / btc-wiki.pages.dev） |

## 构建与部署

```bash
npm install
npm run build                  # 常规构建
STRICT_LINKS=1 npm run build   # 严格模式：死链会让构建失败（推送前必跑）
npm run glossary:gen           # 重新生成未翻译的术语页（不覆盖已有文件）
npm run glossary:sidebar       # 重新生成术语侧边栏
```

- Cloudflare Pages：**Git 集成自动构建为主，wrangler 直传为兜底**。生产域名 https://wiki.btchao.com （自定义域），https://btc-wiki.pages.dev 为项目默认域（2026-09-13 实测变更，详见下条）。
  - **2026-09-13 现状**：当前 wrangler 账号（0471666@gmail.com）的项目是 `000-wiki-btchao-com`（域名 btc-wiki.pages.dev + wiki.btchao.com），已接入 Git 集成——push 到 main 后约 1 分钟自动构建上线（commit 9a9614c 实测）；旧说明中的项目名 `btc-wiki`（btc-wiki-7oo.pages.dev）在本账号不存在，该域名内容已落后（仍是 stub），后续以 wiki.btchao.com / btc-wiki.pages.dev 为准。
  - 手动部署命令（Git 构建失败时兜底）：`npm run build && npx wrangler pages deploy docs/.vitepress/dist --project-name=000-wiki-btchao-com --branch=main`（本机 npx/npm 不在 PATH 时用 `node /usr/local/lib/node_modules/npm/bin/npm-cli.js exec -- wrangler ...`）。
  - Git 自动构建产出的全站 476+ 页面已抽查：journey、rabbit-holes、SVG 图片、395 个 stub 术语页全部 200 正常（2026-09-13 实测），说明构建命令（可能仍是缺 `docs` 参数的 `npx vitepress build`）已被根目录兜底配置救活。
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
- 已精翻（197）：`address` `private-key` `public-key` `seed-phrase` `wallet` `node` `mining` `transaction` `block` `blockchain` `hash` `utxo-unspent-transaction-output` `lightning-network`；B2 批（12）：`fee-estimation` `multisig` `bip-39` `difficulty` `mempool` `fork` `whitepaper` `halving-halvening` `bech32m` `bip-173-bech32` `consensus-parameter` `satoshi-unit`；B3 批（56）：`address-clustering` `address-derivation-path` `address-indexing` `address-reuse` `b32-address` `burn-address` `green-address` `stealth-address` `vanity-address` `custodial-lightning-wallet` `custodial-wallet` `deterministic-wallet` `gui-wallet` `hardware-wallet` `hd-wallet-hierarchical-deterministic-wallet` `hdm-multi-signature-hd-wallet` `hierarchical-deterministic-wallet` `watch-only-wallet` `wasabi-wallet` `hardware-seed-vault` `inheritance-seed-backup` `mnemonic-entropy-bits` `mnemonic-password` `seed-entropy-mixer` `seed-tool` `paper-wallet` `exchange-api-key` `key-aggregation` `key-generation-ceremony` `key-pool` `key-rotation` `key-split` `key-wiping` `wallet-import-format-wif` `xpub-extended-public-key` `adapter-signature` `ecdsa-elliptic-curve-digital-signature-algorithm` `low-r-signatures` `low-s-signatures` `mono-signature` `partial-signature` `proof-keys` `quorum-signatures` `schnorr-signature` `signature-aggregation` `signature-clipping` `p2pk-pay-public-key` `p2pkh-pay-public-key-hash` `p2wpkh-pay-witness-public-key-hash` `k-k-multisig` `hierarchical-multisig` `lurking-wife-mode` `not-your-keys-not-your-coins` `paper-hands` `self-custody` `static-channel-backup-scb`；B4 批闪电网络（49）：`payment-channel` `state-channel` `lightning-channel` `lightning-channel-capacity` `balanced-channel-lightning` `inactive-channel` `delayed-payment-channel` `escrowed-lightning-channel` `lightning-channel-splicing` `audiobook-model-lightning` `htlc-hashed-time-locked-contract` `htlc-invoice` `htlc-preimage-manager` `lightning-invoice` `lightning-refund-invoice` `lightning-payment` `atomic-multi-path-payment-amp` `lightning-routing` `routing-node` `onion-routing-lightning` `lightning-sphinx` `gossip-protocol-lightning` `lightning-gossip-pruning` `peer-discovery` `peer-bookmark` `peer-management` `lightning-node` `lightning-node-alias` `core-lightning-c-lightning` `lightning-network-daemon-lnd` `bridge-node-lightning` `autopilot-lightning` `lightning-network-penalty` `penalty-transaction` `delayed-justice-transaction` `fraudulent-channel-close` `bolt` `bolt-11` `wumbo-channels-lightning` `jamming-attack-ln` `jammed-htlc-detector` `lightning-probe` `lightning-anchor-commitment` `churn-lightning` `lockup-period-lightning` `eltoo` `submarine-swap` `loop-inout` `liquidity-ads`；B5 批挖矿与共识（67，2026-09-13 完成）：`proof-work-pow` `hash-puzzle` `hash-rate` `hash-rate-derivative` `nonce` `nonce-exhaustion` `block-header` `block-height` `block-time` `block-reward` `block-subsidy` `mining-subsidy` `merkle-proof` `merkle-inclusion-proof` `miner` `cpu-mining` `gui-miner` `retail-mining` `mining-rig` `mining-software` `mining-algorithm` `mining-front-end` `proprietary-mining-firmware` `asic-application-specific-integrated-circuit` `asic-resistance` `asicboost` `miner-capitulation` `mining-pool` `pooled-mining` `pool-hopping` `merged-mining` `mining-colocation` `geographic-mining-distribution` `block-propagation` `competitive-block-propagation` `competitive-mining` `orphan-block` `miner-orphan-rate` `fork-detection` `fork-watcher` `block-explorer` `block-size` `difficulty-retargeting` `mining-centralization` `hidden-miner-tax` `energy-fud` `stranded-energy` `curtailment` `methane-mitigation-mining` `miner-extractable-value-mev` `proof-of-reserves` `fraud-proof` `block-size-war` `bip-101-increase-block-size` `bip-102-2mb-block-size` `bip-9-versionbits` `bip-91` `bip-148-uasf` `bip-34` `bip-65-opchecklocktimeverify` `bip-170-txout-proof` `bip-35-mempool-message` `bip-36-merkle-block-request` `checklocktimeverify-cltv` `deployment-threshold-soft-fork` `locked-period-soft-fork` `soft-fork`；B6 批隐私与合规（21，2026-09-13 完成）：`coinjoin` `shielded-coinjoin` `joinmarket` `joinstr` `payjoin` `whirlpool-samourai` `chain-analysis` `dust` `dust-attack` `dust-limit` `dust-sweeping` `eavesdropping-attack` `eclipse-attack` `celsius-genesis-3ac-cluster` `kyc-know-your-customer` `aml-anti-money-laundering` `greenlist` `silent-payments` `tor-hidden-service` `i2p-invisible-internet-project` `json-rpc-over-tor`；B7 第一批（50，2026-09-13 完成）：`absolute-fee` `absolute-locktime` `accelerator` `air-gapped` `airdrop-btc-fork` `alt-season` `altcoin` `anti-sybil-mechanism` `anyprevout` `asmap` `asymptote` `atomic-swap` `atomic-swap-refill` `authorized-participant` `batch-transaction` `bear-market` `bip-113` `bip-119-ctv` `bip-125-replace-fee` `bip-143` `bip-144-segwit-relay` `bip-152-compact-blocks` `bip-155-addr-v2` `bip-158` `bip-159` `bip-176-bits-denomination` `bip-22-getblocktemplate` `bip-30` `bip-300-drivechains` `bip-301` `bip-31-pong-message` `bip-32` `bip-339-wtxid-relay` `bip-341` `bip-342-tapscript` `bip-360` `bip-361` `bip-37` `bip-40-alerts-avoid-replay` `bip-42` `bip-44` `bip-47-payment-codes` `bip-50` `bip-61` `bip-66` `bip-68-relative-locktime` `bip-69` `bip-70-payment-protocol` `bip-75-payment-protocol-enhancements` `bip-8`（剩余 208 条，核对：`grep -rl "glossary-stub" docs/glossary/ | wc -l`）

### B7 断点（2026-09-13，B7 第一批已全部完成 50/50，累计 268/476；B7 剩余 208 条，第二批 50 条已定，见下）

> 下个会话直接按下方清单推进，不用重新枚举。源文件在 `/Users/xw/.zcode/workspace/learnbitcoin-content/glossary/<slug>.md`，本会话未读过，需现读。每 50 条一个 commit。

- **B7 待翻总清单 = 全部剩余 stub（208 条，2026-09-13 实扫）**，枚举命令（C locale 字母序）：
  `grep -rl "glossary-stub" docs/glossary --include="*.md" | sed 's|.*glossary/||;s|\.md||' | LC_ALL=C sort`
- **B7 第一批（前 50 条）✅ 2026-09-13 完成**（`absolute-fee` 至 `bip-8`，全部清单见上方「已精翻」B7 段）。
- **B7 第二批（50 条，2026-09-13 实扫，从 `bip-85` 起）**：`bip-85` `bip-bitcoin-improvement-proposal` `bitcoin-atm` `bitcoin-bond` `bitcoin-bridge` `bitcoin-cash` `bitcoin-client` `bitcoin-core` `bitcoin-core-rpc` `bitcoin-days-destroyed` `bitcoin-dev-kit-bdk` `bitcoin-dominance` `bitcoin-faucet` `bitcoin-governance` `bitcoin-inheritance-planning` `bitcoin-knots` `bitcoin-pizza-day` `bitcoin-satellite` `bitcoin-script` `bitcoin-sv-bsv` `bitcoin-vault` `bitlicense` `blockfi` `bloom-filter` `branch-and-bound-bnb` `bull-market` `byzantine-fault-tolerance` `cbdc-central-bank-digital-currency` `centralized-exchange-cex` `chain-flag-day` `chain-split` `chain-visualization` `chaincode` `change-output` `changeless-transaction` `checksequenceverify-csv` `checktemplateverify-ctv` `clawback-mechanism` `clearing-price` `cme-cf-bitcoin-reference-rate` `coin-age` `coin-control` `coin-freeze` `coin-selection` `coinbase-transaction` `coingrinder` `colored-coins` `consolidation-transaction` `constant-time` `corrupted-chain-state`；第三批从 `counterparty-risk` 起按实扫清单顺延。
- **划入 B7 的历史误捕词（B6 扫描备注）**：`chain-flag-day` `chain-split` `chain-visualization` `corrupted-chain-state` `longest-chain-rule`（共识/分叉主题）与 `accelerator` `node-operator` `output-descriptor`（tor 正则误捕）；`merkle-root` `merkle-tree-merkle-root` `merkleized-abstract-syntax-tree-mast` `segwit2x` 及 `bip-30` `bip-37` `bip-143` `bip-144` `bip-339` `bip-360` `bip-361` 等都在上面 258 条清单内，无需单独处理。
- **本机环境备忘（2026-09-13 实测仍有效）**：
  - 源内容仓库在 `/Users/xw/.zcode/workspace/learnbitcoin-content`。
  - `npm` 不在 PATH：`STRICT_LINKS=1 node /usr/local/lib/node_modules/npm/bin/npm-cli.js run build`（本会话实测通过，46s）。
  - `tools/glossary-zh.json` 结构为每行一条 `"<slug>": {"t":"标题","s":"短定义"},`，不要整体重写；小改动用 node 精准替换。
  - slug 校验脚本 `/tmp/zhq.cjs`（重启丢失，一行重建）：`const zh = require('<repo>/tools/glossary-zh.json'); for (const s of process.argv.slice(2)) console.log(s + ' => ' + (zh[s] ? zh[s].t : 'MISSING'));`
  - 深度专题链接格式 `/rabbit-holes/<slug>`（复数）；源仓库写的 `/rabbit-hole/`（单数）是错的。
  - 部署：push 到 main 后 CF Git 集成约 1 分钟自动构建上线（项目 `000-wiki-btchao-com`，域名 wiki.btchao.com / btc-wiki.pages.dev）；Git 构建失败才需 wrangler 手动兜底。

### 术语全文精翻 · 续接批次计划（新会话照此推进）

> 工作流（读源文件→重写页面文件→相关词条链接）见 `AGENTS.md`「术语表工作流 · 全文精翻」。原「建议第一批」中有 7 个 slug 在源数据中不存在（cold-storage、hot-wallet、bech32、consensus、confirmation、sat、halving 均为概念名而非真实 slug），已用真实 slug 修正。

- **节奏**：每批一个 commit，信息格式 `翻译：术语全文精翻 Bx <主题>（N 条）`；push 前跑 `STRICT_LINKS=1 npm run build`；每批完成立即更新「已精翻」清单与本表。
- **待翻清单以 stub 实时扫描为准**（跳过已翻、主题间重复的词先翻先跳过），枚举命令模板：

  ```bash
  grep -rl "glossary-stub" docs/glossary --include="*.md" | sed 's|.*glossary/||;s|\.md||' | grep -E '<关键词正则>'
  ```

| 批次 | 主题 | slug 匹配关键词 | 约数 |
| --- | --- | --- | --- |
| B2 | 高频核心补齐 ✅ 2026-09-12 完成 | （固定清单）`fee-estimation` `multisig` `bip-39` `difficulty` `mempool` `fork` `whitepaper` `halving-halvening` `bech32m` `bip-173-bech32` `consensus-parameter` `satoshi-unit` | 12 |
| B3 | 钱包与密钥安全 ✅ 2026-09-13 完成（56/56） | `seed\|mnemonic\|key\|wallet\|custod\|backup\|passphrase\|signature\|address\|cold\|multisig\|recovery\|entropy\|derivation\|xpub\|wif\|paper` | 56 |
| B4 | 闪电网络 ✅ 2026-09-13 完成（49/49，清单见历史） | `lightning\|htlc\|channel\|bolt\|lnurl\|gossip\|onion\|preimage\|invoice\|sphinx\|autopilot\|wumbo\|penalty` | 49 |
| B5 | 挖矿与共识 ✅ 2026-09-13 完成（67/67，清单见历史） | `mining\|miner\|hashrate\|difficulty\|proof\|consensus\|fork\|block-\|nonce\|asic\|pool\|subsidy\|halving\|retarget\|orphan\|mev` | 67 |
| B6 | 隐私与合规 ✅ 2026-09-13 完成（21/21，清单见历史） | `coinjoin\|privacy\|mixer\|samourai\|tumbler\|cluster\|heuristic\|fingerprint\|kyc\|aml\|dust\|payjoin\|joinmarket\|silent\|tor\|i2p\|eclipse` | 21 |
| B7 | 字母序扫尾（第一批 50 条 ✅ 2026-09-13 完成，断点清单见上方） | 不匹配上述关键词的其余全部剩余词条，每 50 条一批 | 208 |

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
