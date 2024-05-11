import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeStore } from '@ng-lab/core';

@Component({
  selector: 'lib-theme-toggle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  public store = inject(ThemeStore);
}
