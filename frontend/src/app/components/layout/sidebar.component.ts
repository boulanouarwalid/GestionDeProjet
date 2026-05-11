import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon"><i class="bi bi-lightning-charge-fill"></i></div>
        <span class="brand-text">ControleApp</span>
      </div>

      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <i class="bi bi-grid-1x2-fill nav-icon"></i>
          <span class="nav-label">Dashboard</span>
        </a>
        <a routerLink="/projets" routerLinkActive="active" class="nav-item">
          <i class="bi bi-folder-fill nav-icon"></i>
          <span class="nav-label">Projets</span>
        </a>
        <a routerLink="/taches" routerLinkActive="active" class="nav-item">
          <i class="bi bi-check2-square nav-icon"></i>
          <span class="nav-label">Taches</span>
        </a>
        <a routerLink="/budgets" routerLinkActive="active" class="nav-item">
          <i class="bi bi-wallet2 nav-icon"></i>
          <span class="nav-label">Budgets</span>
        </a>
        <a routerLink="/depenses" routerLinkActive="active" class="nav-item">
          <i class="bi bi-credit-card nav-icon"></i>
          <span class="nav-label">Depenses</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="footer-card">
          <div class="footer-text">Spring Boot + Angular</div>
          <div class="footer-sub">Controle Budgetaire</div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      background: var(--bg-secondary);
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      z-index: 100;
      overflow-y: auto;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 20px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .brand-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: var(--gradient-blue);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: white;
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    }

    .brand-text {
      font-size: 1.1rem;
      font-weight: 700;
      background: linear-gradient(135deg, #f1f5f9, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 500;
      transition: all var(--transition-base);
      position: relative;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-primary);
    }

    .nav-item.active {
      background: rgba(59, 130, 246, 0.1);
      color: #60a5fa;
    }

    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 24px;
      background: var(--accent-blue);
      border-radius: 0 3px 3px 0;
    }

    .nav-icon {
      font-size: 1.1rem;
      width: 24px;
      text-align: center;
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid var(--border-subtle);
    }

    .footer-card {
      padding: 14px;
      border-radius: var(--radius-md);
      background: rgba(59, 130, 246, 0.06);
      border: 1px solid rgba(59, 130, 246, 0.1);
    }

    .footer-text {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .footer-sub {
      font-size: 0.7rem;
      color: var(--text-muted);
      margin-top: 2px;
    }
  `]
})
export class SidebarComponent {}
