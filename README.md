# dotfiles-desktop

niri（Debian Wayland 平铺窗口管理器）

## 安装 / 重建软链（GNU stow）

```bash
brew install stow      # macOS；Debian 用 apt install stow
stow -d ~/dotfiles -t ~/.config desktop
```

`.stow-local-ignore` 里排除了 `aerospace`：AeroSpace 未安装，那份配置只作存档，不参与链接。

## 撤销

```bash
stow -D -d ~/dotfiles -t ~/.config desktop
```

> **注意**：`.stow-local-ignore` 会**替换** stow 的默认忽略列表（不是追加）。所以必须显式列出 `^/\.git$`、`^/\.gitignore$`，否则 stow 会把它们也链到 `~/.config` 里。
