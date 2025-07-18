import uvicorn
import os
import copy
import requests

from typing import Dict, List
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.chat_service import OllamaChat

app = FastAPI()

# Allow Angular frontend to access the API during dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:1420", "https://localhost:1420"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

file_path = Path(__file__)
projects = [
        {
            "name": "test-project-01",
            "path": file_path.parents[2] / "test_projects/test-project-01",
        },
        {
            "name": "test-project-02",
            "path": file_path.parents[2] / "test_projects/test-project-02",
        },
        {
            "name": "test-project-02",
            "path": file_path.parents[2] / "test_projects/test-project-03",
        },
        {
            "name": "test-project-04",
            "path": file_path.parents[2] / "test_projects/test-project-04",
        },
        {
            "name": "test-project-05",
            "path": file_path.parents[2] / "test_projects/test-project-05",
        },
        {
            "name": "test-project-06",
            "path": file_path.parents[2] / "test_projects/test-project-06",
        },
        {
            "name": "test-project-07",
            "path": file_path.parents[2] / "test_projects/test-project-07",
        },
        {
            "name": "test-project-08",
            "path": file_path.parents[2] / "test_projects/test-project-08",
        }
    ]

class ChatMessage(BaseModel):
    project_id: int
    selected_model: str
    chat_history: List[Dict]

@app.get("/api/v1/")
def root():
    return {"message": "Welcome to API!"}

@app.get("/api/v1/projects")
def get_projects():
    return projects

@app.delete("/api/v1/projects")
def remove_all_projects():
    projects.clear()

    return projects

@app.delete("/api/v1/project")
def remove_project(file_path: str = Query(...)):
    for project in projects:
        if str(project["path"]) == file_path:
            projects.remove(project)
            break

    return projects

@app.post("/api/v1/project")
def add_project(file_path: str = Query(...)):
    path = Path(file_path)
    projects.append(
        {
            "name": path.name,
            "path": path,
        }
    )

    return projects

@app.get("/api/v1/project/tree")
def get_project_tree(file_path: str = Query(...)):
    main_path = Path(file_path)
    tree_data = {}
    len_main_path_parts = len(main_path.parts)

    for root, dirs, files in os.walk(main_path, topdown=True):
        current_path = Path(root)
        current_folder_name = current_path.name
        root_level = len(current_path.parts) - len_main_path_parts + 1

        tree_data[current_folder_name] = {}
        tree_data[current_folder_name]["child_folder"] = dirs
        tree_data[current_folder_name]["child_file"] = files
        tree_data[current_folder_name]["level"] = root_level

    return tree_data

@app.get("/api/v1/get-ollama-models")
def get_ollama_models():
    ollama_url = "http://localhost:11434/api/tags"
    response = requests.get(ollama_url)
    if response.ok:
        models = response.json().get("models", [])
        return [model["name"] for model in models]
    else:
        error = "Failed to connect to Ollama. Is it running?"
        raise HTTPException(status_code=500, detail=str(error))

@app.post("/api/v1/chat")
def chat(param: ChatMessage):
    
    def modify(x: Dict):
        x.pop("id")  # remove id key from dict
        x['content'] = x.pop('message')  # replace message key with content
        return x

    try:
        chat_obj = OllamaChat(param.selected_model)
        modified_chat_history = copy.deepcopy(param.chat_history)
        modified_chat_history = list(map(modify, modified_chat_history))
        role, content = chat_obj.get_response(modified_chat_history)

        param.chat_history.append({
            "id": len(param.chat_history) + 1,
            "role": role,
            "message": content,
        })

        return param.chat_history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=5050)
