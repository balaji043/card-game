import { Component } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  public MatchStatus = MatchStatus;
  public MatchStage = MatchStage;
  public NextMatch = NextMatch;

  buttonText = { TARGET_AND_NO_OF_PLAYERS: 'Next', PLAYER_NAMES: 'Start Match', SCORES: 'Add score' };


  matchForm = this.fb.group({
    target: [null, [Validators.required, Validators.min(1), Validators.max(1000)]],
    numberOfPlayers: [null, [Validators.required, Validators.min(2), Validators.max(10)]],
    players: this.fb.array([]),
    matchStage: [],
    resultMessage: [],
    round: [1],
    isDrawn: [false]
  });

  constructor(private fb: FormBuilder) {
    this.matchStage.setValue(MatchStage.TARGET_AND_NO_OF_PLAYERS);
    this.round.setValue(1);
  }

  public onClickOfMatchButton(): void {
    this.matchForm.markAllAsTouched();
    if (!this.matchForm.valid) {
      return;
    }
    switch (this.matchStage.value) {
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
    this.players.clear();
    for (let index = 0; index < this.numberOfPlayers.value; index++) {
      this.players.push(this.fb.group({
        name: [null, Validators.required],
        totalScore: [0],
        currentRoundScore: [0],
        playerLost: [false]
      }));
    }
    this.matchStage.setValue(MatchStage.PLAYER_NAMES);
  }

  private whenStageIsPLAYER_NAMES() {
    this.matchStage.setValue(MatchStage.SCORES);
    this.players.controls.forEach(e => {
      e.get('currentRoundScore').setValidators(Validators.required);
    });
  }

  private whenStageIsSCORES(): void {
    this.round.setValue(this.round.value + 1);
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
      this.resultMessage.setValue('Player ' + player.get('name').value + ' has won the match');
      this.matchStage.setValue(MatchStage.OVER);
      this.isDrawn.setValue(false);
    }
    if (playerLostCount === this.numberOfPlayers.value) {
      this.resultMessage.setValue(' Match is tied');
      this.matchStage.setValue(MatchStage.OVER);
      this.isDrawn.setValue(true);
    }
  }

  public onClickOfNextMatchButton(nextMatch: string): void {
    this.round.setValue(1);
    if (nextMatch === NextMatch.NEW_MATCH) {
      this.matchForm.reset();
      this.players.clear();
      this.matchStage.setValue(MatchStage.TARGET_AND_NO_OF_PLAYERS);
    }
    if (nextMatch === NextMatch.OLD_MATCH) {
      this.matchStage.setValue(MatchStage.SCORES);
      this.players.controls.forEach(e => {
        e.get('totalScore').setValue(0);
        e.get('playerLost').setValue(false);
      });
    }
  }

  get target() { return this.getFC('target'); }
  get numberOfPlayers() { return this.getFC('numberOfPlayers'); }
  get matchStage() { return this.getFC('matchStage'); }
  get round() { return this.getFC('round'); }
  get resultMessage() { return this.getFC('resultMessage'); }
  get isDrawn() { return this.getFC('isDrawn'); }

  get players() { return this.getFC('players') as FormArray; }

  public getFC(name: string) {
    return this.matchForm.get(name);
  }

  public getFG(name: string, index: number) {
    return this.players.controls[index].get(name);
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

