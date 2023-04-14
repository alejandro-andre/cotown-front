import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AxiosResponse } from 'axios';
import axiosApi from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentComponent  {
  constructor(
    private route: ActivatedRoute,
  ) {}

  public  id: string = '';
  public concept: string = '';
  public amount: string = ''
  public order: string = '';
  public issueDate: string = '';
  public Ds_SignatureVersion: string ='';
  public Ds_MerchantParameters: string = '';
  public Ds_Signature: string = '';


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      axiosApi.getPaymentInfo(parseInt(this.id)).then((resp:AxiosResponse) => {
        const values = resp.data;
        this.concept = values.Concept
        this.amount = values.Amount;
        this.order = values.Order;
        this.issueDate = values.Issued_date;
        this.Ds_SignatureVersion = values.Ds_SignatureVersion;
        this.Ds_MerchantParameters = values.Ds_MerchantParameters;
        this.Ds_Signature = values.Ds_Signature;
      });
    });
  }
}
