import { PatientDetailsComponent } from './../patient-details/patient-details.component';
import { Routes } from '@angular/router';
//import { ImageCropperComponent } from '../image-cropper/image-cropper.component';
import { SettingsComponent } from '../settings/settings.component';
import { TemplateListComponent } from '../template-list/template-list.component';
import { TemplateComponent } from '../template/template.component';
import { TemplatePreviewComponent } from '../template-preview/template-preview.component';
import { DrawingToolComponent } from '../drawing-tool/drawing-tool.component';
import { ServiceComponent } from '../service/service.component';
import { ProfileComponent } from '../profile/profile.component';
import { ActionEditorComponent } from '../action-editor/action-editor.component';
import { ReportTemplateComponent } from '../report-template/report-template.component';
import { ReportDetailsComponent } from '../report-details/report-details.component';
import { StyleEditorComponent } from '../style-editor/style-editor.component';
import { ReportPreviewComponent } from '../report-preview/report-preview.component';
import { ReportEngineComponent } from '../report-engine/report-engine.component';
import { SpeechTextComponent } from '../speech-text/speech-text.component';
import { FieldEditorComponent } from '../field-editor/field-editor.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AppDetailsComponent } from '../app-details/app-details.component';
import { DepartmentsComponent } from '../departments/departments.component';
import { DepartmentSectionsComponent } from '../department-sections/department-sections.component';

export const LayoutRoutes: Routes = [

    { path: 'main',      component: DashboardComponent },
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'patient-details',      component: PatientDetailsComponent },
    { path: 'settings', component: SettingsComponent},
    { path: 'security', component: SettingsComponent},
    { path: 'profile', component: ProfileComponent},
   // { path: 'image-cropper',      component: ImageCropperComponent },

    { path: 'template',      component: TemplateComponent },
    { path: 'templatePreview',      component: TemplatePreviewComponent },
    { path: 'template-list',      component: TemplateListComponent },
    { path: 'service',      component: ServiceComponent },
    { path: 'drawing',      component: DrawingToolComponent },        
    { path:  'examForm/:id', component:  TemplatePreviewComponent},
    { path:  'action-editor', component: ActionEditorComponent },

    { path:  'report-template', component: ReportTemplateComponent },
    { path: 'report-preview',      component: ReportPreviewComponent },
    { path:  'report-details', component: ReportDetailsComponent },
    { path:  'report-engine', component: ReportEngineComponent },
    
    { path:  'style-editor', component: StyleEditorComponent },
    { path:  'speech-text', component: SpeechTextComponent },
    { path:  'field-editor', component: FieldEditorComponent },
    
    { path:  'app-details', component: AppDetailsComponent },

    { path:  'departments', component: DepartmentsComponent },
    { path:  'sections', component: DepartmentSectionsComponent },
];
