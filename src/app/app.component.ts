import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { IOptions } from './core/interfaces/i-options';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    Tooltip,
    ButtonModule,
    SelectButton,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'horario-laboral';
  currentYear: number = new Date().getFullYear();
  routes: IOptions[] = [];
  workdayOptions: IOptions[] = [
    { name: '7.5 horas', value: 7.5 },
    { name: '8 horas', value: 8 }
  ];
  selectedRoute: any = {};
  selectedWorkdayOptions: any = { name: '7.5 horas', value: 7.5 };

}
