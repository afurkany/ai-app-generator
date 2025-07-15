import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ChatMessage, ProjectInfo } from '../common/utility';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5050/api/v1';

  constructor(private http: HttpClient) {}

  getRoot(): Observable<JSON> {
    return this.http.get<JSON>(`${this.apiUrl}/`);
  }

  getProjects(): Observable<ProjectInfo[]> {
    return this.http.get<ProjectInfo[]>(`${this.apiUrl}/projects`);
  }

  removeAllProjects(): Observable<ProjectInfo[]> {
    return this.http.delete<ProjectInfo[]>(`${this.apiUrl}/projects`);
  }

  removeProject(file_path: string): Observable<ProjectInfo[]> {
    let params = new HttpParams().set("file_path", file_path)
  
    return this.http.delete<ProjectInfo[]>(`${this.apiUrl}/project`, { params });
  }

  addProject(file_path: string): Observable<ProjectInfo[]> {
    let params = new HttpParams().set("file_path", file_path)
  
    return this.http.post<ProjectInfo[]>(`${this.apiUrl}/project`, null, { params });
  }

  getProjectTree(file_path: string): Observable<ProjectInfo[]> {
    let params = new HttpParams().set("file_path", file_path)
  
    return this.http.get<ProjectInfo[]>(`${this.apiUrl}/project/tree`, { params });
  }

  getChatResponse(projectId: number, chatHistory: ChatMessage[]): Observable<any> {
    const body = {
      "chat_history": chatHistory,
      "project_id": projectId,
    }

    return this.http.post<any>(`${this.apiUrl}/chat`, body).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    );
  }
}
