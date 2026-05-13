import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/layout/sidebar.component';
import { DataCacheService } from './services/data-cache.service';

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
      background: var(--void);
      background-image: var(--mesh);
    }

    .main-content {
      flex: 1;
      margin-left: var(--sidebar-w);
      padding: 32px 36px;
      min-height: 100vh;
      position: relative;
    }

    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
        padding: 20px 16px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(private cache: DataCacheService) {}

  ngOnInit() {
    // Pre-fetch all data once at startup — every component gets it instantly
    this.cache.init();
  }
}
