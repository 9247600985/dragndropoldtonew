import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  title = 'Status';

  constructor(private toastr: ToastrService) { }

  showSuccess(message:string) {    
      this.toastr.success(message, 'Info',
      {timeOut: 4000});
  }
  showError(message:string) {    
    this.toastr.error(message, 'Error', {
      timeOut: 4000
    });  
  }
}
