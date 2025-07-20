import sqlite3
import os

from pathlib import Path


def initialize_db():
    # get current workspace folder path
    root_folder = Path.cwd()
    db_path = root_folder / "backend/database/app.db"
    if os.path.exists(db_path):
        os.remove(db_path)
        print("Database removed!")

    # create connection
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # enable foreign key constraints
    cursor.execute("PRAGMA foreign_keys = ON")

    # Project table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Project (
        project_id TEXT PRIMARY KEY,
        project_name TEXT NOT NULL,
        creation_date TEXT NOT NULL,
        last_modification_date TEXT NOT NULL,
        main_folder_path TEXT NOT NULL,
        test_folder_path TEXT NOT NULL,
        model_name TEXT
    )
    """)

    # File table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS File (
        project_id TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        FOREIGN KEY(project_id) REFERENCES Project(project_id) ON DELETE CASCADE,
        PRIMARY KEY(project_id, file_path)
    )
    """)

    # Message table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Message (
        project_id TEXT NOT NULL,
        message_id INTEGER NOT NULL,
        timestamp TEXT NOT NULL,
        sender TEXT CHECK(sender IN ('user', 'assistant')) NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY(project_id) REFERENCES Project(project_id) ON DELETE CASCADE
        PRIMARY KEY(project_id, message_id)
    )
    """)

    conn.commit()
    conn.close()


if __name__ == "__main__":
    initialize_db()
    print("Database tables recreated.")
