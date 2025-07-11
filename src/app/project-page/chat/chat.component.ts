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
  chatHistory: ChatMessage[] = [
    {
      role: 'user',
      message: 'Hello, can you help me for an issue?'
    },
    {
      role: 'assistant',
      message: 'Yes, sure. How can I help you?'
    },
    {
      role: 'user',
      message: 'I have a problem with Angular application.'
    },
    {
      role: 'user',
      message: 'I cannot create a component. How should I do it?'
    },
    {
      role: 'assistant',
      message: 'It is a simple command. You can use "ng g c <component_name>" in the terminal.'
    },
    {
      role: 'assistant',
      message: `
      It is a simple command.
      You can use "ng g c <component_name>" in the terminal.
      `
    },
    {
      role: 'user',
      message: 'Hello, can you help me for an issue?'
    },
    {
      role: 'assistant',
      message: 'Yes, sure. How can I help you?'
    },
    {
      role: 'user',
      message: 'I have a problem with Angular application.'
    },
    {
      role: 'user',
      message: 'I cannot create a component. How should I do it?'
    },
    {
      role: 'assistant',
      message: 'It is a simple command. You can use "ng g c <component_name>" in the terminal.'
    },
    {
      role: 'assistant',
      message: `
      It is a simple command.
      You can use "ng g c <component_name>" in the terminal.
      `
    },
    {
      role: 'user',
      message: 'Hello, can you help me for an issue?'
    },
    {
      role: 'assistant',
      message: 'Yes, sure. How can I help you?'
    },
    {
      role: 'user',
      message: 'I have a problem with Angular application.'
    },
    {
      role: 'user',
      message: 'I cannot create a component. How should I do it?'
    },
    {
      role: 'assistant',
      message: 'It is a simple command. You can use "ng g c <component_name>" in the terminal.'
    },
    {
      role: 'assistant',
      message: `
      It is a simple command.
      You can use "ng g c <component_name>" in the terminal.
      `
    },
    {
      role: 'user',
      message: 'Hello, can you help me for an issue?'
    },
    {
      role: 'assistant',
      message: 'Yes, sure. How can I help you?'
    },
    {
      role: 'user',
      message: 'I have a problem with Angular application.'
    },
    {
      role: 'user',
      message: 'I cannot create a component. How should I do it?'
    },
    {
      role: 'assistant',
      message: 'It is a simple command. You can use "ng g c <component_name>" in the terminal.'
    },
    {
      role: 'assistant',
      message: `
      It is a simple command.
      You can use "ng g c <component_name>" in the terminal.
      `
    },
    {
      role: 'user',
      message: 'Hello, can you help me for an issue?'
    },
    {
      role: 'assistant',
      message: 'Yes, sure. How can I help you?'
    },
    {
      role: 'user',
      message: 'I have a problem with Angular application.'
    },
    {
      role: 'user',
      message: 'I cannot create a component. How should I do it?'
    },
    {
      role: 'assistant',
      message: 'It is a simple command. You can use "ng g c <component_name>" in the terminal.'
    },
    {
      role: 'assistant',
      message: `
      It is a simple command.
      You can use "ng g c <component_name>" in the terminal.
      `
    },
    {
      role: 'user',
      message: 'Hello, can you help me for an issue?'
    },
    {
      role: 'assistant',
      message: 'Yes, sure. How can I help you?'
    },
    {
      role: 'user',
      message: 'I have a problem with Angular application.'
    },
    {
      role: 'user',
      message: 'I cannot create a component. How should I do it?'
    },
    {
      role: 'assistant',
      message: 'It is a simple command. You can use "ng g c <component_name>" in the terminal.'
    },
    {
      role: 'assistant',
      message: `
      It is a simple command.
      You can use "ng g c <component_name>" in the terminal.
      `
    },
    {
      role: 'user',
      message: 'Hello, can you help me for an issue?'
    },
    {
      role: 'assistant',
      message: 'Yes, sure. How can I help you?'
    },
    {
      role: 'user',
      message: 'I have a problem with Angular application.'
    },
    {
      role: 'user',
      message: 'I cannot create a component. How should I do it?'
    },
    {
      role: 'assistant',
      message: 'It is a simple command. You can use "ng g c <component_name>" in the terminal.'
    },
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
    },
    {
      role: 'user',
      message: 'I cannot create a component. How should I do it?'
    },
    {
      role: 'assistant',
      message: 'It is a simple command. You can use "ng g c <component_name>" in the terminal.'
    },
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
    },
    {
      role: 'user',
      message: 'I cannot create a component. How should I do it?'
    },
    {
      role: 'assistant',
      message: 'It is a simple command. You can use "ng g c <component_name>" in the terminal.'
    },
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
    },
    {
      role: 'user',
      message: 'I cannot create a component. How should I do it?'
    },
    {
      role: 'assistant',
      message: 'It is a simple command. You can use "ng g c <component_name>" in the terminal.'
    },
    {
      role: 'assistant',
      message: `
      Hey there!!!
      `
    },
  ];

  @ViewChild('codeBlock') codeBlock!: ElementRef;

  constructor () {}

  ngOnInit() {
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
  }

  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }
}
