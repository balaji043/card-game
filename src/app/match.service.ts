import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

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


}
