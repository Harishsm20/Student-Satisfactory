import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { INavData } from '@coreui/angular';
import { navItems } from './_nav';
import { JwtService } from '../../service/jwt.service'; 

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent
  ],
  providers: [    { provide: JWT_OPTIONS, useValue: {} },
    JwtHelperService, JwtService]
})
export class DefaultLayoutComponent implements OnInit {
  public navItems: (INavData & { roles?: string[] })[] = [];

  constructor(private jwtService: JwtService) {}

  ngOnInit(): void {
    const userRole = this.jwtService.getRole();
    this.navItems = this.filterNavItems(navItems, userRole);
  }

  private filterNavItems(navItems: (INavData & { roles?: string[] })[], role: string): (INavData & { roles?: string[] })[] {
    return navItems.filter(item => {
      if (item.roles) {
        return item.roles.includes(role);
      }
      return true;
    });
  }

}
