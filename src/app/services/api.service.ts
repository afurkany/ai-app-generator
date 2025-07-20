import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ChatMessage, File, ProjectInfoResponse, ProjectResponse } from '../common/utility';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5050/api/v1';

  constructor(private http: HttpClient) {}

  getRoot(): Observable<JSON> {
    return this.http.get<JSON>(`${this.apiUrl}/`);
  }

  getProjects(): Observable<ProjectInfoResponse[]> {
    return this.http.get<ProjectInfoResponse[]>(`${this.apiUrl}/projects`);
  }

  removeAllProjects(): Observable<ProjectInfoResponse[]> {
    return this.http.delete<ProjectInfoResponse[]>(`${this.apiUrl}/projects`);
  }

  removeProject(project_id: string): Observable<ProjectInfoResponse[]> {
    let params = new HttpParams().set("project_id", project_id)
  
    return this.http.delete<ProjectInfoResponse[]>(`${this.apiUrl}/project`, { params });
  }

  addProject(folder_path: string): Observable<ProjectInfoResponse[]> {
    let params = new HttpParams().set("folder_path", folder_path)
  
    return this.http.post<ProjectInfoResponse[]>(`${this.apiUrl}/project`, null, { params });
  }

  getActiveProject(): Observable<any> { 
    return this.http.get<any>(`${this.apiUrl}/project/get`).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  setActiveProject(project_id: string): Observable<boolean> {
    let params = new HttpParams().set("project_id", project_id)
  
    return this.http.put<boolean>(`${this.apiUrl}/project/set`, null, { params });
  }

  getProjectTree(): Observable<any> { 
    return this.http.get<any>(`${this.apiUrl}/project/tree`);
  }

  updateProject(
    project_id: string,
    options: {
      files?: File[],
      model_name?: string
    } = {}
  ): Observable<ProjectResponse> {

    const files = options.files ?? null;
    const model_name = options.model_name ?? null;

    const body = {
      project_id: project_id,
      files: files,
      model_name: model_name,
    }

    return this.http.post<ProjectResponse>(`${this.apiUrl}/project/update`, body).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  getOllamaModels(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/get-ollama-models/`).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  getChatResponse(projectId: string, selectedModel: string, message: ChatMessage, isEditMessage: boolean): Observable<any> {
    const body = {
      "project_id": projectId,
      "selected_model": selectedModel,
      "message": message,
      "is_edit_message": isEditMessage,
    }

    return this.http.post<any>(`${this.apiUrl}/chat`, body).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  removeChatHistory(project_id: string): Observable<ChatMessage[]> {
    let params = new HttpParams().set("project_id", project_id)
  
    return this.http.delete<ChatMessage[]>(`${this.apiUrl}/chat/remove`, { params });
  }
}
