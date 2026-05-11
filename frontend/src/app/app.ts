import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/layout/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar />
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
      background: var(--bg-primary);
      background-image: var(--gradient-mesh);
    }

    .main-content {
      flex: 1;
      margin-left: var(--sidebar-width);
      padding: 32px 36px;
      min-height: 100vh;
    }

    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
        padding: 20px 16px;
      }
    }
  `]
})
export class AppComponent {}
