# Oro Github CLI / OGH

- [Overview](#overview)
- [Installation](#installation)
- [Example](#example)
- [Methods](#methods)

<hr>

## Overview

Oro GitHub CLI is a tool that connects to GitHub to automate tasks related to agile management,
such as creating issues with a merge request and their corresponding metadata all togheter.

<hr>

## Installation

```shell
npm install -g oro-github-cli
```

### On Linux

Currently, this library uses `libsecret` so you may need to install it before running `npm install`.

Depending on your distribution, you will need to run the following command:

- Debian/Ubuntu: `sudo apt-get install libsecret-1-dev`.
- Red Hat-based: `sudo yum install libsecret-devel`.
- Arch Linux: `sudo pacman -S libsecret`.

<hr>

## Example:

```bash
# verbose
$> ogh new-task

# alias
$> ogh nt
```

<hr>

## Methods

<hr>

- [New task `ogh nt`](#new-task-ogh-nt)

<hr>

### New task `ogh nt`

```bash
# verbose
$> ogh new-task

# alias
$> ogh nt
```
