import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ElementRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { fromEvent } from 'rxjs';


@Component({
  selector: 'app-custom-select',
  templateUrl: './app-custom-select.component.html',
  styleUrls: ['./app-custom-select.component.css']
})
export class CustomSelectComponent implements OnInit {
  @Input() placeholderLabel = 'Choose...';
  @Input() labelKey = 'name';
  @Input() idKey = 'id';
  @Input() options = [];
  @Input() defaultValue = '';
  @Output() selectChange = new EventEmitter();
  isOpened: boolean = false;
  model: any;

  visibleOptions = 4;
  searchControl = new FormControl();

  private originalOptions = [];

  constructor(private cdr: ChangeDetectorRef, private elRef: ElementRef) { }

  ngOnInit() {
    this.originalOptions = [...this.options]; 
    this.searchControl.valueChanges 
      .pipe(
        debounceTime(300),
      )
      .subscribe(term => this.search(term));
  }

  get label() {
    return this.model ? this.model[this.labelKey] : this.placeholderLabel;
  }

  search(value: string) {
    this.options = this.originalOptions.filter(option => option[this.labelKey].includes(value));
    requestAnimationFrame(() => (this.visibleOptions = this.options.length || 1));
  }


  open() {
    this.isOpened = true;
    this.handleClickOutside();
  }

  select(option) {
    this.model = option;
    this.selectChange.emit(this.model);
    this.close();
  }
 
  private handleClickOutside() {
    fromEvent(document, 'click')
      .pipe(
        filter(({ target }) => {
          const origin = this.elRef.nativeElement.querySelector('.select-trigger');
          return origin.contains(target as HTMLElement) === false;
        }),
      )
      .subscribe(() => {
        this.close();
      });
  }

  close() {
    this.isOpened = false;
    this.searchControl.patchValue('');
  }
}