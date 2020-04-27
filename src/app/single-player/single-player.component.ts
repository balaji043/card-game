import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-single-player',
  templateUrl: './single-player.component.html',
  styleUrls: ['./single-player.component.css']
})
export class SinglePlayerComponent implements OnInit {

  @Output() scoreAdded = new EventEmitter();
  @Input() singlePlayerForm: FormGroup;
  @Input() slNo: number;
  @Input() stage: number;
  @Input() target: FormControl;


  constructor() { }

  ngOnInit() {
  }

  public onClickOfAddScore(): void {
    const score = this.currentScore.value;
    if (score !== null && score !== undefined) {
      this.totalScore.setValue(score + this.totalScore.value);
      this.currentScore.setValue(0);
    }
    if (this.totalScore.value >= this.target.value) {
      this.playerLost.setValue(true);
    }
    this.scoreAdded.emit();
  }

  get currentScore() { return this.singlePlayerForm.get('currentRoundScore'); }
  get totalScore() { return this.singlePlayerForm.get('totalScore'); }
  get playerLost() { return this.singlePlayerForm.get('playerLost'); }
}
