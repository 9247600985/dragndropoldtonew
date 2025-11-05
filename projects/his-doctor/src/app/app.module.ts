import { DataTablesModule } from 'angular-datatables';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FilterComponent } from './filter/filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from './file-upload/file-upload.component';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, Safe } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidenavBarComponent } from './sidenav-bar/sidenav-bar.component';
import { HdrnavBarComponent } from './hdrnav-bar/hdrnav-bar.component';
import { FooterBarComponent } from './footer-bar/footer-bar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { FooterMenuComponent } from './footer-menu/footer-menu.component';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { DeviceUtil } from './utils/DeviceUtil';
import { RegistrationComponent } from './registration/registration.component';
import { ModalComponent } from './modal/modal.component';
import { LoaderComponent } from './loader/loader.component';
import { ProfileComponent } from './profile/profile.component';
import { TableComponent } from './table/table.component';

import { JumbotronComponent } from './jumbotron/jumbotron.component';
import { ToastComponent } from './toast/toast.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SafeResourceUrlPipe } from './browser/safe-resource-url.pipe';
import { AlertComponent } from './alert/alert.component';
import { CardComponent } from './card/card.component';
import { PatientProfilesComponent } from './patient-profiles/patient-profiles.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SettingsComponent } from './settings/settings.component';
import { AutoFillComponent } from './auto-fill/auto-fill.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { BannerComponent } from './banner/banner.component';
import { AboutComponent } from './about/about.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { FaqComponent } from './faq/faq.component';
import { AuthInterceptorProvider } from './gateway/auth-interceptor';
import { DrawingToolComponent } from './drawing-tool/drawing-tool.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { TemplateComponent } from './template/template.component';

import { PatientComponent } from './patient/patient.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { DataTableComponent } from './data-table/data-table.component';
import { ServiceComponent } from './service/service.component';
//import { MarkdownModule } from 'ngx-markdown';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DragndropComponent } from './dragndrop/dragndrop.component';
import { WidgetComponent } from './widget/widget.component';
import { ToolBoxComponent } from './tool-box/tool-box.component';
import { DesignWidgetComponent } from './design-widget/design-widget.component';
import { DesignContainerComponent } from './design-container/design-container.component';
import { TabsWidgetComponent } from './tabs-widget/tabs-widget.component';
import { AccordionWidgetComponent } from './accordion-widget/accordion-widget.component';
import { ActionEditorComponent } from './action-editor/action-editor.component';
import { RichTextEditorComponent } from './rich-text-editor/rich-text-editor.component';
import { TabWidgetComponent } from './tab-widget/tab-widget.component';

import { ReportEngineComponent } from './report-engine/report-engine.component';
import { ReportDetailsComponent } from './report-details/report-details.component';
import { ReportTemplateComponent } from './report-template/report-template.component';
import { DrawingToolListComponent } from './drawing-tool-list/drawing-tool-list.component';
import { StyleEditorComponent } from './style-editor/style-editor.component';
import { ReportPreviewComponent } from './report-preview/report-preview.component';
import { SpeechTextComponent } from './speech-text/speech-text.component';
import { DialogPopupService } from './dialog-popup/dialog-popup.service';
import { DialogPopupModule } from './dialog-popup/dialog-popup.module';
import { FieldPopupComponent } from './field-popup/field-popup.component';
import { FieldEditorComponent } from './field-editor/field-editor.component';
import { ProviderPopupComponent } from './provider-popup/provider-popup.component';
import { ActionPopupComponent } from './action-popup/action-popup.component';
import { AppDetailsComponent } from './app-details/app-details.component';
import { DepartmentsComponent } from './departments/departments.component';
import { DepartmentSectionsComponent } from './department-sections/department-sections.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { InlineEditComponent } from './inline-edit/inline-edit.component';
import { TemplatePreviewComponent } from './template-preview/template-preview.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormTemplateComponent } from './form-template/form-template.component';
import { EscapeHtmlPipe } from './keep-html.pipe';
import { WidgetOptionsComponent } from './widget-options/widget-options.component';
import { DesignMatrixTableComponent } from './design-matrix-table/design-matrix-table.component';

@NgModule({
   declarations: [																																														
      EscapeHtmlPipe,	
      AppComponent,
      DepartmentSectionsComponent,
      DepartmentsComponent,
      LayoutComponent,
      SidenavBarComponent,
      HdrnavBarComponent,
      FooterBarComponent,
      DashboardComponent,
      LoginComponent,
      FooterMenuComponent,
      FileUploadComponent,
      RegistrationComponent,
      ModalComponent,
      LoaderComponent,
      ProfileComponent,
      TableComponent,
      JumbotronComponent,
      ToastComponent,
      SafeResourceUrlPipe,
      AlertComponent,
      CardComponent,
      //ImageCropperComponent,
      FilterComponent,
      PatientProfilesComponent,
      ChangePasswordComponent,
      SettingsComponent,
      AutoFillComponent,
      MenuBarComponent,
      ForgotPasswordComponent,
      //CameraOptionsComponent,
      BannerComponent,
      AboutComponent,
      PrivacyComponent,
      TermsComponent,
      FaqComponent,
      DrawingToolComponent,
      PatientDetailsComponent,
      TemplateComponent,
      InlineEditComponent,
      PatientComponent,
      TemplateListComponent,
      TemplatePreviewComponent,
      DataTableComponent,
      ServiceComponent,
      DragndropComponent,
      WidgetComponent,
      ToolBoxComponent,
      DesignWidgetComponent,
      DesignContainerComponent,
      TabsWidgetComponent,
      AccordionWidgetComponent,
      ActionEditorComponent,
      RichTextEditorComponent,
      TabWidgetComponent,
      ReportEngineComponent,
      ReportDetailsComponent,
      ReportTemplateComponent,
      DrawingToolListComponent,
      StyleEditorComponent,
      ReportPreviewComponent,
      SpeechTextComponent,
      FieldPopupComponent,
      FieldEditorComponent,
      ProviderPopupComponent,
      ActionPopupComponent,
      AppDetailsComponent,
      Safe,
      FormTemplateComponent,
      WidgetOptionsComponent,
      DesignMatrixTableComponent,
   ],
   imports: [
      DragDropModule,
      //MarkdownModule.forRoot(),
      DataTablesModule,
      RichTextEditorAllModule,
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      AppRoutingModule,
      FontAwesomeModule,
      AutocompleteLibModule,
      FormsModule,
      ToastrModule.forRoot(),
      //ImageCropperModule,
      ReactiveFormsModule,
      Ng2SearchPipeModule,
      DialogPopupModule,
      AngularResizedEventModule,
      TranslateModule.forRoot({
         loader: {
           provide: TranslateLoader,
           useFactory: HttpLoaderFactory,
           deps: [HttpClient]
         }
       })
   ],
   providers: [{provide: LocationStrategy, useClass: HashLocationStrategy},AuthInterceptorProvider,
      DeviceUtil, LoaderComponent, ToastComponent, DrawingToolComponent,
      //ImageCropperComponent, 
      AlertComponent, 
      SidenavBarComponent, PatientProfilesComponent,
      //CameraOptionsComponent, 
      AutoFillComponent, DialogPopupService
    ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
   return new TranslateHttpLoader(http);
 }