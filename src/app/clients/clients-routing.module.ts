import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';


const routes: Routes = [
  { path: '', component: ListComponent },  // 🔹 Cargar ListComponent cuando entremos a /clients
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }



