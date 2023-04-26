import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Customer } from 'src/app/models/Customer.model';
import { customerQuery } from 'src/app/schemas/query-definitions/customer.query';
import { genderQuery } from 'src/app/schemas/query-definitions/gender.query';
import { ApoloQueryApi } from 'src/app/services/apolo-api.service';
import { CustomerService } from 'src/app/services/customer.service';
import { GenderService } from 'src/app/services/gender.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit {
  constructor(
    private router: Router,
    private apolloApi: ApoloQueryApi,
    private customerService: CustomerService,
    public authService: AuthService,
    public genderService: GenderService
  ) {}

  onSelectOption(data: string): void {
    this.router.navigate([`customer/${data}`]);
  }

   ngOnInit(): void {
    const variables = {
      id: 1
    }

    this.authService.getAirflowsToken().then(() => {

      this.apolloApi.getData(genderQuery).subscribe((res) => {
        const value = res.data;

        if (value && value.genders) {
          this.genderService.setGenderData(value.genders);
        }
        console.log('The data is : ', value)
      });

      this.apolloApi.getData(customerQuery, variables).subscribe((res) => {
        const value = res.data.data;
        if (value && value.length) {
          const {
            name , province, city, country,adress, postal_code, document, email, phones,
            gender_id
          } = value[0];

          const customer = new Customer(
            name, province, city, country.id, adress, postal_code, document, email, phones, gender_id
          );

          this.customerService.setCustomerData(customer);
          console.log(value[0]);
        }
      });

    })

  }
}
