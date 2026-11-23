#!/bin/sh
# desktop 组：niri 需要软链；aerospace 仅存档（AeroSpace 未安装，配置固定读 ~/.aerospace.toml）
set -eu
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
link="$HOME/.config/niri"
if [ -L "$link" ]; then
  printf 'ok    %s -> %s\n' "$link" "$(readlink "$link")"
elif [ -e "$link" ]; then
  printf 'skip  %s 已存在且不是软链\n' "$link"
else
  ln -s "$repo_dir/niri" "$link"
  printf 'link  %s -> %s\n' "$link" "$repo_dir/niri"
fi
printf 'note  aerospace 未安装，配置仅作存档：%s/aerospace\n' "$repo_dir"
