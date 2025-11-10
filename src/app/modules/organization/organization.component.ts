import { NgFor, NgIf, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from 'app/core/angular-material-elements/material.module';
import { CommonService } from 'app/services/common.service';
import { OrganizationService } from 'app/services/organization.service';
import { Subject, takeUntil } from 'rxjs';
import { AddlistComponent } from '../admin/dashboards/app-dashboard/addlist/addlist.component';
import { MatDialog } from '@angular/material/dialog';
import { FuseCardComponent } from "../../../@fuse/components/card/card.component";

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, MaterialModule, AddlistComponent, FuseCardComponent]
})
export class OrganizationComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject();

  coverUrl: any;
  currentUser: any;
  organization = { imageURL: '', logo: '', oname: '', email: '', phone: '', state: '', country: '', address: '', city: '', pin: '' };
  aboutorg: string = 'Contact Info';
  orgAboutmeFlag: boolean;
  orgaboutEditFlag: boolean = false;
  orgaboutEdit: { email: string; phone: string; oname: string; };
  contactInfo = { phone: '', email: '' }
  orgpostFlag: boolean;
  // orgaboutEditFlag: boolean = false;

  constructor(
    private commonService: CommonService,
    private location: Location,
    private organizationService: OrganizationService,
    private _snackBar: MatSnackBar,
    private _matDialog: MatDialog,

  ) { }

  ngOnInit() {
    this.coverUrl = 'assets/images/pages/profile-bg/' + this.commonService.getRandom(1, 10) + '.jpg';
    this.currentUser = this.commonService.getItem('currentUser');
    // console.log(this.currentUser);
    this.getOrganization();
  }
  back() {
    this.location.back();
  }
  onFileSelect(files: FileList) {
    if (files.length > 0) {
      let fileItem = files.item(0);
      let formData = new FormData();
      formData.append('file', fileItem, fileItem.name);
      for (let key in this.organization) {
        if (key != 'imageURL') {
          formData.append(key, this.organization[key]);
        }
      }
      this.organizationService.upload(formData)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: response => {
            let organizations = JSON.parse(JSON.stringify(response));
            this.organization.logo = organizations.logo;
            // this.store.dispatch(updateUser({ user: user }));
            this.organization.imageURL = this.organizationService.orgLogo(this.organization.logo);
            this.commonService.currentUser.next(this.currentUser)
          },
          error: respError => {
            this._snackBar.open(respError, '', { duration: 3000, panelClass: ['error-snackbar'] });

          }
        });
    }

  }
  getOrganization() {
    this.organizationService
      .showByCode(this.currentUser.ocode)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          // console.log(response);
          let data = JSON.parse(JSON.stringify(response));
          this.organization = data;
          if (this.organization.logo) this.organization.imageURL = this.organizationService.orgLogo(this.organization.logo);
          // console.log(this.organization);

        },
        error: (respError) => {
          this._snackBar.open(respError, 'close', { duration: 2000, panelClass: 'error' });
        }
      });
  }
  Edit() {
    let dialogRef = this._matDialog.open(AddlistComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        data: this.organization,
        currentUser: this.currentUser,
        action: 'edit'
      }
    });

    dialogRef.afterClosed()
      .subscribe((response: any) => {
        if (!response) {
          return;
        }
        else this.organization = JSON.parse(JSON.stringify(response));

      });
  }
  editOrgAboutMe() {
    this.aboutorg = 'Edit Contact';
    this.orgaboutEditFlag = true;
    if (this.organization.phone) this.contactInfo.phone = JSON.parse(JSON.stringify(this.organization.phone));
    if (this.organization.email) this.contactInfo.email = JSON.parse(JSON.stringify(this.organization.email))
  }
  saveOrgAboutMe() {
    let obj = JSON.parse(JSON.stringify(this.organization));

    obj['phone'] = this.contactInfo.phone;
    obj['email'] = this.contactInfo.email;
    obj['userid'] = this.currentUser.userid;
    // console.log(obj);


    delete obj.imageURL;
    this.organizationService
      .update(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: response => {
          let organizations = JSON.parse(JSON.stringify(response));
          this.organization = JSON.parse(JSON.stringify(organizations));
          this.organization.imageURL = this.organizationService.orgLogo(this.organization.logo);
          this.aboutorg = 'Contact Info';
          this.orgaboutEditFlag = false;
        },
        error: respError => {
          this._snackBar.open(respError, '', { duration: 3000, panelClass: ['error-snackbar'] });
        }
      })
  }
  cancelorg() {
    this.aboutorg = 'Contact Info';
    this.contactInfo.phone = '';
    this.contactInfo.email = '';
    this.orgaboutEditFlag = false;
  }
}
