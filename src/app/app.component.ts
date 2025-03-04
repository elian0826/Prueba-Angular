import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  sidebarOpen: boolean = false;
  isMobile: boolean = window.innerWidth <= 768;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.detectScreenSize();

    // 📌 Cerrar el menú cuando se navegue en móviles
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.isMobile) {
        this.closeSidebar();
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  detectScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.sidebarOpen = true; // Mantener abierto en escritorio
    } else {
      this.sidebarOpen = false; // Cerrar en móviles
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
  }

}
