import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';
import { AccessTokenService } from '../../services/access-token.service';


@Component({
  selector: 'app-cotown-modal',
  templateUrl: './cotown-modal.component.html',
  styleUrls: ['./cotown-modal.component.scss']
})
export class CotownModal {
  public cities: any [] = [];
  public selectedCitie = '';
  public selectedBuilding = '';
  public buildings: any [] = [];
  public resources: any[] = [];
  displayedColumns: string[] = ['Code', 'type'];

  private citieQuery= `{
    Geo_LocationList {
      id,
      Name
    }
  }`;


  constructor(
    private route: ActivatedRoute,
    public accessToken: AccessTokenService,
    private apolloApi: ApoloQueryApi
  ) { }


  get cityName(): string {
    if (this.selectedCitie) {
      return this.cities.find((cit) => cit.id === this.selectedCitie).Name;
    }

    return '';
  }

  ngOnInit() {
    this.apolloApi.getData(this.citieQuery).subscribe((result) => {
      this.cities = result.data.Geo_LocationList;
    });

  }

  onSelectCity() {
    console.log('CityName: ', this.cityName)
    const  buildingQuery = `{
      Building_BuildingList{
        Name
        Code
        DistrictViaDistrict_id(joinType: INNER){LocationViaLocation_id(joinType: INNER where:{Name:{EQ:"${this.cityName}"}}){Name}}}
    }`;

    this.apolloApi.getData(buildingQuery).subscribe(res => {
      console.log(res.data.Building_BuildingList)
      this.buildings = res.data.Building_BuildingList;
    })
  }

  onSelectBuilding() {
    this.resources = [];
    const resourcesQuery = `
    {
      Resource_ResourceList {
          Code,
          Building_id,
          Address,
          Search,
          Billing_type,
          Resource_type,
          Resource_place_typeViaPlace_type_id {
              Name,
              Code
          }
          BuildingViaBuilding_id(joinType: INNER where: {Code: {EQ: "${this.selectedBuilding}"}} ){
              Name,
              Code,
              Address,
              Booking_fee,
          }
      }
  }`;


    this.apolloApi.getData(resourcesQuery).subscribe(res => {
      const result = res.data.Resource_ResourceList;
      for(const elem of result) {
        this.resources.push({
          Code: elem.Code,
          type: elem.Resource_place_typeViaPlace_type_id?.Code || ''
        });
      }
    })
  }
}
