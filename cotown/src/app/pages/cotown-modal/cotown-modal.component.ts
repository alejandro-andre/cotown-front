import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
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
      console.log(result.data.Geo_LocationList);
      this.cities = result.data.Geo_LocationList;
    });

  }

  onSelectCity() {
    const  buildingQuery = `{
      Building_BuildingList{
        Name
        Code
        DistrictViaDistrict_id(joinType: INNER){LocationViaLocation_id(joinType: INNER where:{Name:{EQ:"${this.cityName}"}}){Name}}}
    }`;

    this.apolloApi.getData(buildingQuery).subscribe(res => {
      console.log(res)
    })

  }
}
