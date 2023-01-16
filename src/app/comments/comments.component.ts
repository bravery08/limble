import { Component, OnInit } from '@angular/core';
import { CommentsService } from '../services/comments.service';

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

  constructor(private commentsService: CommentsService) { 
    this.comments = [];
  }

  ngOnInit(): void {
    this.commentsService.getUsers().subscribe((users) => console.log(users))
  }

}
