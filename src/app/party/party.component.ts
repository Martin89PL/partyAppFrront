import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { FormGroup, FormControl,  Validators, FormBuilder } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { MapsAPILoader } from '@agm/core';
import { PartyListsService } from '../services/party-lists.service';


@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css']
})
export class PartyComponent implements OnInit {

  // save in db in future
  partyTypes = [
    {name: `Grill`, value: 1},
    {name: `Domówka`, value: 2},
    {name: `Urodziny`, value: 3},
    {name: `Klub`, value: 4},
    {name: `Bar/Pub`, value: 5}
  ];

  public partyForm: FormGroup;
  public searchControl: FormControl;
  public latitude: number;
  public longitude: number;

  constructor(
     private mapsAPILoader: MapsAPILoader,
     private ngZone: NgZone,
     private partyListsService: PartyListsService,
     private formBuilder: FormBuilder
  ) { }

  @ViewChild('search') public searchElementRef: ElementRef;

  ngOnInit() {
    this.partyForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'desc': [null, Validators.required],
      'type': [null, Validators.required],
      'private': [null, Validators.required]
    });

     this.searchControl = new FormControl();

     // load Places Autocomplete
     this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {

          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          console.log(place.geometry.location.lat());
          console.log(place.geometry.location.lng());

          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();

        });
      });
    });
  }

  onSubmit() {

    this.partyForm.value.latitude = this.latitude;
    this.partyForm.value.longitude = this.longitude;

    const newParty = this.partyForm.value;

    console.log(newParty);

    if (this.partyForm.value.latitude !== undefined && this.partyForm.value.longitude !== undefined) {
      this.partyListsService.create(newParty);
    }

  }

}
