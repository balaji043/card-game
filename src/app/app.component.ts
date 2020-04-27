import { Component } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  public MatchStatus = MatchStatus;
  public MatchStage = MatchStage;
  public NextMatch = NextMatch;

  buttonText = { TARGET_AND_NO_OF_PLAYERS: 'Next', PLAYER_NAMES: 'Start Match', SCORES: 'Add score' };

  matchStage: string;
  resultMessage: string;
  round: number;

  matchForm = this.fb.group({
    target: [null, [Validators.required, Validators.min(1), Validators.max(1000)]],
    numberOfPlayers: [null, [Validators.required, Validators.min(2), Validators.max(10)]],
    players: this.fb.array([])
  });

  constructor(private fb: FormBuilder) {
    this.matchStage = MatchStage.TARGET_AND_NO_OF_PLAYERS;
    this.round = 1;
  }

  public onClickMatchButton(): void {
    switch (this.matchStage) {
      case MatchStage.TARGET_AND_NO_OF_PLAYERS: {
        this.whenStageIsTARGET_AND_NO_OF_PLAYERS();
        break;
      }
      case MatchStage.PLAYER_NAMES: {
        this.whenStageIsPLAYER_NAMES();
        break;
      }
      case MatchStage.SCORES: {
        this.whenStageIsSCORES();
        break;
      }
      default:
        break;
    }
  }

  private whenStageIsTARGET_AND_NO_OF_PLAYERS(): void {
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
      this.matchStage = MatchStage.PLAYER_NAMES;
    }
  }

  private whenStageIsPLAYER_NAMES() {
    this.matchForm.markAllAsTouched();
    if (this.matchForm.valid) {
      this.matchStage = MatchStage.SCORES;
      this.players.controls.forEach(e => {
        e.get('currentRoundScore').setValidators(Validators.required);
      });
    }
  }

  private whenStageIsSCORES(): void {
    if (!this.matchForm.valid) {
      this.matchForm.markAllAsTouched();
      return;
    }
    this.round++;
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
      this.resultMessage = 'Player ' + player.get('name').value + ' has won the match';
      this.matchStage = MatchStage.OVER;
    }
    if (playerLostCount === this.numberOfPlayers.value) {
      this.resultMessage = ' Match is tied';
      this.matchStage = MatchStage.OVER;
    }
  }

  public onNewMatch(nextMatch: string): void {
    this.round = 0;
    if (nextMatch === NextMatch.NEW_MATCH) {
      this.matchForm.reset();
      this.players.clear();
      this.matchStage = MatchStage.TARGET_AND_NO_OF_PLAYERS;
    }
    if (nextMatch === NextMatch.OLD_MATCH) {
      this.matchStage = MatchStage.SCORES;
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
export class MatchStatus {
  public static IN_PROGRESS = 'In-Progress';
  public static OVER = 'Over';
}

export class NextMatch {
  public static NEW_MATCH = 'New Match';
  public static OLD_MATCH = 'Old Match';
}

export class MatchStage {
  public static TARGET_AND_NO_OF_PLAYERS = 'TARGET_AND_NO_OF_PLAYERS';
  public static PLAYER_NAMES = 'PLAYER_NAMES';
  public static SCORES = 'SCORES';
  public static OVER = 'OVER';
}

