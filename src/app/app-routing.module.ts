import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './clients/list/list.component';
import { FormComponent } from './clients/form/form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  { path: 'clientes', component: ListComponent },
  { path: 'clientes/add', component: FormComponent },
  { path: 'clientes/edit/:id', component: FormComponent },
  {
    path: 'dashboard',
    loadComponent: async () => {
      const module = await import('./dashboard/dashboard.component');
      return module.DashboardComponent; // ✅ Lazy Loading Correcto
    }
  },
  { path: '**', redirectTo: 'clientes' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}




