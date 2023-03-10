import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CommentsService {
    constructor(private httpClient: HttpClient) { }
    
    getUsers() : Observable<User[]> {
        return this.httpClient.get<User[]>('./assets/users.json')
    }
}