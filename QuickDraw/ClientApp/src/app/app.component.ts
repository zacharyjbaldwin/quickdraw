import { Component, OnInit } from '@angular/core';
import { GameService } from './services/game.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DisplayNameModalComponent } from './shared/display-name-modal/display-name-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  
  title = 'app';

  public userList: string[] = [];

  constructor(
    private _gameService: GameService,
    private _modalService: BsModalService
  ) { }

  ngOnInit(): void {
    // this._gameService.start("Zachary " + new Date().getSeconds());
    
    this.openDisplayNameModal();
    
    this.initializeListeners();
  }

  private openDisplayNameModal(): void {
    const modal = this._modalService.show(DisplayNameModalComponent, {
      initialState: {},
      backdrop: 'static',
      keyboard: false,
      class: 'modal-sm modal-dialog-centered'
    });

    modal.content.pickedDisplayName.subscribe({
      next: (displayName) => {
        this._gameService.start(displayName);
        modal.hide();
      }
    })
  }

  private initializeListeners(): void {
    this._gameService.userList$.subscribe({
      next: (userList) => {
        this.userList = userList;
        console.log(this.userList);
      }
    })
  }
}
