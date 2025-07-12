import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

import { ModelTypeSelection, ChatMessage } from '../../common/utility';

import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import { TranslateService } from '../../services/translate.service';
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

  userMessage: ChatMessage = { role: 'user', message: '' };
  chatHistory: ChatMessage[] = [
    {
      role: 'assistant',
      message: `
      It is a simple command.
      You can use "ng g c <component_name>" in the terminal.
      `
    },
    {
      role: 'assistant',
      message: 'Yes, sure. How can I help you?'
    },
    {
      role: 'user',
      message: 'I have a problem with Angular application.'
    }
  ];

  @ViewChild('chatContentDiv') private chatContentDiv!: ElementRef<HTMLDivElement>;
  @ViewChild('codeBlock') codeBlock!: ElementRef;

  constructor (
    public translateService: TranslateService,
  ) {}

  ngOnInit() {
    // THE BELOW LINE TO BE DELETED LATER
    this.chatHistory = Array(10).fill(this.chatHistory).flat();

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
    const userMessage = { ...this.userMessage };

    // check if message content is empty
    if (!userMessage.message.trim()) {
      this.userMessage.message = '';
      return
    }

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

  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.chatContentDiv.nativeElement;
      el.scrollTop = el.scrollHeight;
    }, 100);
  }
}
