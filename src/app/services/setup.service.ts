import { Injectable } from '@angular/core';
import { Project } from '../common/utility';

@Injectable({
  providedIn: 'root'
})
export class SetupService {

  project: Project[] = [
    {
      name: "trial project",
      path: "sample_path",
      files: [],
    }
  ];

  constructor() { }
}
