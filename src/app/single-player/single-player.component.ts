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

  get currentScore() { return this.singlePlayerForm.get('currentRoundScore'); }
  get totalScore() { return this.singlePlayerForm.get('totalScore'); }
  get playerLost() { return this.singlePlayerForm.get('playerLost'); }
}
