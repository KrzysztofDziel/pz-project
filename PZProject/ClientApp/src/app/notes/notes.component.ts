import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  token: any;
  iterator = 0;
  GroupNotesArray = [];
  selectedGroupId: any;
  isLoading = true;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedGroupId = params['id'];
    })
    this.token = localStorage.getItem('id_token');
    this.displayGroupNotes();
  }

  addGroupNotesToArray(result: Object | { [x: string]: any }[]) {
    while (result[this.iterator]) {
      this.GroupNotesArray.push({
        NoteId: result[this.iterator]['id'],
        NoteName: result[this.iterator]['name'],
        CreatorId: result[this.iterator]['creatorId'],
        description: result[this.iterator]['description']
      });

      this.iterator++;
    }
  }

  displayGroupNotes() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.token
      })
    };
    this.http
      .get('https://pzproject.azurewebsites.net/groups/' + this.selectedGroupId + '/notes', httpOptions)
      .subscribe(
        result => {
          this.addGroupNotesToArray(result);
          this.isLoading = false;
        },
        error => console.error(error)
      );
  }

  createNote() {
    this.router.navigate(['/groups/' + this.selectedGroupId + '/notes/create']);
  }

  deleteNote(noteId: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token
      }),
      body: {
        NoteId: noteId
      }
    };

    this.http.delete('https://pzproject.azurewebsites.net/groups/' + this.selectedGroupId + '/notes/delete', httpOptions).subscribe(result => {
      window.location.reload();
    }, error => console.error(error));
  }

  updateNote(NoteId: any) {
    this.router.navigate(['/groups/' + this.selectedGroupId + '/notes' + '/edit/' + NoteId])
  }
}

