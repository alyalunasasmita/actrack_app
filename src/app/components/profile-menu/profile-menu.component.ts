import { Component, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';



@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  standalone: false
})
export class ProfileMenuComponent  implements OnInit {

  constructor(
    private popover: PopoverController
  ) { }

  ngOnInit() {}

  selectMenu(action :string){
    this.popover.dismiss(action);
  }
}
