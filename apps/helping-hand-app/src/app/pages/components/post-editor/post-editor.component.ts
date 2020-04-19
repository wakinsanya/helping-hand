import { Component, Input, Output, EventEmitter } from '@angular/core';
// import Quill from 'quill';
// import { ImageResize } from 'quill-image-resize-module';

// Quill.register('modules/imageResize', ImageResize);

@Component({
  selector: 'helping-hand-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss']
})
export class PostEditorComponent {
  @Input() title: string;
  @Input() content: string;
  @Output() contentChange = new EventEmitter<string>();
  editorModules = {};

  constructor() {
    this.editorModules = {
      toolbar: {
        container: [
          [{ font: [] }],
          [{ size: ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ header: 1 }, { header: 2 }],
          [{ color: [] }, { background: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['link', 'image']
        ]
      },
      imageResize: {}
    };
  }

  onContentChange() {
    this.contentChange.emit(this.content);
  }
}
