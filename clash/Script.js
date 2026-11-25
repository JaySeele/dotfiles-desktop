// Define main function (script entry)
//
// 1) opencode.ai 固定走「故障转移」组（fallback），不要落到兜底 MATCH 规则里
//    手工选中的单个节点。
//
// 原因（2026-10-01 排查）：opencode.ai 没有专门规则 → 落到 MATCH → BV用户后台! 组。
// 该组手工选中台湾节点时会 stall，mihomo 日志报
//   [TCP] ...(node) --> opencode.ai:443 error: timeout: no recent network activity
// 隧道断开后 dsh 的 OpenAI/Anthropic SDK 就报 "Connection error."（TRANSPORT）。
// fallback 组会自动跳过挂掉的节点，避免死守一个坏节点。
//
// ⚠️ 不要改成 DIRECT：GPT/Grok 系模型在 OpenCode Go 上要求非大陆出口，
//    实测 DIRECT 会返回 403 unsupported_country_region_territory。
//
// 2) www.bing.com / r.bing.com 提到最前面走 DIRECT
//
// 原因（2026-11-09 排查）：订阅自带的 `DOMAIN,www.bing.com,🔥ChatGPT` 让 Bing
// 走代理节点，实测搜索 12.0s、联想接口 www.bing.com/osjson.aspx 4.5s；
// 同样请求直连只要 0.4～0.5s，而 cn.bing.com 本来就有 DIRECT 规则（0.4s）。
// www.bing.com 本身会 302 跳到 cn.bing.com，走代理纯属绕远路。
// 注意只放行 www/r，Copilot 依赖的 sydney.bing.com、edgeservices.bing.com、
// bingviz、bingapis 保持走代理不动。
//
// 注意：本机 Clash Verge 是 2.5.2，**不支持 merge profile 的 prepend-rules**
// （写了会被当未知键原样塞进生成的配置，mihomo 直接忽略）；2.5.2 支持的是
// 这个 Script profile，所以在 main() 里改 config.rules。

function main(config, profileName) {
  config.rules = config.rules || [];

  // 后 unshift 的排在最前，两者互不冲突，顺序无所谓
  const DIRECT_HOSTS = [
    'DOMAIN,r.bing.com,DIRECT',
    'DOMAIN,www.bing.com,DIRECT',
  ];
  for (const r of DIRECT_HOSTS) {
    if (!config.rules.includes(r)) config.rules.unshift(r);
  }

  // 3) 翻译相关（2026-11-24）：微软翻译接口走代理会被 reset（直连 453ms 返回），
  //    Brave 自带翻译的 widget 走代理 6.8s、直连 2.1s。
  const TRANS = [
    'DOMAIN,edge.microsoft.com,DIRECT',
    'DOMAIN,translate.brave.com,♻️自动选择',
  ];
  for (const r of TRANS) {
    if (!config.rules.includes(r)) config.rules.unshift(r);
  }

  // 4) GitHub / OpenCode 使用自动测速组，避免固定节点偶发失效。
  //    实测：GitHub 直连会超时，原 BV用户后台! 固定节点偶发失败；
  //    ♻️自动选择 对两站点均能返回，适合 Clash 长期开启。
  const STABLE_HOSTS = [
    'DOMAIN-SUFFIX,github.com,♻️自动选择',
    'DOMAIN-SUFFIX,opencode.ai,♻️自动选择',
  ];
  for (const r of STABLE_HOSTS) {
    if (!config.rules.includes(r)) config.rules.unshift(r);
  }

  return config;
}
