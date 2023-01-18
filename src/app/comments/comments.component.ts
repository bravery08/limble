import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, map, Observable, pairwise, startWith, withLatestFrom } from 'rxjs';
import { User } from '../models/user';
import { CommentsService } from '../services/comments.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  constructor(private commentsService: CommentsService) { 
  }

  comments: string[] = [];
  control: FormControl = new FormControl('', [Validators.required]);
  users$: Observable<User[]> = this.commentsService.getUsers();
  filteredUsers$!: Observable<User[]>;
  getComment$: BehaviorSubject<(name: string) => string> = new BehaviorSubject(
    (name: string) => name
  );
 
  postComment() {
    this.comments.push(this.control.value);
    this.control.reset();
  }

  ngOnInit() {
    this.filteredUsers$ = this.control.valueChanges.pipe(
      startWith(''),
      pairwise(),
      withLatestFrom(this.users$),
      map(([[previousComment, comment], users]: [[string, string], User[]]) => {
        const previousWords = previousComment?.split(' ') || [];
        const words = comment?.split(' ') || [];
        // Find the word that differs between the previous comment and the current comment
        const word = words.find((word: string, index: number) => {
          return word !== previousWords[index];
        });

        this.getComment$.next((name: string) => {
          return words.reduce((updatedComment: string, word: string, index: number) => {
            if (word !== previousWords[index] && word.startsWith('@')) {
              return updatedComment.replace(word, name);
            }
            return updatedComment;
          }, comment);
        });

        if (word && word.startsWith('@')) {
          return this._filter(word.replace('@', ''), users);
        }
        return [];
      })
    );
  }

  private _filter(value: string, users: User[]): User[] {
    const filterValue = value.toLowerCase();
    return users.filter((user) =>
      user.name.toLowerCase().includes(filterValue)
    );
  }
}