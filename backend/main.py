import uvicorn
import json
import os

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

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

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=5050)
