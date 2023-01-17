import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, fromEvent, map, Observable, startWith, withLatestFrom } from 'rxjs';
import { User } from '../models/user';
import { CommentsService } from '../services/comments.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  // @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
  //   if (event.getModifierState('Shift') && event.keyCode === 50) {
  //     console.log('@ symbol pressed');
  //   }
  // }

  constructor(private commentsService: CommentsService, private elementRef: ElementRef) { 
    this.comments = [];
  }

  comments: string[] = [];
  control: FormControl = new FormControl('', [Validators.required]);
  options$: Observable<User[]> = this.commentsService.getUsers();
  filteredOptions$!: Observable<User[]>;
  isAtKeyActive: boolean = false;


  postComment() {
    this.comments.push(this.control.value);
    this.control.patchValue('');
    this.control.clearValidators();
  }

  ngOnInit() {
    this.filteredOptions$ = this.control.valueChanges.pipe(
      withLatestFrom(this.options$),
      map(([comment, users]) => this._filter(comment || '', users)),
    );
    fromEvent(this.elementRef.nativeElement, 'keydown')
    .subscribe((event: any) => {
      if (event.getModifierState('Shift') && event.keyCode === 50) {
            this.isAtKeyActive = true;
          } else if (event.keyCode === 49) {
              this.isAtKeyActive = false;
            }
    });

    // this.filteredOptions$ = combineLatest([this.control.valueChanges.pipe(
    //   withLatestFrom(this.options$),
    //   // map(([comment, users]) => this._filter(comment || '', users)),
    // ), 
    // fromEvent(this.elementRef.nativeElement, 'keydown').pipe(map((event: any) => {
    //   if (event.getModifierState('Shift') && event.keyCode === 50) {
    //     return true;
    //   } return false;
    // }))]).pipe(map(([[comment, users], isAtKey]) => {
    //   if (isAtKey) {
    //     return this._filter(comment || '', users);
    //   } return [];
    // }))
  }

  private _filter(value: string, users: User[]): User[] {
    console.log(this.isAtKeyActive);
    if (this.isAtKeyActive === false) {
      return [];
    }
    return users;
    const filterValue = value.toLowerCase().slice(1);
    console.log(filterValue, users);
    return users.filter(option => option.name.toLowerCase().includes(filterValue));
  }


}
