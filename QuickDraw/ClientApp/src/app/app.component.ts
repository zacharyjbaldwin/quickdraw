import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GameService, UserScore } from './services/game.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DisplayNameModalComponent } from './shared/display-name-modal/display-name-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  public userList: UserScore[] = [];
  public hasPickedDisplayName: boolean = false;
  @ViewChild("target", { static: false }) target: ElementRef;

  constructor(
    private _gameService: GameService,
    private _modalService: BsModalService
  ) { }

  public userList$ = this._gameService.userList$;

  ngOnInit(): void {       
    const modal = this._modalService.show(DisplayNameModalComponent, {
      initialState: {},
      backdrop: 'static',
      keyboard: false,
      class: 'modal-sm modal-dialog-centered'
    });

    modal.content.pickedDisplayName.subscribe({
      next: (displayName: string) => {
        this._gameService.start(displayName);
        this.hasPickedDisplayName = true;
        modal.hide();

        setTimeout(() => {
          this.resetTarget();
        }, 0)
      }
    });

    this.userList$.subscribe({
      next: () => { this.resetTarget(); }
    })
  }

  public incrementScore(): void {
    this._gameService.incrementScore();
    this.resetTarget();
  }

  public resetTarget(): void {
    if (this.target) {
      const top = Math.floor(Math.random() * 100) + 1;
      this.target.nativeElement.style.top = `calc(${top}% + ${top > 50 ? '-100' : '100'}px)`;
      const left = Math.floor(Math.random() * 100) + 1;
      this.target.nativeElement.style.left = `calc(${left}% + ${top > 50 ? '-100' : '100'}px)`;
    }
  }
}
