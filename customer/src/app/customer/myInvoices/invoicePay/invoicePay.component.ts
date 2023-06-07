import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AxiosApi } from 'src/app/services/axios-api.service';

@Component({
  selector: 'app-my-invoice-pay',
  templateUrl: './invoicePay.component.html',
  styleUrls: ['./invoicePay.component.scss']
})

export class InvoicePayComponent {
  public identifier = '';
  public order = '';
  public concept = '';
  public amount = '';
  public Ds_SignatureVersion = '';
  public Ds_MerchantParameters = '';
  public Ds_Signature = '';
  public buttonDisabled = true;
  public loaded = false;

  constructor(
    private axiosApi: AxiosApi,
    private activeRoute: ActivatedRoute
  ) {
    this.activeRoute.params.subscribe((res) => {
      const id = res['id'];
      const url = `https://dev.cotown.ciber.es/api/v1/pay/${id}`;
      this.axiosApi.get(url).then((resp) => {
        const { data } =resp;
        if (data) {
          this.amount = data.Amount;
          this.identifier = data.id;
          this.concept = data.Concept;
          this.order = data.Payment_order;
          this.Ds_Signature = data.Ds_Signature;
          this.Ds_MerchantParameters = data.Ds_MerchantParameters;
          this.Ds_SignatureVersion = data.Ds_SignatureVersion;
          this.buttonDisabled = false;
          this.loaded = true;
        }
      })
    });
  }
}
