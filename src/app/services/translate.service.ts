import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private currentLang = 'en';
  private translations: any = {};

  constructor(private http: HttpClient) {}

  // Promise<void> = indicates asynchronous behavior
  // It returns nothing directly (just a signal of completion).
  async loadTranslations(lang: string): Promise<void> {
    const data = await firstValueFrom(this.http.get(`/assets/i18n/${lang}.json`));
    this.translations = data;
    this.currentLang = lang;
  }

  get(key: string): string {
    return key.split('.').reduce((obj, k) => obj?.[k], this.translations) || key;
  }

  use(lang: string): Promise<void> {
    return this.loadTranslations(lang);
  }

  getCurrentLang(): string {
    return this.currentLang;
  }
}
