import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  comment = '';
  comments: string[] = [];

  postComment() {
    this.comments.push(this.comment);
    this.comment = '';
  }

  constructor() { 
    this.comments = [];
  }

  ngOnInit(): void {
  }

}
