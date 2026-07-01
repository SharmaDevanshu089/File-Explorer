# 📂 File Explorer

A lightweight, high-performance file explorer built with **Tauri**, **Rust**, and **React**.

[![Tauri Version](https://img.shields.io/badge/Tauri-v2.0-blue?logo=tauri)](https://tauri.app/)
[![React Version](https://img.shields.io/badge/React-v19.0-blue?logo=react)](https://react.dev/)
[![Rust Version](https://img.shields.io/badge/Rust-1.75+-brown?logo=rust)](https://www.rust-lang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-0.1.0-orange)](package.json)

---

## 🚀 Overview

This project leverages Rust for memory-safe, fast system-level operations and React for a minimal, modular frontend. The primary goal is to provide a fast, responsive alternative to heavier desktop applications, with planned integrations for native OS visual treatments (such as Windows Mica and Acrylic effects).

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vite.dev/)
- **Backend/Desktop wrapper**: [Tauri v2](https://tauri.app/)
- **Systems Language**: [Rust](https://www.rust-lang.org/)
- **State/Styling**: Vanilla CSS, React Hooks

---

## 📂 Project Structure

```text
├── .vscode/               # VS Code configurations
├── public/                # Static public assets
├── src/                   # Frontend React + TypeScript application
│   ├── assets/            # Frontend asset files (images, icons)
│   ├── App.css            # Styles for the application
│   ├── App.tsx            # Main React component
│   └── main.tsx           # React entry point
├── src-tauri/             # Rust Backend Tauri Application
│   ├── capabilities/      # Tauri permission capabilities
│   ├── icons/             # App icons for various platforms
│   ├── src/
│   │   ├── lib.rs         # Tauri core setup & command handler definitions
│   │   └── main.rs        # App entry point
│   ├── Cargo.toml         # Rust dependencies config
│   └── tauri.conf.json    # Tauri system configuration
├── index.html             # Application HTML entry point
├── package.json           # Frontend dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

---

## ⚙️ Getting Started

### 📋 Prerequisites

Before running the application, make sure you have the following installed on your system:

1. **Node.js**: Version 18.0 or higher.
2. **Rust & Cargo**: Installing via [rustup](https://rustup.rs/) is recommended.
3. **OS Build Tools**:
   - **Windows**: [Build Tools for Visual Studio 2022](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (make sure to select "C++ build tools").
   - **macOS**: Xcode Command Line Tools (`xcode-select --install`).
   - **Linux**: System packages for `webkit2gtk`, `glib`, `libsoup`, etc. (See the [Tauri Linux Setup Guide](https://tauri.app/start/prerequisites/)).

### 🔧 Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/SharmaDevanshu089/File-Explorer.git
   cd File-Explorer
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

### 🖥️ Development

To start the development server with live reloading for both Rust backend and React frontend, run:

```bash
npm run tauri dev
```


### 📦 Build & Release

To compile a production-ready installer package for your operating system:

```bash
npm run tauri build
```

---

## 📌 Versioning & Changelog

This project adheres to **Semantic Versioning (SemVer)**. 

### Changelog Protocol
When introducing changes to the codebase, please document:
- Any new dependencies added to `Cargo.toml` or `package.json`.
- Changes to build commands, environment variables, or run instructions.
- Significant architectural changes or new core features.

### Release History

| Version | Date | Description | Status |
| :--- | :--- | :--- | :--- |
| `0.1.0` | 2026-07-01 | Initial Tauri v2 React boilerplate setup. | **Current** |

---

## 🗺️ Roadmap & Planned Features


