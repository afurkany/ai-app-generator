from fastapi.concurrency import asynccontextmanager
import uvicorn
import os
import shutil
import tempfile
import copy
import requests

from typing import Dict, List
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.chat_service import OllamaChat
from database.crud import Database


active_project = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    active_project["project_id"] = ''
    yield

app = FastAPI(lifespan=lifespan)

# Allow Angular frontend to access the API during dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:1420", "https://localhost:1420"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class File(BaseModel):
    name: str
    path: str

class ChatMessage(BaseModel):
    project_id: str
    selected_model: str
    message: Dict
    is_edit_message: bool

class UpdateProjectOptions(BaseModel):
    project_id: str
    files: List[File] | None = None
    model_name: str | None = None


@app.get("/api/v1/")
def root():
    return {"message": "Welcome to API!"}

@app.get("/api/v1/project/get")
def get_active_project():
    
    def modify_response(m: Dict):
        m.pop("project_id")
        m.pop("timestamp")
        m['id'] = m.pop('message_id')
        m['role'] = m.pop('sender')
        m['message'] = m.pop('content')
        return m

    try:
        db = Database()
        project = db.get_full_project(active_project["project_id"])
        db.close()

        modified_chat_response = copy.deepcopy(project["chat_history"])
        modified_chat_response = list(map(modify_response, modified_chat_response))
        project["chat_history"] = modified_chat_response
        
        return project
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/v1/project/set")
def set_active_project(project_id: str = Query(...)):
    try:
        active_project["project_id"] = project_id
        
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/projects")
def get_projects():
    db = Database()
    projects = db.get_projects()
    db.close()

    return projects

@app.post("/api/v1/project")
def add_project(folder_path: str = Query(...)):
    main_folder_path = Path(folder_path)
    temp_dir = os.path.join(tempfile.gettempdir(), "AI_App_Gen")
    test_folder_path = os.path.join(temp_dir, main_folder_path.name)

    # copy main folder to test folder in Temp folder
    if not os.path.exists(test_folder_path):
        shutil.copytree(main_folder_path, test_folder_path)

    db = Database()
    db.create_project(
        name=main_folder_path.name,
        main_path=folder_path,
        test_path=test_folder_path
    )
    projects = db.get_projects()
    db.close()

    return projects

@app.delete("/api/v1/project")
def remove_project(project_id: str = Query(...)):
    # remove project from the database
    db = Database()
    project = db.get_project(project_id)
    db.delete_project(project_id)
    remaining_projects = db.get_projects()
    db.close()

    # remove the project temporary folder
    temp_project_dir = project["test_folder_path"]
    if os.path.exists(temp_project_dir):
        shutil.rmtree(temp_project_dir)

    return remaining_projects

@app.delete("/api/v1/projects")
def remove_all_projects():
    # clear the database completely
    db = Database()
    db.clear_database()
    db.close()

    # remove the temporary folders
    temp_dir = os.path.join(tempfile.gettempdir(), "AI_App_Gen")
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)

    return []

@app.get("/api/v1/project/tree")
def get_project_tree():
    db = Database()
    project = db.get_project(active_project["project_id"])
    db.close()

    data_list = []
    for path in [project["main_folder_path"], project["test_folder_path"]]:
        main_path = Path(path)
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
        
        data_list.append(tree_data)

    return {
        'mainPath': project["main_folder_path"],
        'mainData': data_list[0],
        'testPath': project["test_folder_path"],
        'testData': data_list[1],
    }

@app.post("/api/v1/project/update")
def update_project(options: UpdateProjectOptions):

    # connet to db
    db = Database()

    try:
        if options.files is not None:
            db.sync_files(options.project_id, options.files)

        elif options.model_name is not None:
            db.update_project_model(options.project_id, options.model_name)
        
        # get updated project
        project = db.get_full_project(options.project_id)

        # close the db
        db.close()

        return project
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/get-ollama-models")
def get_ollama_models():
    ollama_url = "http://localhost:11434/api/tags"
    response = requests.get(ollama_url)
    if response.ok:
        models = response.json().get("models", [])
        return [model["name"] for model in models]
    else:
        e = "Failed to connect to Ollama. Is it running?"
        raise HTTPException(status_code=500, detail=str(e))
    
@app.delete("/api/v1/chat/remove")
def remove_chat_history(project_id: str = Query(...)):
    # clear the project chat database
    db = Database()
    db.delete_chat_history(project_id)
    db.close()

    return []

@app.post("/api/v1/chat")
def chat(param: ChatMessage):
    
    def modify_chat_message(m: Dict):
        m.pop("message_id")  # remove key
        m.pop("project_id")  # remove key
        m.pop("timestamp")  # remove key
        m['role'] = m.pop('sender')  # replace message key with content
        return m
    
    def modify_response(m: Dict):
        m.pop("project_id")
        m.pop("timestamp")
        m['id'] = m.pop('message_id')
        m['role'] = m.pop('sender')
        m['message'] = m.pop('content')
        return m

    try:
        # connect to db
        db = Database()

        # remove messages from db after edited message
        if param.is_edit_message:
            db.edit_chat_message(
                param.project_id,
                param.message['id'],
                param.message['role'],
                param.message['message']
            )
        else:
            # add message to the db
            db.add_message(
                param.project_id,
                param.message['id'],
                param.message['role'],
                param.message['message'],
            )

        # get complete chat history
        chat_history = db.get_chat_history(param.project_id)

        # get model response to chat history
        chat_obj = OllamaChat(param.selected_model)
        modified_chat_history = copy.deepcopy(chat_history)
        modified_chat_history = list(map(modify_chat_message, modified_chat_history))
        role, content = chat_obj.get_response(modified_chat_history)

        # add model response to db
        db.add_message(
            param.project_id,
            param.message['id'] + 1,
            role,
            content,
        )

        # add assistant message to chat history
        chat_history = db.get_chat_history(param.project_id)
        modified_chat_response = copy.deepcopy(chat_history)
        modified_chat_response = list(map(modify_response, modified_chat_response))
        db.close()

        return modified_chat_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=5050)
