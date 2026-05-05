#!/usr/bin/env bash

packages=("lua" "neovim" "swaync" "swaylock" "grimblast" "grim" "mpv" "waybar" "wofi" "kitty" "hypridle" "ripgrep" "nodejs" "npm" "hyprpicker" "nautilus" "discord" "proton-vpn-gtk-app" "veracrypt" "catppuccin-gtk-theme-mocha" "cronie" "pavucontrol")
configs=("hypr" "kitty" "mpv" "swaylock" "swaync" "waybar" "wofi")

set -euo pipefail

ensure_yay() {
    if command -v yay &>/dev/null; then
        return 0
    fi

    echo "➜ yay not found. Installing yay from AUR..."

    if ! command -v git &>/dev/null; then
        echo "➜ git not found. Installing git first..."
        sudo pacman -S --noconfirm git
    fi

    local tmp_dir
    tmp_dir=$(mktemp -d)
    trap "rm -rf '$tmp_dir'" EXIT

    git clone https://aur.archlinux.org/yay.git "$tmp_dir"
    (cd "$tmp_dir" && makepkg -si --noconfirm)

    echo "✔ yay installed successfully."
}

install_package() {
    local pkg="$1"

    if pacman -Qi "$pkg" &>/dev/null; then
        echo "✔ '$pkg' is already installed."
    elif pacman -Si "$pkg" &>/dev/null; then
        echo "➜ '$pkg' found in repos. Installing..."
        sudo pacman -S --noconfirm "$pkg"
        echo "✔ '$pkg' installed successfully."
    else
        echo "✘ '$pkg' not found in official repos. Trying AUR (yay)..."
        yay -S --noconfirm "$pkg"
        echo "✔ '$pkg' installed from AUR."
    fi
}

install_jetbrains_nerd_font() {
    local font_dir="$HOME/.local/share/fonts/JetBrainsMonoNerdFont"

    if fc-list | grep -qi "JetBrainsMono Nerd Font"; then
        echo "✔ JetBrainsMono Nerd Font is already installed."
        return 0
    fi

    echo "➜ Installing JetBrainsMono Nerd Font..."

    local version
    version=$(curl -s https://api.github.com/repos/ryanoasis/nerd-fonts/releases/latest \
        | grep '"tag_name"' | cut -d'"' -f4)

    local tmp_dir
    tmp_dir=$(mktemp -d)
    trap "rm -rf '$tmp_dir'" EXIT

    curl -fLo "$tmp_dir/JetBrainsMono.tar.xz" \
        "https://github.com/ryanoasis/nerd-fonts/releases/download/${version}/JetBrainsMono.tar.xz"

    mkdir -p "$font_dir"
    tar -xf "$tmp_dir/JetBrainsMono.tar.xz" -C "$font_dir"

    fc-cache -fv "$font_dir" &>/dev/null

    echo "✔ JetBrainsMono Nerd Font installed successfully (${version})."
}

sudo pacman -Syu --noconfirm
ensure_yay

for pkg in "${packages[@]}"; do
    install_package "$pkg"
done

install_jetbrains_nerd_font

if [ ! -d "$HOME/dotfiles" ]; then
    echo "➜ Cloning dotfiles..."
    git clone https://github.com/saiakat/dotfiles.git "$HOME/dotfiles"
fi

if [ ! -d "$HOME/.config" ]; then
  echo "making config dir" 
  mkdir -p "$HOME/.config"
fi

for conf in "${configs[@]}"; do
    ln -sf "$HOME/dotfiles/$conf" "$HOME/.config/$conf"
    echo "✔ Linked $conf"
done

if [ ! -d "$HOME/.config/nvim" ]; then
  echo "➜ Cloning nvim config..."
  git clone https://github.com/saiakat/neovim-config "$HOME/.config/nvim"
  npm install -g tree-sitter-cli
fi

