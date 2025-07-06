import { Routes } from "@angular/router";
import { HomePageComponent } from "./home-page/home-page.component";
import { ProjectPageComponent } from "./project-page/project-page.component";

export const appRoutes: Routes = [
	{ path: '', component: HomePageComponent },
	{ path: 'project', component: ProjectPageComponent }
];
