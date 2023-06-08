import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-invoice-pay',
  templateUrl: './invoicePay.component.html',
  styleUrls: ['./invoicePay.component.scss']
})

export class InvoicePayComponent {

  // Form fields
  public identifier = '';
  public order = '';
  public concept = '';
  public amount = '';
  public Ds_SignatureVersion = '';
  public Ds_MerchantParameters = '';
  public Ds_Signature = '';

  // Flags
  public buttonDisabled = true;
  public loaded = false;

  constructor(
    private axiosApi: AxiosApi,
    private activeRoute: ActivatedRoute
  ) {

    // Get Redsys payment info
    this.activeRoute.params.subscribe((res) => {

      const id = res['id'];
      const url = environment.backURL + '/pay/' + id;
      this.axiosApi.get(url).then((res) => {
        const { data } = res;
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
