---
title: Clash Verge Rev 公共分流配置同步说明
tags:
  - Computer
  - Clash
  - Git
  - 网络配置
type: 配置说明
date: 2026-11-26
---

# Clash Verge Rev 公共分流配置同步说明

本仓库只保存**公共分流配置**，不保存机场订阅链接、节点密码、UUID 或其他账号凭据。

---

## 仓库文件

| 文件 | 作用 |
|---|---|
| `Script.js` | 自动把 GitHub、OpenCode 切换到自动测速组；Bing 走直连；翻译服务按规则分流 |
| `Merge.yaml` | Clash Verge Rev 的公共合并配置 |

> [!danger] 不要把敏感配置上传到公共仓库
> 不要上传 `profiles.yaml`、远程订阅生成的节点 YAML、订阅链接、日志、备份目录，也不要把包含 `password`、`uuid`、`token` 的文件提交到 GitHub/Gitee。

---

## 一、先安装 Clash Verge Rev

在新设备安装 Clash Verge Rev，并先在软件中添加自己的机场订阅。

**订阅链接需要在每台设备上单独添加，本仓库没有保存订阅链接。**

添加订阅后，先确认 Clash 能正常更新节点并启动内核，再导入本仓库的两个文件。

---

## 二、macOS 安装路径

Clash Verge Rev 的用户配置目录是：

```text
~/Library/Application Support/io.github.clash-verge-rev.clash-verge-rev/
```

其中公共配置应放在：

```text
~/Library/Application Support/io.github.clash-verge-rev.clash-verge-rev/profiles/
```

### 终端复制命令

在仓库目录执行：

```bash
cd /path/to/clash

PROFILE="$HOME/Library/Application Support/io.github.clash-verge-rev.clash-verge-rev/profiles"
cp Script.js "$PROFILE/Script.js"
cp Merge.yaml "$PROFILE/Merge.yaml"
```

如果仓库就是默认位置：

```bash
cd ~/Git/desktop/clash

PROFILE="$HOME/Library/Application Support/io.github.clash-verge-rev.clash-verge-rev/profiles"
cp Script.js "$PROFILE/Script.js"
cp Merge.yaml "$PROFILE/Merge.yaml"
```

---

## 三、在 Clash Verge Rev 中启用

复制文件后：

1. 打开 Clash Verge Rev。
2. 进入「订阅」或「Profiles」页面。
3. 找到当前使用的远程订阅。
4. 确认该订阅的：
   - **Merge / 合并配置** 指向 `Merge.yaml`
   - **Script / 脚本** 指向 `Script.js`
5. 点击「重新载入配置」或重新选择一次当前订阅。
6. 必要时重启 Clash Verge Rev。

如果界面没有自动识别这两个文件，可以在 Profiles 页面手动导入：

- `Merge.yaml` 作为 Merge 配置导入；
- `Script.js` 作为 Script 配置导入；
- 再把它们绑定到当前远程订阅。

> [!warning] 不要覆盖整个 `verge.yaml`
> `verge.yaml` 保存的是本机界面布局、端口、系统代理开关等设备级设置。不同设备不应直接互相覆盖。

---

## 四、Windows 和 Linux 的路径

不同版本的 Clash Verge Rev 目录名称可能略有差异，优先在软件的「打开配置目录」功能中定位 `profiles` 文件夹。

常见路径如下：

### Windows

```text
%APPDATA%\\io.github.clash-verge-rev.clash-verge-rev\\profiles\\
```

### Linux

```text
~/.local/share/io.github.clash-verge-rev.clash-verge-rev/profiles/
```

将本仓库的 `Script.js` 和 `Merge.yaml` 放入对应的 `profiles` 目录，然后在 Clash Verge Rev 的 Profiles 页面重新载入。

---

## 五、验证规则是否生效

在 Clash Verge Rev 的规则页面检查前几条规则，应该能看到类似内容：

```text
DOMAIN-SUFFIX,opencode.ai,♻️自动选择
DOMAIN-SUFFIX,github.com,♻️自动选择
DOMAIN,www.bing.com,DIRECT
DOMAIN,r.bing.com,DIRECT
DOMAIN,edge.microsoft.com,DIRECT
```

也可以直接访问：

- <https://github.com>
- <https://opencode.ai>
- <https://www.bing.com>

如果网站仍然打不开，先检查：

1. Clash 内核是否正在运行；
2. 系统代理是否打开；
3. 当前订阅节点是否过期；
4. 自动测速组是否选中了可用节点；
5. 是否需要为新的域名添加专门规则。

---

## 六、同步更新

在本机更新仓库后，其他设备执行：

```bash
git pull
```

然后重新复制：

```bash
PROFILE="$HOME/Library/Application Support/io.github.clash-verge-rev.clash-verge-rev/profiles"
cp Script.js "$PROFILE/Script.js"
cp Merge.yaml "$PROFILE/Merge.yaml"
```

最后在 Clash Verge Rev 中重新载入当前配置。

---

## 七、安全检查

提交前确认仓库中没有敏感字段：

```bash
grep -RInE 'password:|uuid:|token=|secret:|/api/v1/client/|subscribe\?token=' . --exclude-dir=.git --exclude=README.md
```

如果命令输出了节点密码、UUID、订阅 token 或订阅 URL，**不要提交**。

一旦敏感信息已经上传到公共仓库：

1. 立即在机场面板重置订阅链接；
2. 能重置节点 UUID/password 的，一并重置；
3. 删除公共仓库历史中的敏感文件；
4. 不要只做普通删除，因为 Git 历史仍可能保留旧内容。

---

> [!tip] 推荐同步方式
> 订阅链接在每台设备上手动添加；公共 Git 仓库只同步 `Script.js` 和 `Merge.yaml`。这样既能同步分流规则，也不会把机场凭据暴露出去。

---
