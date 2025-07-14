import { AfterViewInit, Component, ElementRef, inject, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { SafeHtml } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ModelTypeSelection, ChatMessage } from '../../common/utility';
import { RemoveChatHistoryDialogComponent } from '../../shared/remove-chat-history-dialog/remove-chat-history-dialog.component';
import { EditMessageDialogComponent } from '../../shared/edit-message-dialog/edit-message-dialog.component';
import { CopyMessageSnackbarComponent } from '../../shared/copy-message-snackbar/copy-message-snackbar.component';

import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import { TranslateService } from '../../services/translate.service';
import { SetupService } from '../../services/setup.service';
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
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    TextFieldModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewInit {
  selectedValue: string = '';

  tabs = ["tab1", "tab2", "tab3"];

  models: ModelTypeSelection[] = [
    { key: 'qwen2.5:7b', value: 'qwen2.5:7b' },
    { key: 'qwen3:1.3b', value: 'qwen3:1.3b' },
    { key: 'qpt-o3', value: 'qpt-o3' },
  ];

  codeContent: SafeHtml = '';
  highlightedLines: string[] = [];
  scrollAtBottomPosition = 0;
  isDisplayScrollBottomButton: boolean = false;

  userMessage: ChatMessage = { id: -1, role: 'user', message: '' };
  chatWelcomeMessage: string = '';
  chatHistory: ChatMessage[] = [
    {
      id: 1,
      role: 'user',
      message: "Hey! I have a problem with Angular application."
    },
    {
      id: 2,
      role: 'user',
      message: 'How can I create a component in Angular?'
    },
    {
      id: 3,
      role: 'assistant',
      message: 'It is a simple command.\nYou can just use "ng g c <component_name>" in the terminal.'
    },
    {
      id: 4,
      role: 'user',
      message: 'I got it thanks! I want to ask anpther question!'
    },
    {
      id: 5,
      role: 'assistant',
      message: 'Yes, please.'
    },
  ];

  @ViewChild('chatContentDiv') private chatContentDiv!: ElementRef<HTMLDivElement>;
  @ViewChild('codeBlock') codeBlock!: ElementRef;
  
  readonly dialog = inject(MatDialog);

  private _snackBar = inject(MatSnackBar);
  durationInSeconds = 1.5;

  constructor (
    private setupService: SetupService,
    public translateService: TranslateService,
  ) {}

  ngOnInit() {
    // THE BELOW LINE TO BE DELETED LATER
    // this.chatHistory = Array(10).fill(this.chatHistory).flat();
    // this.chatHistory = [];

    this.chatWelcomeMessage = this.getWelcomeMessage();
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

    userMessage.id = this.chatHistory.length + 1;
    this.chatHistory.push(userMessage);
    this.userMessage.message = '';
    this.scrollToBottom();
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
      if (result === true) {
        this.chatHistory = [];
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
        const index = this.chatHistory.findIndex((message) => message.id === id);

        if (index !== -1) {
          this.chatHistory[index].message = this.setupService.activeUserMessage;
          this.chatHistory = [...this.chatHistory.slice(0, index + 1)];
        }
      }
    });
  }

  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.chatContentDiv.nativeElement;
      el.scrollTop = el.scrollHeight;
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
