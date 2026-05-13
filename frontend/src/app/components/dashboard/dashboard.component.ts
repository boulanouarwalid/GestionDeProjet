import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ViewChild, NgZone, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataCacheService } from '../../services/data-cache.service';
import { Projet, Tache, Depense } from '../../models/models';
import { Subscription, combineLatest } from 'rxjs';

/* ── Particle system ─────────────────────────────────────────── */
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="dash-root">

  <!-- ── Canvas particle field ── -->
  <canvas #particleCanvas class="particle-canvas"></canvas>

  <!-- ── Top bar ── -->
  <header class="dash-header animate-in">
    <div class="header-left">
      <div class="header-eyebrow">
        <span class="eyebrow-line"></span>
        <span class="eyebrow-text">Vue d'ensemble</span>
      </div>
      <h1 class="dash-title">
        <span class="title-word">Tableau</span>
        <span class="title-word accent">de Bord</span>
      </h1>
    </div>
    <div class="header-right">
      <div class="live-badge">
        <span class="live-dot"></span>
        <span>Live</span>
      </div>
      <button class="btn btn-primary" (click)="loadData()">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 7h12M7 1v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Actualiser
      </button>
    </div>
  </header>

  <!-- ── Main grid ── -->
  <div class="main-grid animate-in" style="animation-delay:0.1s">
    <!-- ── Left column ── -->
    <div class="col-left">

      <!-- KPI cards -->
      <div class="kpi-strip">
        <div class="kpi-card animate-in" style="animation-delay:0.15s">
          <div class="kpi-icon" style="background:rgba(79,143,255,0.12); color:var(--a-azure)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="7" height="7" rx="2" fill="currentColor" opacity="0.9"/>
              <rect x="11" y="2" width="7" height="7" rx="2" fill="currentColor" opacity="0.5"/>
              <rect x="2" y="11" width="7" height="7" rx="2" fill="currentColor" opacity="0.5"/>
              <rect x="11" y="11" width="7" height="7" rx="2" fill="currentColor" opacity="0.7"/>
            </svg>
          </div>
          <div class="kpi-value">{{ displayProjets }}</div>
          <div class="kpi-label">Projets</div>
        </div>

        <div class="kpi-card animate-in" style="animation-delay:0.2s">
          <div class="kpi-icon" style="background:rgba(34,197,94,0.12); color:var(--a-jade)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.6"/>
              <path d="M7 10L9 12L13 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="kpi-value">{{ displayTaches }}</div>
          <div class="kpi-label">Taches</div>
        </div>

        <div class="kpi-card animate-in" style="animation-delay:0.25s">
          <div class="kpi-icon" style="background:rgba(251,146,60,0.12); color:var(--a-orange)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="5" width="16" height="12" rx="2.5" fill="currentColor" opacity="0.8"/>
              <path d="M2 8H18" stroke="rgba(255,255,255,0.3)" stroke-width="1.2"/>
              <rect x="5" y="11" width="4" height="2" rx="1" fill="rgba(255,255,255,0.5)"/>
              <circle cx="14" cy="12" r="1.5" fill="rgba(255,255,255,0.6)"/>
            </svg>
          </div>
          <div class="kpi-value">{{ displayBudget | number:'1.0-0' }}</div>
          <div class="kpi-label">Budget</div>
        </div>
      </div>

      <!-- Donut chart -->
      <div class="donut-wrap glass-panel animate-in" style="animation-delay:0.3s">
        <div class="panel-header">
          <div>
            <div class="panel-eyebrow">Repartition</div>
            <h3 class="panel-title">Taches par Type</h3>
          </div>
        </div>
        <div class="donut-chart">
          <svg class="donut-svg" viewBox="0 0 240 240">
            @for (seg of donutSegments; track seg.label) {
              <path [attr.d]="seg.dash" [attr.fill]="seg.color" [attr.stroke-dasharray]="seg.dasharray" [attr.stroke-dashoffset]="seg.offset" stroke-width="40" fill="none" stroke-linecap="round" (mouseenter)="hoveredSegment = seg.label" (mouseleave)="hoveredSegment = null" style="transition: all 0.3s ease"/>
            }
            <circle cx="120" cy="120" r="60" fill="var(--void)"/>
          </svg>
          <div class="donut-center-text">
            <div class="donut-total">{{ taches.length }}</div>
            <div class="donut-label">Total Taches</div>
          </div>
        </div>
        <div class="donut-legend">
          @for (seg of donutSegments; track seg.label) {
            <div class="legend-item" (mouseenter)="hoveredSegment = seg.label" (mouseleave)="hoveredSegment = null">
              <div class="legend-color" [style.background]="seg.color"></div>
              <span class="legend-text">{{ seg.label }}</span>
              <span class="legend-value">{{ seg.count }}</span>
            </div>
          }
        </div>
      </div>

    </div>

    <!-- ── Right column ── -->
    <div class="col-right">

      <!-- Bar chart -->
      <div class="bar-wrap glass-panel animate-in" style="animation-delay:0.35s">
        <div class="panel-header">
          <div>
            <div class="panel-eyebrow">Analyse</div>
            <h3 class="panel-title">Taches par Type</h3>
          </div>
        </div>
        <div class="bar-chart">
          <svg class="bar-chart-svg" viewBox="0 0 260 240">
            @for (bar of taskTypeStats; track bar.type; let i = $index) {
              <g class="bar-group" (mouseenter)="hoveredBar = i" (mouseleave)="hoveredBar = -1">
                <defs>
                  <linearGradient [id]="'bar-grad-' + i" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" [attr.stop-color]="bar.topColor"/>
                    <stop offset="100%" [attr.stop-color]="bar.sideColor"/>
                  </linearGradient>
                </defs>
                <rect [attr.x]="bar.x" [attr.y]="bar.y" [attr.width]="30" [attr.height]="bar.percent" [attr.fill]="'url(#bar-grad-' + i + ')'" rx="4" style="transition: all 0.3s ease"/>
                <text [attr.x]="bar.x + 15" [attr.y]="235" text-anchor="middle" class="bar-label">{{ bar.type }}</text>
              </g>
            }
          </svg>
        </div>
      </div>

      <!-- Gauge -->
      <div class="gauge-wrap glass-panel animate-in" style="animation-delay:0.4s">
        <div class="panel-header">
          <div>
            <div class="panel-eyebrow">Performance</div>
            <h3 class="panel-title">Taux Consommation</h3>
          </div>
        </div>
        <div class="gauge-chart">
          <svg class="gauge-svg" viewBox="0 0 240 240">
            <path d="M 20 120 A 100 100 0 0 1 220 120" stroke="var(--glass-2)" stroke-width="20" fill="none" stroke-linecap="round"/>
            <path [attr.d]="gaugeArcPath" stroke="url(#gauge-grad)" stroke-width="20" fill="none" stroke-linecap="round" style="transition: all 0.6s ease"/>
            <defs>
              <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#22c55e"/>
                <stop offset="50%" stop-color="#f59e0b"/>
                <stop offset="100%" stop-color="#ef4444"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="gauge-center-text">{{ consumptionRate | number:'1.0-0' }}%</div>
          <div class="gauge-label">Budget Utilisé</div>
        </div>
      </div>

      <!-- Activity feed -->
      <div class="activity-wrap glass-panel animate-in" style="animation-delay:0.45s">
        <div class="panel-header">
          <div>
            <div class="panel-eyebrow">Activité</div>
            <h3 class="panel-title">Recente</h3>
          </div>
        </div>
        <div class="activity-list">
          @for (item of activityFeed; track item.id) {
            <div class="activity-item">
              <div class="activity-icon" [style.background]="item.bg">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path [attr.d]="item.iconPath" [attr.stroke]="item.color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div class="activity-dot" [style.background]="item.color"></div>
              </div>
              <div class="activity-body">
                <div class="activity-text">{{ item.text }}</div>
                <div class="activity-time">{{ item.time }}</div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Sparkline -->
      <div class="sparkline-wrap glass-panel animate-in" style="animation-delay:0.5s">
        <div class="panel-header">
          <div>
            <div class="panel-eyebrow">Tendance</div>
            <h3 class="panel-title">Dépenses (7j)</h3>
          </div>
        </div>
        <div class="sparkline-chart">
          <svg class="sparkline-svg" viewBox="0 0 260 80">
            <defs>
              <linearGradient id="spark-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#4f8fff" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="#4f8fff" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <path [attr.d]="sparkAreaPath" fill="url(#spark-grad)"/>
            <path [attr.d]="sparkLinePath" fill="none" stroke="#4f8fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            @for (pt of sparkPoints; track pt.x) {
              <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="3" fill="#4f8fff" opacity="0.8"/>
            }
          </svg>
          <div class="sparkline-labels">
            @for (lbl of sparkLabels; track lbl) {
              <span>{{ lbl }}</span>
            }
          </div>
        </div>
      </div>

      <!-- Quick stats pills -->
      <div class="pills-panel glass-panel animate-in" style="animation-delay:0.55s">
        <div class="panel-header">
          <div>
            <div class="panel-eyebrow">Indicateurs</div>
            <h3 class="panel-title">Clés</h3>
          </div>
        </div>
        <div class="pills-grid">
          <div class="pill-item">
            <div class="pill-label">Taux Completion</div>
            <div class="pill-value jade">{{ completionRate | number:'1.0-0' }}%</div>
            <div class="progress-bar-track" style="margin-top:6px">
              <div class="progress-bar-fill success" [style.width.%]="completionRate"></div>
            </div>
          </div>
          <div class="pill-item">
            <div class="pill-label">Taches En Cours</div>
            <div class="pill-value azure">{{ inProgressCount }}</div>
          </div>
          <div class="pill-item">
            <div class="pill-label">Taches En Attente</div>
            <div class="pill-value amber">{{ pendingCount }}</div>
          </div>
          <div class="pill-item">
            <div class="pill-label">Depense Moy / Tache</div>
            <div class="pill-value violet">{{ avgDepensePerTache | number:'1.0-0' }}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>
  `,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  /* -- Data -- */
  projets: Projet[] = [];
  taches: Tache[] = [];
  depenses: Depense[] = [];

  /* -- KPI display values (animated counters) -- */
  totalProjets = 0;  displayProjets = 0;
  totalTaches  = 0;  displayTaches  = 0;
  totalBudget  = 0;  displayBudget  = 0;
  totalDepenses = 0;  displayDepenses = 0;

  consumptionRate = 0;
  completionRate  = 0;
  inProgressCount = 0;
  pendingCount    = 0;
  avgDepensePerTache = 0;

  /* -- Charts -- */
  donutSegments: { label:string; count:number; pct:number; color:string; dash:string; dasharray:string; offset:string }[] = [];
  hoveredSegment: string | null = null;

  taskTypeStats: { type:string; count:number; percent:number; gradient:string; colorRaw:string; topColor:string; sideColor:string; x:number; y:number }[] = [];
  hoveredBar = -1;

  gaugeArcPath = '';

  /* -- Activity feed -- */
  activityFeed: { id:number; text:string; time:string; color:string; bg:string; iconPath:string }[] = [];

  /* -- Sparkline -- */
  sparkLinePath  = '';
  sparkAreaPath  = 'M 0,40 L 260,40 L 260,40 L 0,40 Z'; // Initialize with default path
  sparkPoints: { x:number; y:number }[] = [];
  sparkLabels = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

  /* -- Particles -- */
  particles: Particle[] = [];
  private animationId: number | null = null;

  /* -- Subscriptions -- */
  private subs: Subscription[] = [];

  constructor(private cache: DataCacheService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit() {
    this.subs.push(combineLatest([
      this.cache.projets$,
      this.cache.taches$,
      this.cache.depenses$
    ]).subscribe(([p, t, d]) => {
      this.projets = p;
      this.taches = t;
      this.depenses = d;
      this.updateKPIs();
      this.buildCharts();
      this.buildActivityFeed();
      this.buildSparkline();
    }));
    this.cache.init();
  }

  ngAfterViewInit() {
    this.initParticles();
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  loadData() {
    this.cache.refreshAll();
  }

  /* -- KPI animations -- */
  private updateKPIs() {
    const targets = {
      totalProjets: this.projets.length,
      totalTaches: this.taches.length,
      totalBudget: this.projets.reduce((s, p) => s + (p.budgets?.reduce((b, bud) => b + bud.montantPrevu, 0) || 0), 0),
      totalDepenses: this.depenses.reduce((s, d) => s + d.montant, 0)
    };

    this.animateCounters(targets);
    this.calculateMetrics();
  }

  private animateCounters(targets: any) {
    const duration = 1200;
    const steps = 30;
    const stepTime = duration / steps;
    let currentStep = 0;

    const animate = () => {
      currentStep++;
      const progress = this.easeOutCubic(currentStep / steps);

      this.displayProjets = Math.round(targets.totalProjets * progress);
      this.displayTaches = Math.round(targets.totalTaches * progress);
      this.displayBudget = Math.round(targets.totalBudget * progress);
      this.displayDepenses = Math.round(targets.totalDepenses * progress);

      if (currentStep < steps) {
        setTimeout(animate, stepTime);
      }
    };

    animate();
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  private calculateMetrics() {
    const totalBudget = this.projets.reduce((s, p) => s + (p.budgets?.reduce((b, bud) => b + bud.montantPrevu, 0) || 0), 0);
    const totalSpent = this.depenses.reduce((s, d) => s + d.montant, 0);
    
    this.consumptionRate = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    const completedTasks = this.taches.filter(t => t.status === 'TERMINÉE').length;
    this.completionRate = this.taches.length > 0 ? (completedTasks / this.taches.length) * 100 : 0;
    
    this.inProgressCount = this.taches.filter(t => t.status === 'EN_COURS').length;
    this.pendingCount = this.taches.filter(t => t.status === 'EN_ATTENTE').length;
    
    this.avgDepensePerTache = this.taches.length > 0 ? totalSpent / this.taches.length : 0;
  }

  /* -- Charts -- */
  private buildCharts() {
    this.buildDonutChart();
    this.buildBarChart();
    this.buildGauge();
  }

  private buildDonutChart() {
    const typeCount = new Map<string, number>();
    this.taches.forEach(t => {
      const type = t.type || 'NON_DEFINI';
      typeCount.set(type, (typeCount.get(type) || 0) + 1);
    });

    const colors = ['#4f8fff', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    let idx = 0;
    let startAngle = -90;

    this.donutSegments = Array.from(typeCount.entries()).map(([type, count]) => {
      const total = this.taches.length;
      const pct = (count / total) * 100;
      const angle = (count / total) * 360;
      const endAngle = startAngle + angle;
      
      const radius = 80;
      const centerX = 120, centerY = 120;
      const x1 = centerX + radius * Math.cos(startAngle * Math.PI / 180);
      const y1 = centerY + radius * Math.sin(startAngle * Math.PI / 180);
      const x2 = centerX + radius * Math.cos(endAngle * Math.PI / 180);
      const y2 = centerY + radius * Math.sin(endAngle * Math.PI / 180);
      
      const large = angle > 180 ? 1 : 0;
      const dash = `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
      const dasharray = `${2 * Math.PI * radius}`;
      const offset = `${2 * Math.PI * radius * (startAngle + 90) / 360}`;
      
      startAngle = endAngle;
      return {
        label: type,
        count,
        pct,
        color: colors[idx++ % colors.length],
        dash,
        dasharray,
        offset
      };
    });
  }

  private buildBarChart() {
    const typeCount = new Map<string, number>();
    this.taches.forEach(t => {
      const type = t.type || 'NON_DEFINI';
      typeCount.set(type, (typeCount.get(type) || 0) + 1);
    });

    const max = Math.max(...typeCount.values());
    const barWidth = 30;
    const barSpacing = 15;
    const chartHeight = 200;
    const startX = 20;

    const configs = [
      { gradient: 'linear-gradient(135deg, #4f8fff, #3b82f6)', colorRaw: '#4f8fff', topColor: '#4f8fff', sideColor: '#3b82f6' },
      { gradient: 'linear-gradient(135deg, #22c55e, #16a34a)', colorRaw: '#22c55e', topColor: '#22c55e', sideColor: '#16a34a' },
      { gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', colorRaw: '#f59e0b', topColor: '#f59e0b', sideColor: '#d97706' },
      { gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', colorRaw: '#ef4444', topColor: '#ef4444', sideColor: '#dc2626' },
      { gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', colorRaw: '#8b5cf6', topColor: '#8b5cf6', sideColor: '#7c3aed' },
      { gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)', colorRaw: '#06b6d4', topColor: '#06b6d4', sideColor: '#0891b2' }
    ];
    
    let idx = 0;
    this.taskTypeStats = Array.from(typeCount.entries()).map(([type, count]) => {
      const cfg = configs[idx++ % configs.length];
      return { 
        type: this.formatType(type), 
        count, 
        percent: (count/max)*90, 
        x:0, 
        y:0, 
        ...cfg 
      };
    });
  }

  /* -- Gauge arc -- */
  private buildGauge() {
    const pct = Math.min(this.consumptionRate / 100, 1);
    const startAngle = Math.PI;
    const endAngle   = Math.PI + pct * Math.PI;
    const cx = 120, cy = 120, r = 100;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = pct > 0.5 ? 1 : 0;
    this.gaugeArcPath = pct > 0
      ? `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
      : '';
  }

  /* -- Activity feed -- */
  private buildActivityFeed() {
    const items = [];
    const now = new Date();
    if (this.projets.length > 0) {
      items.push({ id:1, text:`Projet "${this.projets[0].nomProjet}" actif`, time:'Il y a 2 min', color:'#4f8fff', bg:'rgba(79,143,255,0.12)', iconPath:'M2 5C2 3.9 2.9 3 4 3H7L9 5H10C11.1 5 12 5.9 12 7V9C12 10.1 11.1 11 10 11H4C2.9 11 2 10.1 2 9V5Z' });
    }
    if (this.taches.length > 0) {
      items.push({ id:2, text:`${this.taches.length} taches enregistrees`, time:'Il y a 5 min', color:'#10b981', bg:'rgba(16,185,129,0.12)', iconPath:'M3 6H9M3 9H7M2 3H10C10.6 3 11 3.4 11 4V10C11 10.6 10.6 11 10 11H2C1.4 11 1 10.6 1 10V4C1 3.4 1.4 3 2 3Z' });
    }
    if (this.depenses.length > 0) {
      items.push({ id:3, text:`${this.depenses.length} depenses enregistrees`, time:'Il y a 12 min', color:'#f59e0b', bg:'rgba(245,158,11,0.12)', iconPath:'M6 1V2M6 10V11M2.2 2.2L3 3M9 9L9.8 9.8M1 6H2M10 6H11M2.2 9.8L3 9M9 3L9.8 2.2M8.5 6C8.5 7.4 7.4 8.5 6 8.5C4.6 8.5 3.5 7.4 3.5 6C3.5 4.6 4.6 3.5 6 3.5C7.4 3.5 8.5 4.6 8.5 6Z' });
    }
    items.push({ id:4, text:'Dashboard actualise', time:'Il y a 1 sec', color:'#8b5cf6', bg:'rgba(139,92,246,0.12)', iconPath:'M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z' });
    this.activityFeed = items;
  }

  /* -- Sparkline -- */
  private buildSparkline() {
    const total = this.totalDepenses || 100;
    const raw = Array.from({length:7}, () => Math.random() * total * 0.3 + total * 0.05);
    const max = Math.max(...raw);
    const W = 260, H = 80, pad = 10;
    this.sparkPoints = raw.map((v,i) => ({
      x: pad + (i / (raw.length-1)) * (W - pad*2),
      y: H - pad - ((v/max) * (H - pad*2))
    }));
    this.sparkLinePath = this.sparkPoints.map((p,i) => `${i===0?'M':'L'}${p.x},${p.y}`).join(' ');
    this.sparkAreaPath = this.sparkLinePath + ` L${this.sparkPoints[this.sparkPoints.length-1].x},${H} L${this.sparkPoints[0].x},${H} Z`;
  }

  private formatType(type: string): string {
    const map: Record<string,string> = {
      'SOFTWARE_ENGINEERING':'Software', 'CYBERSECURITY':'Cyber',
      'DATA_SCIENCE':'Data Sci', 'DEVOPS':'DevOps',
      'GENIE_CIVIL':'Genie Civ', 'ELECTRICITE':'Electr.'
    };
    return map[type] || (type.length > 8 ? type.slice(0,7)+'.' : type);
  }

  /* -- Particles -- */
  private initParticles() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth - 280; // sidebar width
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Create initial particles
    for (let i = 0; i < 40; i++) {
      this.particles.push(this.createParticle(canvas.width, canvas.height));
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      this.particles = this.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.alpha = p.life / p.maxLife;

        if (p.life <= 0 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          return false;
        }

        ctx.globalAlpha = p.alpha * 0.6;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // Add new particles
      while (this.particles.length < 40) {
        this.particles.push(this.createParticle(canvas.width, canvas.height));
      }

      this.animationId = requestAnimationFrame(animate);
    };

    this.ngZone.runOutsideAngular(() => animate());
  }

  private createParticle(canvasWidth: number, canvasHeight: number): Particle {
    const colors = ['#4f8fff', '#22c55e', '#f59e0b', '#8b5cf6'];
    return {
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      alpha: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: Math.random() * 200 + 100,
      maxLife: 300
    };
  }
}
