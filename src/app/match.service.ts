import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Match } from './match.model';

const STORAGE_KEY = 'MATCH';

@Injectable({
  providedIn: 'root'
})
export class MatchService {


  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {
  }

  public resetMatch(): void {
    this.storage.clear();
  }

  private setMatch(match: Match): void {
    this.storage.set(STORAGE_KEY, match);
  }
}
