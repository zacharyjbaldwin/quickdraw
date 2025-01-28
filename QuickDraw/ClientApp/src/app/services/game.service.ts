import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private connection: signalR.HubConnection;
  public userList$ = new BehaviorSubject<UserScore[]>([]);

  constructor() { }

  public start(displayName: string): void {
    if (this.connection?.state != signalR.HubConnectionState.Connected) {

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7256/gamehub")
        .build();

      this.connection.start()
        .then(() => {
          console.log("Connected to the GameHub!");
          this.initializeListeners();
          this.joinGame(displayName);
        })
        .catch((error) => {
          console.log("Failed to connect to the GameHub.")
          console.log(error);
        })
    }
  }

  private initializeListeners(): void {
    this.connection.on("UpdateScore", (userList: UserScore[]) => { this.userList$.next(userList) });
  }

  private joinGame(displayName: string): void {
    this.connection.invoke("JoinGame", displayName);
  }

  public incrementScore(): void {
    this.connection.invoke("IncrementScore");
  }
}

export interface UserScore {
  displayName: string;
  score: number;
}