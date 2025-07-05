# AI Based App Generator

This repository provides a test-driven application generation process to the users.

The project is still in development phase. The readme will be update when the first release is done.

## Tauri + Angular + Python

The project was initiated based on template of Tauri and Angular.

For request handling Python api is created using FastAPI.

## Recommended IDE and Extension Setup

[VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) + [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template).

## Installation and First Run

* Angular: you need to install node modules so ensure that you have nodejs 22.3.0 or above.
    * Use: `npm install` in the root directory to start installation process.
* Tauri: after the node module installation, you can use `npm run tauri dev` command to start the application.
    * The first run of the application will take some time due to Rust compiling during building the application.
* Python: you need to have Python installed on your desktop and install `uv` as the package manager.
    * As the first step, create a .venv folder using: `uv venv --python 3.12`
    * Then, use `uv sync` to start syncronization process with pyproject.toml.
    * Run the python script using:
        * `cd backend`
        * `python main.py`
        Note: you can also use debugging for sure.

After all the steps mentioned above, you can refresh the app page by right clicking on the page and selecting refresh (shortcut: CTRL + R).
