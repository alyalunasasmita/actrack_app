import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { home, homeOutline, leaf, leafOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: false,
})
export class TabsPage {

  selectedTab: string = 'home';

  constructor() {
    addIcons({ home, homeOutline, leaf, leafOutline });
  }

  onTabChange(event: any) {
    this.selectedTab = event.tab;
  }
}