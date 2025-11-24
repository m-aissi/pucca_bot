import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User { username?: string; email?: string; [key: string]: any }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  setUser(user: User | null) { this.userSubject.next(user); }
  get currentUser(): User | null { return this.userSubject.value; }
}