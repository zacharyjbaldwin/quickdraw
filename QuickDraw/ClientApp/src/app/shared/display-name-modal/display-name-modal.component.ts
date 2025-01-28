import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  templateUrl: './display-name-modal.component.html',
  styleUrls: ['./display-name-modal.component.css']
})
export class DisplayNameModalComponent {

  public displayName = '';
  @Output() pickedDisplayName = new EventEmitter<string>();

  public submit(): void {
    this.pickedDisplayName.next(this.displayName);
  }

}
