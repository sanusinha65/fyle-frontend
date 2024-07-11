import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  toggleNavbar() {
    let collapse = document.querySelector("#navbar-collapse");
    if (collapse) {
      collapse.classList.toggle("hidden");
      collapse.classList.toggle("flex");
    }
  }
}
