import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AccessTokenService {

  token: string = '';

  constructor() { }
}