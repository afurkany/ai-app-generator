import { AfterViewInit, Component, ElementRef, inject, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { SafeHtml } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ModelTypeSelection, ChatMessage, Project, ProjectResponse } from '../../common/utility';
import { RemoveChatHistoryDialogComponent } from '../../shared/remove-chat-history-dialog/remove-chat-history-dialog.component';
import { EditMessageDialogComponent } from '../../shared/edit-message-dialog/edit-message-dialog.component';
import { CopyMessageSnackbarComponent } from '../../shared/copy-message-snackbar/copy-message-snackbar.component';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';

import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import { TranslateService } from '../../services/translate.service';
import { SetupService } from '../../services/setup.service';
import { ApiService } from '../../services/api.service';
import { map, switchMap, take } from 'rxjs';
hljs.registerLanguage('python', python);


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    TextFieldModule,
    LoadingIndicatorComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewInit {

  isResponseLoading: boolean = false;

  tabs = ["tab1", "tab2", "tab3"];

  project: Project | null = null; 
  modelControl = new FormControl<ModelTypeSelection | null>(null, Validators.required);
  models: ModelTypeSelection[] = [];
  selectedModel: string = '';

  codeContent: SafeHtml = '';
  highlightedLines: string[] = [];
  scrollAtBottomPosition = 0;
  isApiInProgress: boolean = false;
  isDisplayScrollBottomButton: boolean = false;
  isOllamaInstalled: boolean = true;

  userMessage: ChatMessage = { id: -1, role: 'user', message: '' };
  chatWelcomeMessage: string = '';
  chatHistory: ChatMessage[] = [];

  @ViewChild('chatContentDiv') private chatContentDiv!: ElementRef<HTMLDivElement>;
  @ViewChild('codeBlock') codeBlock!: ElementRef;
  
  readonly dialog = inject(MatDialog);

  private _snackBar = inject(MatSnackBar);
  durationInSeconds = 1.5;

  constructor (
    private setupService: SetupService,
    private apiService: ApiService,
    public translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.isApiInProgress = true;

    // get active project and compare with ollama models
    this.apiService.getOllamaModels().pipe(
      take(1),
      switchMap(models =>
        this.setupService.activeProject$.pipe(
          take(1),
          map(project => ({ models, project }))
        )
      )
    ).subscribe(({ models, project }) => {
      this.models = models.map(model => ({ key: model, value: model }));
      if (project) {
        this.project = project;
        this.selectedModel = models.includes(project.modelName) ? project.modelName : '';
        this.chatHistory = project.chatHistory;
      }
      this.isApiInProgress = false;
    });
    
    // select welcome message randomly 
    this.chatWelcomeMessage = this.getWelcomeMessage();

    // read python script file
    fetch('assets/scripts/trial_script.py')
      .then(res => res.text())
      .then(data => {
        const highlighted = hljs.highlight(data, { language: 'python' }).value;
        this.highlightedLines = highlighted.split('\n');
        this.codeContent = highlighted;
      });
  }

  ngAfterViewInit() {
    hljs.highlightAll();
    this.scrollToBottom();
  }

  onTabChange(event: any) {
    if (event.index === 0) {
      this.scrollToBottom();
    }
  }

  onSendMessageClick() {
    let userMessage = { ...this.userMessage };

    // check if message content is empty
    if (!userMessage.message.trim()) {
      this.userMessage.message = '';
      return
    }

    this.isResponseLoading = true;
    userMessage.id = this.chatHistory.length + 1;
    this.chatHistory.push(userMessage);

    this.userMessage.message = '';
    this.scrollToBottom();

    if (this.project) {
      this.apiService.getChatResponse(
        this.project.projectId,
        this.selectedModel,
        this.chatHistory[this.chatHistory.length - 1],
        false
      ).subscribe((response: ChatMessage[]) => {
        this.chatHistory = [... response];
        this.scrollToBottom();
        this.isResponseLoading = false;
      })
    }
  }

  onEnterPressed(event: any): void {
    // Use shift + enter for wew line
    if (event.shiftKey) {
      this.scrollToBottom();
      return;
    }

    event.preventDefault();
    this.onSendMessageClick();
  }

  onScrollBelowButtonClick() {
    this.scrollToBottom();
  }

  onChatContentScroll() {
    // Check if scroll is at the bottom. Otherwise, show scroll bottom button.
    const el = this.chatContentDiv.nativeElement;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;

    if (atBottom) {
      this.isDisplayScrollBottomButton = false;
    } else {
      this.isDisplayScrollBottomButton = true;
    }
  }

  onRemoveChatHistoryDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(RemoveChatHistoryDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true && this.project) {
        this.apiService.removeChatHistory(this.project.projectId).subscribe(() => {
          this.chatHistory = [];
        });
      }
    });
  }

  onCopyUserMessage(message: string) {
    navigator.clipboard.writeText(message)
    .then(() => {
      this._snackBar.openFromComponent(CopyMessageSnackbarComponent, {
        duration: this.durationInSeconds * 1000,
      });
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  onEditUserMessage(enterAnimationDuration: string, exitAnimationDuration: string, id: number) {
    const dialogRef = this.dialog.open(EditMessageDialogComponent, {
      width: '600px',
      maxHeight: '800px',
      minHeight: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterOpened().subscribe(() => {
      const foundMessage = this.chatHistory.find((message) => message.id === id);

      if (foundMessage) {
        this.setupService.activeUserMessage = foundMessage.message;
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.isResponseLoading = true;
        const index = this.chatHistory.findIndex((message) => message.id === id);

        if (index !== -1 && this.project) {
          this.chatHistory[index].message = this.setupService.activeUserMessage;
          this.chatHistory = [...this.chatHistory.slice(0, index + 1)];
          this.apiService.getChatResponse(
            this.project.projectId,
            this.selectedModel,
            this.chatHistory[this.chatHistory.length - 1],
            true
          ).subscribe((response: ChatMessage[]) => {
            this.chatHistory = [... response];
            this.scrollToBottom();
            this.isResponseLoading = false;
          })
        }
      }
    });
  }

  onSelectedModelChange() {
    if (this.project) {
      const project_id = this.project.projectId;
      this.apiService.updateProject(
        project_id, { model_name: this.selectedModel }
      ).subscribe((updatedProject: ProjectResponse) => {
        this.project = this.setupService.convertProjectResponse(updatedProject);
      });
    }
  }

  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatHistory.length > 0) {
        const el = this.chatContentDiv.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 100);
  }

  private getWelcomeMessage(): string {
    let messageList = [
      "Hello, nice to see you! Let's develop our app!",
      "What's on your mind today? Let me help you!",
      "Hey, are you ready to develop?",
      "Hey yo, I was waiting for you! Let's dive in our app!"
    ];
    let random = messageList.sort(() => 0.5 - Math.random())[0];
    return random
  }
}
