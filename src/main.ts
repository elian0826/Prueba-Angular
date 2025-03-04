import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()  // ✅ HttpClient configurado correctamente
  ]
}).then(() => {
  console.log('✅ Aplicación Angular inicializada correctamente');
}).catch(err => console.error(err));




