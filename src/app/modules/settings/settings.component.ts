import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCommonModule } from 'app/core/project-common-modules/project-common.module';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [ProjectCommonModule, CommonModule],
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  splitLetters(text: string): string[] {
    return text.split('').map((c) => (c === ' ' ? '\u00A0' : c));
  }

}
