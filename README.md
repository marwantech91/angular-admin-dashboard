# Angular Admin Dashboard

![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=flat-square&logo=angular)
![Material](https://img.shields.io/badge/Material-17-673AB7?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

Production-ready Angular admin dashboard with Material UI, charts, role-based access control, and responsive design.

## Features

- **Angular 17** - Latest with standalone components & signals
- **Material Design** - Full Material UI component library
- **Charts & Analytics** - ngx-charts integration
- **RBAC** - Role-based access control
- **Dark Mode** - Theme switching
- **Responsive** - Mobile-first design
- **i18n** - Multi-language support
- **Lazy Loading** - Optimized performance

## Quick Start

```bash
# Install dependencies
npm install

# Development server
ng serve

# Build for production
ng build --configuration=production
```

## Project Structure

```
src/
├── app/
│   ├── core/                 # Singleton services, guards
│   │   ├── auth/
│   │   ├── guards/
│   │   └── interceptors/
│   ├── shared/               # Shared modules, components
│   │   ├── components/
│   │   ├── directives/
│   │   └── pipes/
│   ├── features/             # Feature modules
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── products/
│   │   └── settings/
│   └── layouts/              # Layout components
│       ├── admin-layout/
│       └── auth-layout/
├── assets/
└── environments/
```

## Authentication

```typescript
// Login
await authService.login({ email, password });

// Check role
if (authService.hasRole('admin')) {
  // Admin-only actions
}

// Route guard
{
  path: 'users',
  component: UsersComponent,
  canActivate: [AuthGuard],
  data: { roles: ['admin', 'manager'] }
}
```

## Role-Based Access Control

```typescript
// Define roles
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const;

// Permission directive
<button *hasRole="['admin', 'manager']">
  Delete User
</button>

// Service check
if (permissionService.can('users:delete')) {
  // Allow action
}
```

## Theme Configuration

```typescript
// Toggle dark mode
themeService.toggleDarkMode();

// Set primary color
themeService.setPrimaryColor('#1976d2');

// Custom theme
themeService.setTheme({
  primary: '#673ab7',
  accent: '#ff4081',
  warn: '#f44336',
  darkMode: true,
});
```

## Charts

```typescript
// Dashboard chart data
chartData = [
  { name: 'Sales', series: [
    { name: 'Jan', value: 4500 },
    { name: 'Feb', value: 5200 },
    { name: 'Mar', value: 4800 },
  ]},
];

// Chart options
chartOptions = {
  showXAxis: true,
  showYAxis: true,
  gradient: true,
  showLegend: true,
  colorScheme: 'cool',
};
```

## Data Tables

```typescript
// Table with pagination, sorting, filtering
<mat-table [dataSource]="dataSource" matSort>
  <ng-container matColumnDef="name">
    <mat-header-cell *matHeaderCellDef mat-sort-header>Name</mat-header-cell>
    <mat-cell *matCellDef="let row">{{ row.name }}</mat-cell>
  </ng-container>

  <mat-header-row *matHeaderRowDef="columns"></mat-header-row>
  <mat-row *matRowDef="let row; columns: columns"></mat-row>
</mat-table>

<mat-paginator [pageSizeOptions]="[10, 25, 50]"></mat-paginator>
```

## API Integration

```typescript
// Generic CRUD service
@Injectable()
export class ApiService<T> {
  constructor(private http: HttpClient) {}

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.endpoint);
  }

  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.endpoint}/${id}`);
  }

  create(data: Partial<T>): Observable<T> {
    return this.http.post<T>(this.endpoint, data);
  }

  update(id: string, data: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.endpoint}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
```

## Environment Config

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  auth: {
    clientId: 'your-client-id',
    domain: 'your-domain.auth0.com',
  },
  features: {
    darkMode: true,
    analytics: false,
  },
};
```

## License

MIT
