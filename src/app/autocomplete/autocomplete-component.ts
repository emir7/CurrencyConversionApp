import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map,
  Subscription,
} from 'rxjs';

import { DocumentListenerService } from '../shared';
import { AutocompleteItem } from './models';

@Component({
  selector: 'autocomplete',
  templateUrl: 'autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit, OnDestroy {
  @Input()
  public labelText: string;

  @Input()
  public fullList: Array<AutocompleteItem> = [];

  @Input()
  public inputId: string;

  @Input('searchText')
  public set searchTextValue(searchText: string) {
    this.searchText = searchText;
    this.searchTextSource.next(this.searchText);
  }

  @Output()
  public valueChanged = new EventEmitter<string>();

  @ViewChildren('autocompleteElement', { read: ElementRef })
  public autocompleteElements: QueryList<ElementRef>;

  @ViewChild('autocompleteInput')
  public autocompleteInput: ElementRef;

  public searchText: string = '';
  public searchTextSource = new BehaviorSubject(this.searchText);
  public filteredList: Array<AutocompleteItem> = [];
  public activeElementIndex: number = -1;
  public subscriptions = new Subscription();
  public isAutocompleteListDisplayed: boolean = false;

  public constructor(
    private readonly documentListenerService: DocumentListenerService,
  ) {}

  public ngOnInit(): void {
    this.setSubscriptions();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onTextChange(): void {
    this.searchTextSource.next(this.searchText);
  }

  public onFocus(): void {
    this.isAutocompleteListDisplayed = true;
  }

  public onKeyDown(): void {
    if (this.activeElementIndex + 1 >= this.filteredList.length) {
      return;
    }

    this.unHighlightPreviousActiveElement();
    this.activeElementIndex++;

    this.autocompleteElements
      .toArray()
      [this.activeElementIndex].nativeElement.scrollIntoView();
    this.filteredList[this.activeElementIndex].isHighlighted = true;
  }

  public onKeyUp(): void {
    if (this.activeElementIndex - 1 < 0) {
      return;
    }

    this.unHighlightPreviousActiveElement();
    this.activeElementIndex--;
    this.autocompleteElements
      .toArray()
      [this.activeElementIndex].nativeElement.scrollIntoView();
    this.filteredList[this.activeElementIndex].isHighlighted = true;
  }

  public onKeyEnter(): void {
    if (this.activeElementIndex < 0) {
      return;
    }

    this.onAutocompleteItemSelect(this.filteredList[this.activeElementIndex]);
  }

  public onAutocompleteItemSelect(autocompleteItem: AutocompleteItem): void {
    this.unHighlightPreviousActiveElement();
    this.activeElementIndex = -1;
    this.isAutocompleteListDisplayed = false;
    this.autocompleteInput.nativeElement.blur();
    this.searchText = autocompleteItem.value;
    this.searchTextSource.next(this.searchText);
    this.valueChanged.emit(autocompleteItem.value);
  }

  private setSubscriptions(): void {
    this.subscriptions.add(
      this.documentListenerService.documentClickEvent.subscribe(
        (mouseEvent: MouseEvent) => {
          if (mouseEvent.target instanceof Element) {
            this.isAutocompleteListDisplayed = mouseEvent.target.isSameNode(
              this.autocompleteInput.nativeElement,
            );
          }
        },
      ),
    );

    this.subscriptions.add(
      this.searchTextSource
        .pipe(
          distinctUntilChanged(),
          debounceTime(100),
          map((searchText: string) => this.filterItems(searchText)),
        )
        .subscribe((filteredList: Array<AutocompleteItem>) => {
          this.activeElementIndex = -1;
          this.filteredList = filteredList;
        }),
    );
  }

  private unHighlightPreviousActiveElement(): void {
    if (this.activeElementIndex < 0) {
      return;
    }

    this.filteredList[this.activeElementIndex].isHighlighted = false;
  }

  private filterItems(searchText: string): Array<AutocompleteItem> {
    if (!this.searchText.length) {
      return this.fullList;
    }

    return this.fullList
      .filter((autocompleteItem: AutocompleteItem) => {
        return autocompleteItem.value
          .toLowerCase()
          .includes(searchText.toLowerCase());
      })
      .map((autocompleteItem: AutocompleteItem) => {
        return {
          ...autocompleteItem,
          isHighlighted: false,
        };
      });
  }
}
