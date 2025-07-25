import {
  ChangeDetectionStrategy,
  ChangeDetectorRef, //might later call the function for uploads
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Employee } from '../employee.model';
import { Router } from '@angular/router';
import { EmployeeService } from '../employees.service';
import { HoverHighlightDirective } from '../../../shared/directives/hover-highlight.directive';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HoverHighlightDirective],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormComponent implements OnInit {
  @Input() existingEmployee: Employee | null = null;
  @Output() formSubmit = new EventEmitter<Employee>(); //the form has its own routing, the idea of using output
  //is not implemented anymore but I'm keeping it here to remind myself of using it elsewhere
  //then I'll remove it later

  form!: FormGroup;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.existingEmployee?.name || '', Validators.required],
      position: [this.existingEmployee?.position || '', Validators.required],
      department: [
        this.existingEmployee?.department || '',
        Validators.required,
      ],
      hireDate: [this.existingEmployee?.hireDate || '', Validators.required],
      status: [this.existingEmployee?.status || 'active', Validators.required],
      imageUrl: [this.existingEmployee?.imageUrl || '', Validators.required],
    });

    this.imagePreview = this.form.value.imageUrl;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const employee = this.form.value as Employee;

      if (employee.id) {
        this.employeeService.updateEmployee(employee.id, employee);
      } else {
        this.employeeService.addEmployee(employee); // Adds to service
      }

      // Go back to employee list
      this.router.navigate(['/employees']);
    }
  }

  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]; //gets the first file
    if (file) {
      const reader = new FileReader(); //FileReader  Api
      reader.onload = () => {
        //onload calls the function after reading file
        this.imagePreview = reader.result as string; //result holds the content of file that has been read, it's typed as string
        this.form.patchValue({ imageUrl: this.imagePreview });
        /* updating without creating a new object : this.form.get('imageUrl')?.setValue(this.imagePreview); **/
        this.cdr.detectChanges(); //no values tied to input or async pipe
      };
      reader.readAsDataURL(file); // instructs the FileReader to read the contents of the specified File
    }
  }
}
