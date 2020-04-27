import { Component } from '@angular/core';
import { MatchService } from './match.service';
import { Match } from './match.model';
import { FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  stage: number;
  buttonText = ['Next', 'Start Match', 'Add score', 'Start a new Match'];
  playerWon: string;
  matchOver = false;
  matchForm = this.fb.group(
    {
      target: [null, [Validators.required, Validators.min(1), Validators.max(1000)]],
      numberOfPlayers: [null, [Validators.required, Validators.min(2), Validators.max(10)]],
      players: this.fb.array([])
    }
  );


  title = 'card-game';

  constructor(private matchService: MatchService, private fb: FormBuilder) {
    this.stage = 1;
  }

  public onClickOfMatchStartButton(): void {
    console.log('onClickOfMatchStartButton');
    switch (this.stage) {
      case 1: {
        this.matchForm.markAllAsTouched();
        if (this.matchForm.valid) {
          this.players.clear();
          for (let index = 0; index < this.numberOfPlayers.value; index++) {
            this.players.push(this.fb.group({
              name: [null, Validators.required],
              totalScore: [0],
              currentRoundScore: [0],
              playerLost: [false]
            }));
          }
          this.stage = 2;
        }
        break;
      }
      case 2: {
        this.matchForm.markAllAsTouched();
        if (this.matchForm.valid) {
          this.stage = 3;
        }
        break;
      }
      case 3: {
        this.onScoreAdded();
        break;
      }
      case 4: {
        break;
      }
      default:
        break;
    }
  }

  public onScoreAdded(): void {
    let playerLostCount = 0;
    let player;
    this.players.controls.forEach(e => {
      const score = e.get('currentRoundScore').value;
      if (score !== null && score !== undefined) {
        e.get('totalScore').setValue(score + e.get('totalScore').value);
        e.get('currentRoundScore').setValue(0);
      }
      if (e.get('totalScore').value >= this.target.value) {
        e.get('playerLost').setValue(true);
      }
      if (e.get('playerLost').value) {
        playerLostCount++;
      } else {
        player = e;
      }
    });
    if (playerLostCount === this.numberOfPlayers.value - 1) {
      this.playerWon = 'Player ' + player.get('name').value + ' has won the match';
      this.matchOver = true;
      this.stage = 4;
    }
    if (playerLostCount === this.numberOfPlayers.value) {
      this.playerWon = ' Match is tied';
      this.matchOver = true;
      this.stage = 4;
    }
  }
  public onNewMatch(n: number): void {
    this.matchOver = false;
    if (n === 1) {
      this.matchForm.reset();
      this.players.clear();
      this.stage = 1;
    } else {
      this.stage = 3;
      this.players.controls.forEach(e => {
        e.get('totalScore').setValue(0);
        e.get('playerLost').setValue(false);
      });
    }
  }

  get target() { return this.matchForm.get('target'); }
  get numberOfPlayers() { return this.matchForm.get('numberOfPlayers'); }
  get players() {
    return this.matchForm.get('players') as FormArray;
  }
}

