import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">

      <!-- Ambient glow orbs -->
      <div class="orb orb-top"></div>
      <div class="orb orb-bottom"></div>

      <!-- Brand -->
      <div class="brand">
        <div class="brand-mark">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L17.32 6.5V15.5L10 20L2.68 15.5V6.5L10 2Z" fill="url(#hex-grad)" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
            <path d="M10 6L14.33 8.5V13.5L10 16L5.67 13.5V8.5L10 6Z" fill="rgba(255,255,255,0.12)"/>
            <defs>
              <linearGradient id="hex-grad" x1="2.68" y1="2" x2="17.32" y2="20" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#4f8fff"/>
                <stop offset="100%" stop-color="#8b5cf6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="brand-text-group">
          <span class="brand-name">Controle</span>
          <span class="brand-sub">Project Suite</span>
        </div>
      </div>

      <!-- Nav label -->
      <div class="nav-section-label">Navigation</div>

      <!-- Nav items -->
      <nav class="nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <span class="nav-icon-wrap">
            <svg class="nav-svg" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="7" height="7" rx="2" fill="currentColor" opacity="0.9"/>
              <rect x="11" y="2" width="7" height="7" rx="2" fill="currentColor" opacity="0.5"/>
              <rect x="2" y="11" width="7" height="7" rx="2" fill="currentColor" opacity="0.5"/>
              <rect x="11" y="11" width="7" height="7" rx="2" fill="currentColor" opacity="0.7"/>
            </svg>
          </span>
          <span class="nav-label">Dashboard</span>
          <span class="nav-pip"></span>
        </a>

        <a routerLink="/projets" routerLinkActive="active" class="nav-item">
          <span class="nav-icon-wrap">
            <svg class="nav-svg" viewBox="0 0 20 20" fill="none">
              <path d="M2 6C2 4.9 2.9 4 4 4H8L10 6H16C17.1 6 18 6.9 18 8V15C18 16.1 17.1 17 16 17H4C2.9 17 2 16.1 2 15V6Z" fill="currentColor" opacity="0.85"/>
            </svg>
          </span>
          <span class="nav-label">Projets</span>
          <span class="nav-pip"></span>
        </a>

        <a routerLink="/taches" routerLinkActive="active" class="nav-item">
          <span class="nav-icon-wrap">
            <svg class="nav-svg" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.6"/>
              <path d="M7 10L9 12L13 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="nav-label">Taches</span>
          <span class="nav-pip"></span>
        </a>

        <a routerLink="/budgets" routerLinkActive="active" class="nav-item">
          <span class="nav-icon-wrap">
            <svg class="nav-svg" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="5" width="16" height="12" rx="2.5" fill="currentColor" opacity="0.8"/>
              <path d="M2 8H18" stroke="rgba(255,255,255,0.3)" stroke-width="1.2"/>
              <rect x="5" y="11" width="4" height="2" rx="1" fill="rgba(255,255,255,0.5)"/>
              <circle cx="14" cy="12" r="1.5" fill="rgba(255,255,255,0.6)"/>
            </svg>
          </span>
          <span class="nav-label">Budgets</span>
          <span class="nav-pip"></span>
        </a>

        <a routerLink="/depenses" routerLinkActive="active" class="nav-item">
          <span class="nav-icon-wrap">
            <svg class="nav-svg" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.6"/>
              <path d="M10 6V7M10 13V14M7.5 8.5C7.5 7.67 8.17 7 9 7H11C11.83 7 12.5 7.67 12.5 8.5C12.5 9.33 11.83 10 11 10H9C8.17 10 7.5 10.67 7.5 11.5C7.5 12.33 8.17 13 9 13H11C11.83 13 12.5 12.33 12.5 11.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="nav-label">Depenses</span>
          <span class="nav-pip"></span>
        </a>

        <a routerLink="/depenses/detail" routerLinkActive="active" class="nav-item nav-sub-item">
          <span class="nav-icon-wrap">
            <svg class="nav-svg" viewBox="0 0 20 20" fill="none">
              <path d="M3 12h14M3 6h14M8 10h4M3 16h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="nav-label">Analyse Détaillée</span>
          <span class="nav-pip"></span>
        </a>
      </nav>

      <!-- Spacer -->
      <div class="flex-spacer"></div>

      <!-- Footer -->
      <div class="sidebar-footer">
        <div class="footer-status">
          <span class="status-dot"></span>
          <span class="status-text">API Connected</span>
        </div>
        <div class="footer-stack">Spring Boot · Angular 21</div>
      </div>

    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-w);
      height: 100vh;
      position: fixed;
      top: 0; left: 0;
      background: linear-gradient(180deg, var(--abyss) 0%, var(--deep) 100%);
      border-right: 1px solid var(--glass-3);
      display: flex;
      flex-direction: column;
      z-index: 100;
      overflow: hidden;
    }

    /* Ambient orbs */
    .orb {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(60px);
      opacity: 0.18;
    }
    .orb-top {
      width: 200px; height: 200px;
      top: -60px; left: -60px;
      background: radial-gradient(circle, var(--a-azure), transparent 70%);
      animation: breathe 6s ease-in-out infinite;
    }
    .orb-bottom {
      width: 160px; height: 160px;
      bottom: -40px; right: -40px;
      background: radial-gradient(circle, var(--a-violet), transparent 70%);
      animation: breathe 8s ease-in-out infinite reverse;
    }

    /* Brand */
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 22px 20px 18px;
      border-bottom: 1px solid var(--glass-2);
      position: relative;
    }

    .brand-mark {
      width: 38px; height: 38px;
      border-radius: var(--r-md);
      background: var(--glass-3);
      border: 1px solid var(--glass-4);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 0 20px rgba(79,143,255,0.15);
    }

    .brand-text-group { display:flex; flex-direction:column; gap:1px; }

    .brand-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: var(--ink-0);
      letter-spacing: -0.02em;
      line-height: 1;
    }

    .brand-sub {
      font-size: 0.65rem;
      color: var(--ink-4);
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    /* Nav section label */
    .nav-section-label {
      font-size: 0.62rem;
      font-weight: 700;
      color: var(--ink-5);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      padding: 18px 20px 8px;
    }

    /* Nav */
    .nav {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 0 10px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 10px 12px;
      border-radius: var(--r-md);
      color: var(--ink-4);
      font-size: 0.85rem;
      font-weight: 500;
      transition: all var(--dur-base) var(--ease-out-expo);
      position: relative;
      cursor: pointer;
    }

    .nav-item:hover {
      background: var(--glass-2);
      color: var(--ink-2);
    }

    .nav-item.active {
      background: rgba(79,143,255,0.1);
      color: #7eb3ff;
      border: 1px solid rgba(79,143,255,0.15);
    }

    .nav-icon-wrap {
      width: 30px; height: 30px;
      border-radius: var(--r-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: var(--glass-2);
      transition: all var(--dur-base) var(--ease-out-expo);
    }

    .nav-item:hover .nav-icon-wrap {
      background: var(--glass-3);
    }

    .nav-item.active .nav-icon-wrap {
      background: rgba(79,143,255,0.15);
      box-shadow: 0 0 12px rgba(79,143,255,0.2);
    }

    .nav-svg {
      width: 16px; height: 16px;
      color: currentColor;
    }

    .nav-label { flex: 1; }

    /* Active pip */
    .nav-pip {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: var(--a-azure);
      opacity: 0;
      transition: opacity var(--dur-base);
      box-shadow: 0 0 6px var(--a-azure);
    }

    .nav-item.active .nav-pip { opacity: 1; }

    /* Submenu items */
    .nav-sub-item {
      margin-left: 20px;
      font-size: 0.8rem;
    }

    .nav-sub-item .nav-icon-wrap {
      width: 24px;
      height: 24px;
    }

    .nav-sub-item .nav-svg {
      width: 14px;
      height: 14px;
    }

    /* Spacer */
    .flex-spacer { flex: 1; }

    /* Footer */
    .sidebar-footer {
      padding: 16px 20px;
      border-top: 1px solid var(--glass-2);
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .footer-status {
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .status-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--a-jade);
      box-shadow: 0 0 8px var(--a-jade);
      animation: pulse 2.5s ease-in-out infinite;
    }

    .status-text {
      font-size: 0.75rem;
      color: var(--ink-3);
      font-weight: 500;
    }

    .footer-stack {
      font-size: 0.65rem;
      color: var(--ink-5);
      font-weight: 500;
      letter-spacing: 0.04em;
    }
  `]
})
export class SidebarComponent {}
