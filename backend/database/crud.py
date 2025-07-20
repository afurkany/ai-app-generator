import uuid
import sqlite3

from typing import Dict, List, Literal, Optional
from datetime import datetime
from pathlib import Path


class Database:

    def __init__(self):
        root_folder = Path.cwd()
        self.conn = sqlite3.connect(root_folder / "backend/database/app.db")
        self.cursor = self.conn.cursor()

        self.cursor.execute("PRAGMA foreign_keys = ON")

    # --- Project Operations ---
    def create_project(self, name: str, main_path: str, test_path: str, model: str=None) -> str:
        project_id = str(uuid.uuid4())
        now = datetime.now().isoformat()
        
        self.cursor.execute("""
        INSERT INTO Project (project_id, project_name, creation_date, last_modification_date,
                             main_folder_path, test_folder_path, model_name)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (project_id, name, now, now, main_path, test_path, model))
        
        self.conn.commit()

        return project_id
    
    def get_projects(self) -> Optional[dict]:
        self.cursor.execute("SELECT * FROM Project")

        rows = self.cursor.fetchall()

        return [dict(zip([d[0] for d in self.cursor.description], row)) for row in rows]

    def get_project(self, project_id: str) -> Optional[dict]:
        self.cursor.execute("SELECT * FROM Project WHERE project_id = ?", (project_id,))

        row = self.cursor.fetchone()
        if row:
            keys = [d[0] for d in self.cursor.description]
            return dict(zip(keys, row))

        return None
    
    def get_full_project(self, project_id: str) -> dict:
        project = self.get_project(project_id)
        if not project:
            return None
        project["files"] = self.get_files(project_id)
        project["chat_history"] = self.get_chat_history(project_id)
        return project

    def update_project_model(self, project_id: str, new_model: str):
        now = datetime.now().isoformat()
        
        self.cursor.execute("""
        UPDATE Project SET model_name = ?, last_modification_date = ?
        WHERE project_id = ?
        """, (new_model, now, project_id))

        self.conn.commit()

    def delete_project(self, project_id: str):
        self.cursor.execute("DELETE FROM Project WHERE project_id = ?", (project_id,))
        self.conn.commit()

        # remove all project files
        self.delete_all_project_files(project_id)

        # remove project chat history
        self.delete_chat_message(project_id)

    # --- File Operations ---
    def add_file(self, project_id: str, file_name: str, file_path: str):
        self.cursor.execute("""
        INSERT OR REPLACE INTO File (project_id, file_name, file_path)
        VALUES (?, ?, ?)
        """, (project_id, file_name, file_path))

        self.conn.commit()

    def delete_file(self, project_id: str, file_path: str):
        self.cursor.execute("DELETE FROM File WHERE project_id = ? AND file_path = ?", (project_id, file_path))
        self.conn.commit()

    def get_files(self, project_id: str) -> List[dict]:
        self.cursor.execute("SELECT * FROM File WHERE project_id = ?", (project_id,))

        rows = self.cursor.fetchall()

        return [dict(zip([d[0] for d in self.cursor.description], row)) for row in rows]

    def sync_files(self, project_id: str, incoming_files: List[Dict]):
        # fetch current files
        self.cursor.execute("SELECT file_name FROM File WHERE project_id = ?", (project_id,))
        current_files = {row[0] for row in self.cursor.fetchall()}
        new_files = {f.name for f in incoming_files}

        to_delete = current_files - new_files
        to_insert = new_files - current_files
        to_update = current_files & new_files

        # While deleting, there is no need to check for insert or update because of their different trigger methods in front-end
        if len(to_delete) > 0:
            for name in to_delete:
                self.cursor.execute("DELETE FROM File WHERE project_id = ? AND file_name = ?", (project_id, name))
            
            self.conn.commit()
            return

        # While inserting, also check for updating
        for f in incoming_files:
            if f.name in to_insert:
                self.cursor.execute(
                    "INSERT INTO File (project_id, file_name, file_path) VALUES (?, ?, ?)",
                    (project_id, f.name, f.path)
                )
            elif f.name in to_update:
                self.cursor.execute(
                    "UPDATE File SET file_path = ? WHERE project_id = ? AND file_name = ?",
                    (f.path, project_id, f.name)
                )

        self.conn.commit()

    def delete_all_project_files(self, project_id: str):
        self.cursor.execute("DELETE FROM File WHERE project_id = ?", (project_id,))
        self.conn.commit()

    # --- Message Operations ---
    def add_message(self, project_id: str, message_id: int, sender: Literal['user', 'assistant'], content: str):
        timestamp = datetime.now().isoformat()
        
        self.cursor.execute("""
        INSERT INTO Message (project_id, message_id, timestamp, sender, content)
        VALUES (?, ?, ?, ?, ?)
        """, (project_id, message_id, timestamp, sender, content))

        self.conn.commit()

    def get_chat_history(self, project_id: str) -> List[dict]:
        self.cursor.execute("""
        SELECT * FROM Message WHERE project_id = ? ORDER BY message_id ASC
        """, (project_id,))

        rows = self.cursor.fetchall()

        return [dict(zip([d[0] for d in self.cursor.description], row)) for row in rows]

    def edit_chat_message(self, project_id: str, message_id: int, role: str, new_content: str):
        # remove messages after new message
        self.cursor.execute(
            "DELETE FROM Message WHERE project_id = ? AND message_id >= ?",
            (project_id, message_id)
        )
        self.conn.commit()

        # add new message
        self.add_message(project_id, message_id, sender=role, content=new_content)

    def delete_chat_history(self, project_id: str):
        self.cursor.execute("DELETE FROM Message WHERE project_id = ?", (project_id,))
        self.conn.commit()

    # --- Clear Database ---
    def clear_database(self):
        # delete child tables (File, Message) before Project
        self.cursor.execute("DELETE FROM File")
        self.cursor.execute("DELETE FROM Message")
        self.cursor.execute("DELETE FROM Project")
        self.conn.commit()

    def close(self):
        self.conn.close()
